const { schedule } = require("node-cron");
const {spawnFruit} = require('./fruitSpawner'); // Verify path

// Add error handling
schedule('0 */2 * * *', async () => {
  try {
    const channel = await getLogChannel();
    if (!channel?.isTextBased()) {
      throw new Error('Invalid log channel');
    }
    await spawnFruit(channel);
  } catch (error) {
    console.error(`[FRUIT SPAWN ERROR] ${error.message}`);
  }
});
