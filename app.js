// ██████ Integrations █████████████████████████████████████████████████████████

require('dotenv').config();
const fs = require('fs');
const { Client, Intents, Collection, WebhookClient, MessageEmbed } = require('discord.js');
const bot = new Client({
   allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
   intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS],
});
const config = require('./config');

// ██████ Discord Bot: Initialization ██████████████████████████████████████████

const discordEvents = fs.readdirSync('./events/discord').filter((file) => file.endsWith('.js'));
for (const file of discordEvents) {
   const event = require(`./events/discord/${file}`);
   if (event.runOnce) {
      bot.once(event.name, (...args) => event.execute(...args));
   } else {
      bot.on(event.name, (...args) => event.execute(...args));
   }
}

bot.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
   const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
   for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      bot.commands.set(command.name, {
         name: command.name,
         category: folder,
         description: command.description,
         execute: command.execute,
      });
   }
}

// ██████ Discord Bot: Command Handler █████████████████████████████████████████

bot.on('interactionCreate', async (interaction) => {
   // —— Run command
   if (!bot.commands.has(interaction.commandName)) return;
   if (!interaction.isCommand() && !interaction.isContextMenu()) return;
   try {
      await bot.commands.get(interaction.commandName).execute(interaction, bot);
   } catch (err) {
      const webhook = new WebhookClient({
         url: process.env.ERROR_WEBHOOK,
      });
      console.error(err);
      await interaction.reply({
         content: config.messages.errorDev,
         ephemeral: true,
      });
      webhook.send(`**General command error:** \`\`\`${err}\`\`\``);
   }
});

// define counter and decrease by 1 every minute and a bit unless it is already at 0
let counter = 0;
setInterval(() => {
   if (counter === 0) return;
   else return counter--;
}, 1000 * 90);

// create a counter that increments every time the guildMemberAdd event is fired and detect when it reaches 3
bot.on('guildMemberAdd', async (member) => {
   // if the counter is 3, reset it and send the message
   if (counter === 3) {
      counter = 0;
      const recentMembers = member.guild.members.cache.filter((m) => m.joinedAt > Date.now() - 1000 * 60 * 60);
      const recentEmbed = new MessageEmbed()
         .setColor(config.colours.error)
         .setTitle('Members Joined in the Past Hour')
         .setDescription(
            recentMembers
               .map((recent) => `<@${recent.user.id}> / ${recent.user.username}#${recent.user.discriminator}`)
               .join('\n')
         )
         .setTimestamp()
         .setFooter(config.messages.footer);
      member.guild.channels.cache
         .find((ch) => ch.id === config.ids.logChannel)
         .send({
            content: `🚨 <@&${config.ids.moderatorRole}> 🚨\n\nThere has been at least 3 people joining in the past minute or two, and the counter has passed the alert threshold. We could be getting raided! Check <#520963360926334996>!\n\n`,
            embeds: [recentEmbed],
         });
      console.log(`Raid detected!`);
      return;
   } else {
      // if the counter is not 3, increment it
      return counter++;
   }
});

process.on('uncaughtException', (err) => console.error(err)).on('unhandledRejection', (err) => console.error(err));

// —— Login the bot
bot.login(process.env.BOT_TOKEN);
