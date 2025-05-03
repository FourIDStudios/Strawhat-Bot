const {Client, Interaction, ButtonInteraction} = require('discord.js');
const DevilFruit = require('../../models/Game/DevilFruit');
const GameSettings = require('../../../Discord Class Bot/Config/gameSettings');

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 */
module.exports = async function handleFruitClaim(interaction, client) {
    if(!interaction.inGuild() || interaction.user.bot || !interaction.isButton || !interaction.customId ==='claim_fruit') return; // Ignore DMs & Bots

    try {
        // Find unclaimed fruit
        const fruit = await DevilFruit.findOne({ 
            messageId: interaction.message.id,
            consumed: false,
            claimExpiry: { $gt: Date.now() }
        });

        if(!fruit) {
            return interaction.reply({ 
                content: 'This fruit has expired or was already claimed!',
                ephemeral: true 
            });
        }

        // Check existing ownership
        const existingFruit = await DevilFruit.findOne({
            ownerId: interaction.user.id,
            consumed: true,
            guildId: interaction.guildId
        });

        if(existingFruit) {
            return interaction.reply({
                content: `You already own the ${existingFruit.name}!`,
                ephemeral: true
            });
        }

        // Update ownership
        fruit.ownerId = interaction.user.id;
        fruit.consumed = true;
        await fruit.save();

        // Update original message
        await interaction.message.edit({
            components: [] // Remove claim button
        });

        interaction.reply({
            content: `🏴‍☠️ ${interaction.user} has claimed the **${fruit.name}**!`,
            allowedMentions: { users: [] }
        });

    } catch(error) {
        console.log(`[FRUIT CLAIM ERROR] ${error}`);
        interaction.reply({
            content: 'An error occurred while processing your claim!',
            ephemeral: true
        });
    }
}
