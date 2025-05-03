const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('revents')
        .setDescription('A Dev, command that reloads all the bot Events'),
    run: async({interaction, client, handler}) => {
        await interaction.deferReply();
        await handler.reloadEvents();
        interaction.followUp('Events succesfully reloaded!')
    },
    Options:{ /* Optional Configuartion */
        userPermissions : ['Administrator'],
        devOnly: true,
    },
}