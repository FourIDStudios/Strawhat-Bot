module.exports = async function getLogChannel() {
    // Implement your channel fetching logic, example:
    const guild = await client.guilds.fetch(process.env.DEV_SERVER_ID);
    return guild.channels.cache.find(ch => ch.name === 'straw-hat');
  };
  