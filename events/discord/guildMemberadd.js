const { blacklisted } = require('../../blacklist');
const chalk = require('chalk');
const config = require('../../config');

module.exports = {
   name: 'guildMemberAdd',
   runOnce: false,
   async execute(member) {
      const channel = member.guild.channels.cache.find((ch) => ch.id === config.ids.logChannel);
      if (!channel || member.guild.id !== config.ids.server) return;
      for (badWord in blacklisted) {
         const newAccount = Date.now() - member.user.createdAt < 1000 * 60 * 60 * 24;
         const i = blacklisted.indexOf(badWord);
         
         // have to include the long blacklist checker in each if statement because of how for loops work
         if (newAccount && member.user.username.toLowerCase().includes(badWord.toLowerCase())) {
            channel.send({
               content: `<@&762473575277133824>\n\n:no_entry_sign: User ${member} / ${member.user.username} has been **detected by the blacklisted usernames filter** and their account has been **created within the past 24 hours**. Most likely an alt!`,
            });
            console.log(chalk.redBright(`User ${member.user.username} is an alt`));
            return;
         }
         if (
            newAccount &&
            !member.user.username.toLowerCase().includes(badWord.toLowerCase()) &&
            i === blacklisted.length - 1
         ) {
            channel.send({
               content: `<@&762473575277133824>\n\n:information_source: The account ${member} / ${member.user.username} has been **created within the past 24 hours**. If you know their name, it's probably an alt.`,
            });
            console.log(chalk.yellowBright(`User ${member.user.username} is a new account`));
            return;
         }
         if (member.user.username.toLowerCase().includes(badWord.toLowerCase())) {
            channel.send({
               content: `<@&762473575277133824>\n\n:warning: User ${member} / ${member.user.username} has been **detected by the blacklisted usernames filter**. Maybe it's time for the ban hammer?`,
            });
            console.log(chalk.redBright(`User ${member.user.username} matched blacklist filter`));
            return;
         }
      };
   },
};
