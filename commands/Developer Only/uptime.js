const { MessageEmbed } = require('discord.js');
const config = require('../../config');

module.exports = {
   name: 'uptime',
   description: 'Displays the current uptime of the bot (bot owner only)',
   async execute(interaction, bot) {
      const data = {
         name: this.name,
         description: this.description,
         defaultPermission: false,
      };
      // —— Set command permissions
      const permissions = [
         {
            id: config.ids.owner,
            type: 'USER',
            permission: true,
         },
      ];
      const commandProd = await bot.guilds.cache.get(config.ids.server)?.commands.create(data);
      const commandDev = await bot.guilds.cache.get(config.ids.testingServer)?.commands.create(data);
      await commandProd.permissions.add({ permissions });
      await commandDev.permissions.add({ permissions });

      const days = Math.floor(process.uptime() / 86400);
      const hours = Math.floor(process.uptime() / 3600) % 24;
      const minutes = Math.floor(process.uptime() / 60) % 60;
      const seconds = Math.floor(process.uptime() % 60);

      const uptimeEmbed = new MessageEmbed()
         .setTitle('Bot Uptime')
         .setColor(config.colours.success)
         .setDescription(
            `Time since last restart:\n\n**${days}** day(s)\n**${hours}** hour(s)\n**${minutes}** minute(s)\n**${seconds}** second(s)`
         )
         .setTimestamp()
         .setFooter(config.messages.footer);
      interaction.reply({
         embeds: [uptimeEmbed],
      });
   },
};
