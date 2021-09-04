const { MessageEmbed } = require('discord.js');
const config = require('../../config');
const dayjs = require('dayjs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // eslint-disable-line
const chalk = require('chalk');

// Setup command
module.exports = {
   name: 'jim',
   description: 'Use this command to be added to the Justified Inactive Members (JIM) list',
   async execute(interaction, bot) {
      const data = {
         name: this.name,
         description: this.description,
         defaultPermission: false,
         options: [
            {
               name: 'ign',
               type: 'STRING',
               description: 'Your in-game name',
               required: true,
            },
            {
               name: 'duration',
               type: 'INTEGER',
               description: 'How long will you be away for (in days)',
               required: true,
            },
            {
               name: 'reason',
               type: 'STRING',
               description: 'What is the reason you will be away? Please provide a valid reason (see #information)',
               required: true,
            },
         ],
      };
      // —— Set command permissions
      const permissions = [
         {
            id: config.ids.memberRole,
            type: 'ROLE',
            permission: true,
         },
      ];
      const commandProd = await bot.guilds.cache.get(config.ids.server)?.commands.create(data);
      const commandDev = await bot.guilds.cache.get(config.ids.testingServer)?.commands.create(data);
      await commandProd.permissions.add({ permissions });
      await commandDev.permissions.add({ permissions });

      const getIgn = interaction.options.getString('ign');
      const duration = interaction.options.getInteger('duration');
      const reason = interaction.options.getString('reason');
      const expiration = dayjs(dayjs().add(duration, 'day')).unix();
      const jimRole = interaction.guild.roles.cache.find((role) => role.id === '649796999033520150');
      await interaction.deferReply({ ephemeral: true });

      const res = await fetch(`https://playerdb.co/api/player/minecraft/${getIgn}`).then((response) => response.json());
      if (!res.data.player) {
         console.error(chalk.redBright(`There was an invalid username or API error for username: ${getIgn}`));
         return interaction.editReply({
            content: `Invalid username! ...or uh, maybe the API is down. Anyways, please try again.`,
            ephemeral: true,
         });
      }
      const ign = res.data.player.username;
      const avatar = `https://cravatar.eu/avatar/${ign}/600.png`;

      // Embeds
      const successKnown = new MessageEmbed()
         .setTitle('Successfully added you to the JIM list!')
         .setColor(config.colours.success)
         .setDescription(`**IGN:** ${ign}\n**Reason**: ${reason}\n**Expires:** <t:${expiration}:R>`)
         .setTimestamp()
         .setFooter(
            `Please contact a staff member if this is incorrect or a mistake!`,
            interaction.user.displayAvatarURL({ dynamic: true })
         );
      const failed = new MessageEmbed()
         .setTitle('JIM - Not Required')
         .setColor(config.colours.error)
         .setDescription(
            `Good news! Because **your duration is less than 1 week**, you do not have to be added to the JIM list. Please only use this command if you are going to be **inactive for more than a week**. If you are unsure, please give your best estimate.`
         )
         .setTimestamp()
         .setFooter(`See #information for more information`, interaction.user.displayAvatarURL({ dynamic: true }));
      const jimEmbedKnown = new MessageEmbed()
         .setAuthor(ign, avatar)
         .setColor(`#546E7A`)
         .setDescription(
            `**Discord:** ${interaction.user}\n**Reason**: ${reason}\n**Duration**: ${duration} days\n**Expires:** <t:${expiration}:R>`
         )
         .setTimestamp();
      if (duration < 7) {
         return interaction.editReply({ embeds: [failed], ephemeral: true });
      }
      interaction.member.roles.add(jimRole, `Added ${interaction.user.username} to JIM`);
      if (duration >= 30) {
         bot.channels.cache
            .get('520959821617561600')
            .send({ content: `Duration is **over 30 days**.`, embeds: [jimEmbedKnown] });
         return interaction.editReply({ embeds: [successKnown], ephemeral: true });
      }
      bot.channels.cache.get('520959821617561600').send({ embeds: [jimEmbedKnown] });
      interaction.editReply({ embeds: [successKnown], ephemeral: true });
   },
};
