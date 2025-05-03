const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rvalidations')
        .setDescription('A Dev, command that reloads all the bot Validations'),
    run: async({interaction, client, handler}) => {
        await interaction.deferReply();
        await handler.reloadValidations();
        interaction.followUp('Validations succesfully reloaded!')
    },
    options:{ /* Optional Configuartion */
        userPermissions : ['Administrator'],
        devOnly: true,
    },
}