module.exports = (message, client, handler) => {
    if(message.content === '!ping'){
        message.reply('Pong!');
    }
}