const blacklist = require('../../blacklist');
const chalk = require('chalk');

module.exports = {
   name: 'guildMemberAdd',
   runOnce: false,
   async execute(member) {
      const channel = member.guild.channels.cache.find((ch) => ch.name === 'chat-mods');
      if (!channel) return;
      for (const users in blacklist.blacklisted) {
         // New Account and Blacklisted Detector
         if (
            member.user.username.toLowerCase().includes(blacklist.blacklisted[users].toLowerCase()) &&
            Date.now() - member.user.createdAt < 1000 * 60 * 60 * 24
         ) {
            channel.send({
               content: `<@&762473575277133824>\n\n:no_entry_sign: User ${member} / ${member.user.username} has been **detected by the blacklisted usernames filter** and their account has been **created within the past 24 hours**. Most likely an alt!`,
            });
            console.log(chalk.redBright(`User ${member.user.username} is an alt`));
            return;
         }
         // Blacklisted Username Detector
         if (member.user.username.toLowerCase().includes(blacklist.blacklisted[users].toLowerCase())) {
            channel.send({
               content: `<@&762473575277133824>\n\n:warning: User ${member} / ${member.user.username} has been **detected by the blacklisted usernames filter**. Maybe it's time for the ban hammer?`,
            });
            console.log(chalk.redBright(`User ${member.user.username} matched blacklist filter`));
            return;
         }
      }
   },
};
