const {ApplicationCommandOptionType, Client, Interaction, AttachmentBuilder} = require('discord.js')
const {SlashCommandBuilder} = require('discord.js');
const Level = require('../../models/Progression/Level');
const {Font, LeaderboardBuilder} = require('canvacord')
const calculateLevelXp = require('../../Utility/Leveling/calculateLevelXp');
const path = require('path')

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription("Shows the server leaderboard"),
    run: async({interaction, client, handler}) => {
        if(!interaction.inGuild()){
            interaction.reply('This command can only be used inside a server.');
            return;
        }

        await interaction.deferReply();
        
        //Fetch All levels (User Level Schemas)
        let allLevels = await Level.find({
            guildId:interaction.guild.id
        }).select('-_id userId currentLevel currentXp');

        console.log(allLevels)
        allLevels.sort((a,b) => {
            //Check For Same Levels
            if(a.currentLevel === b.currentLevel) return b.xp - a.xp
            else{return b.Level - a.Level}
        });
        //Get leaderboard emmbers
        const leaderboardMembers = await Promise.all(
            allLevels.map(async (lvl, idx) => {
                //Attempt to fetch member
                try{
                    const member = await interaction.guild.members.fetch(lvl.userId);
                    return{
                        avatar: member.user.displayAvatarURL({ format: 'png', size: 128 }),
                        username: member.user.username,
                        displayName: member.displayName,
                        level: lvl.currentLevel,
                        xp: lvl.currentXp,
                        rank: idx + 1
                    }
                } catch (e){
                    //Handle failure to create member
                    console.log(`Error caught: ${e}`)
                    return null;
                }
            })
        )
        //Filter for invalid entries
        const filteredMembers = leaderboardMembers.filter(Boolean)
        console.log(filteredMembers)
        Font.loadDefault()
        const leaderboard = new LeaderboardBuilder()
            .setHeader({
                title: "Top Gooners",
                image: "https://preview.redd.it/gear-5-fanart-did-i-cook-v0-0470l78txcxc1.jpeg?auto=webp&s=cbf2e91917ba6e2e73d6333a5ad1346e5e3b9193",
                subtitle: `${allLevels.length || 0} gooners`
            })

            .setPlayers(filteredMembers)
            .setBackground(`https://i.pinimg.com/736x/4a/82/f4/4a82f49757e44d4513315cccd9e85c20.jpg`)

        leaderboard.setVariant("default");

        const data = await leaderboard.build({
            format:"png",
        });
        const attachment = new AttachmentBuilder(data);
        interaction.editReply({files:[attachment]})

    },
    options:{ /* Optional Configuartion */
        userPermissions : ['Administrator'],
        devOnly: true,
    },
}
