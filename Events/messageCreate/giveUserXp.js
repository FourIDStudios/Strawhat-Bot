const {Client, Message} = require('discord.js');
const rewardXp = require('../../Utility/Leveling/rewardXp');
const Level = require('../../models/Progression/Level');
const calculateLevelXp = require('../../Utility/Leveling/calculateLevelXp');
const GameSettings = require('../../Config/gameSettings');
const cooldowns = new Set();

/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 */

module.exports = async (message, client) =>  {
    if(!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return; // Ignore DM's & Bot Messages

    const xpToGive = rewardXp(5,15);    // Calculate exp to give
    const query = {                     // Create query for target user
        userId: message.author.id,
        guildId: message.guild.id,
    }

    //Query User Level Component & Reward XP
    try{
        const level = await Level.findOne(query);
        if(level){
            //Increase XP
            level.currentXp += xpToGive
            
            const levelBefore = level.currentLevel
            //Repeatedly calculate level up
            while (level.currentXp > calculateLevelXp(level.currentLevel)) {
                const maxXP = calculateLevelXp(level.currentLevel);
                level.currentXp -= maxXP; // Subtract the XP required for the current level
                level.currentLevel += 1; // Increment the level
            }

            //Update Database
            await level.save().catch((e) => {
                console.log(`Error saving updated level ${e}`)
                return;
            })
            
            //Send Response
            if(levelBefore != level.currentLevel){
                message.channel.send(`${message.member} you have leveld up **Level: *${levelBefore}* --> ${level.currentLevel}**.`)
            }
        }
        
        // if(!level) -> New User
        else{
            const newLevel = new Level({
                userId      : message.author.id,
                guildId     : message.guild.id,
                currentXp   :xpToGive,
            });

            await newLevel.save();
        }
    } catch(error){
        console.log(`Error giving xp:  ${error}`)
    }

    //Add Cooldown
    cooldowns.add(message.author.id)
    setTimeout(() => {
        cooldowns.delete(message.author.id)
    }, GameSettings.messageXpCooldown)

}