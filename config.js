module.exports = {
   ids: {
      owner: '253699775377965056', // Bot owner (to enable dev commands)
      testingServer: '558901518808383488', // Server to test slash commands in (registers in both prod and testing server by default)
      server: '520948670758387722', // Prod server (has moderatorRole, trustedRole, and memberRole)
      logChannel: '667551356684599297', // Channel for logging (currently only blacklisted users and raid alerts)
      moderatorRole: '762473575277133824', // Role used for access to moderator commands (currently only "slowmode" command at the moment)
      trustedRole: '520950339013312522', // Role to access certain restricted commands (currently only "say" command at the moment)
      memberRole: '520952297694560276', // Role that guild members have
   },

   messages: {
      errorDev: 'There was an error while trying to execute that command! Check the console log for more details.',
      errorUserFriendly: 'There was an error while trying to perform that task!',
      noPermissionNormal: 'You do not have the correct permissions to use this command.',
      noPermissionDev: "You shouldn't be using this command.",
      selfNoPermissions: 'Sorry, I do not have the correct permissions to perform that task.',
      footer: 'Hypixel Knights',
   },

   colours: {
      error: '#C40038',
      success: '#05AD48',
      informational: '#542BCF',
   },
};
