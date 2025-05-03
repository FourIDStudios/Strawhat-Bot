// Utility/Spawn/fruitSpawner.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const DevilFruit = require('../../models/Game/DevilFruit.js');
const FRUIT_DATA = require('../../Config/devilFruits.json');

function getRandomFruit() {
  const rarities = Object.keys(FRUIT_DATA.rarityWeights);
  const chosenRarity = rarities.find(r => 
    Math.random() < FRUIT_DATA.rarityWeights[r]
  );
  const availableFruits = FRUIT_DATA.fruits.filter(f => f.rarity === chosenRarity);
  return availableFruits[Math.floor(Math.random() * availableFruits.length)];
}

async function spawnFruit(channel) {
  const fruit = getRandomFruit();
  if (!fruit) {
      console.error('No available fruits for chosen rarity');
      return;
    }
  const embed = new EmbedBuilder()
    .setTitle(`🍑 ${fruit.name} appeared!`)
    .setDescription(`Rarity: ${fruit.rarity}\nType: ${fruit.type}`)
    .setColor(FRUIT_DATA.rarityColors[fruit.rarity]);

  const message = await channel.send({ 
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('claim_fruit')
        .setLabel('Claim Fruit')
        .setStyle(ButtonStyle.Primary)
    )]
  });

  await new DevilFruit({
    name: fruit.name,
    rarity: fruit.rarity,
    guildId: channel.guild.id,
    messageId: message.id
  }).save();
}

module.exports = {getRandomFruit, spawnFruit}
