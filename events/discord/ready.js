const chalk = require('chalk');

module.exports = {
   name: 'ready',
   runOnce: true,
   async execute(bot) {
      console.log(chalk.greenBright(`Success! ${bot.user.username} is now online!`));
      bot.user.setPresence({ activities: [{ name: '#general!', type: 'WATCHING' }], status: 'idle' });
   },
};
