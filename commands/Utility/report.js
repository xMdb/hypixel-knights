const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config');
const dayjs = require('dayjs');

// Setup command
module.exports = {
   name: 'report',
   description: 'Report a user',
   async execute(interaction, bot) {
      const data = {
         name: this.name,
         description: this.description,
         options: [
            {
               name: 'offender',
               type: 'USER',
               description: 'Select the user that you are reporting.',
               required: true,
            },
            {
               name: 'channel',
               type: 'CHANNEL',
               description: 'Select the channel it occurred in.',
               required: true,
            },
            {
               name: 'reason',
               type: 'STRING',
               description: 'Enter the reason why this user and message breaks the rules. Refer to #rules.',
               required: true,
            },
            {
               name: 'evidence',
               type: 'STRING',
               description:
                  'Please provide evidence such as a link to an image, message, or the channel it is/was happening in.',
               required: true,
            },
         ],
      };
      const buttons = new MessageActionRow().addComponents(
         new MessageButton().setCustomId('done').setLabel('Completed').setStyle('SUCCESS').setEmoji(`828791608454676510`),
         new MessageButton()
            .setCustomId('invalid')
            .setLabel('Invalid Report')
            .setStyle('DANGER')
            .setEmoji(`674069087902498824`)
      );
      const buttonsDisabled = new MessageActionRow().addComponents(
         new MessageButton()
            .setCustomId('done')
            .setLabel('Completed')
            .setStyle('SUCCESS')
            .setEmoji(`828791608454676510`)
            .setDisabled(true),
         new MessageButton()
            .setCustomId('invalid')
            .setLabel('Invalid Report')
            .setStyle('DANGER')
            .setEmoji(`674069087902498824`)
            .setDisabled(true)
      );
      await bot.guilds.cache.get(config.ids.server)?.commands.create(data);
      await bot.guilds.cache.get(config.ids.testingServer)?.commands.create(data);
      const user = interaction.options.getUser('offender');
      const channel = interaction.options.getChannel('channel');
      const evidence = interaction.options.getString('evidence');
      const reason = interaction.options.getString('reason');
      const unix = dayjs().unix();

      const msgs = [
         `Another naughty person has arrived!`,
         `OMG.. PHENOM?!?`,
         `Where Phenom tho`,
         `Uh oh!`,
         `Another sussy baka has arrived!`,
         `Another one!`,
         `Reeled one in!`,
      ];
      const index = Math.floor(Math.random() * (msgs.length - 1) + 1);

      // Embeds
      const received = new MessageEmbed()
         .setTitle('Report Received')
         .setColor(config.colours.success)
         .setDescription(`Staff have received your report for ${user}. Thanks for reporting!`)
         .setTimestamp()
         .setFooter(config.messages.footer, interaction.user.displayAvatarURL({ dynamic: true }));
      const reportLog = new MessageEmbed()
         .setTitle(msgs[index])
         .setColor(config.colours.informational)
         .setDescription(
            `**Time**: <t:${unix}:f> (<t:${unix}:R>)\n**Channel**: ${channel}\n**Reporter**: ${
               interaction.user
            }\n\n**Offender**: ${user}\n**Reason**: ${reason}\n**Evidence**: ${
               evidence ?? "No evidence provided. This shouldn't appear!"
            })`
         )
         .setTimestamp()
         .setFooter(`Click a button to mark the report as either completed or invalid`);

      bot.channels.cache
         .get('667551356684599297')
         .send({ content: `<@&762473575277133824>`, embeds: [reportLog], components: [buttons] });
      interaction.reply({ embeds: [received], ephemeral: true });

      // button press
      bot.on(`interactionCreate`, async (buttonPressed) => {
         if (!buttonPressed.isButton()) return;
         await buttonPressed.deferUpdate();
         if (buttonPressed.customId === 'done') {
            const dealtWith = reportLog
               .setTitle(msgs[index])
               .setColor(config.colours.success)
               .setFooter(`This report has been dealt with`);
            buttonPressed.editReply({ embeds: [dealtWith], components: [buttonsDisabled] });
            return buttonPressed.followUp({
               content: `<:salute:760538131069272105> ${buttonPressed.user} has **dealt with** this report!`,
            });
         }
         if (buttonPressed.customId === 'invalid') {
            const invalid = reportLog
               .setTitle(msgs[index])
               .setColor(config.colours.error)
               .setFooter(`This report has been marked invalid`);
            buttonPressed.editReply({ embeds: [invalid], components: [buttonsDisabled] });
            return buttonPressed.followUp({
               content: `<:emergency:762346686541463593> ${buttonPressed.user} has marked this report as **invalid**!`,
            });
         }
      });
   },
};
