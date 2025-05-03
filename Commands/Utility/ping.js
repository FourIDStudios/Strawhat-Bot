const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('simply returns Pong!'),
    run: ({interaction, client, handler}) => {
        interaction.reply('Pong!');
    },
    options:{ /* Optional Configuartion */
        userPermissions : ['Administrator'],
        
        /* Custom Options*/
        cooldown: 1,
        devOnly:true,
    },
}