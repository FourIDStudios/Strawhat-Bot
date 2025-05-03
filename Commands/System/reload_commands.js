const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rcommands')
        .setDescription('A Dev, command that reloads all the bot Commands'),
    run: async({interaction, client, handler}) => {
        await interaction.deferReply();
        await handler.reloadCommands();
        interaction.followUp('Events succesfully reloaded!')
    },
    options:{ /* Optional Configuartion */
        userPermissions : ['Administrator'],
        devOnly: true,
    },
}