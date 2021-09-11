// ██████ Integrations █████████████████████████████████████████████████████████

require('dotenv').config();
const fs = require('fs');
const { Client, Intents, Collection, WebhookClient } = require('discord.js');
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

process.on('uncaughtException', (err) => console.error(err)).on('unhandledRejection', (err) => console.error(err));

// —— Login the bot
bot.login(process.env.BOT_TOKEN);
