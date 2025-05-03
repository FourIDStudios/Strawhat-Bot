const {ApplicationCommandOptionType, Client, Interaction, AttachmentBuilder} = require('discord.js')
const {SlashCommandBuilder} = require('discord.js');
const Level = require('../../models/Progression/Level');
const {Font, RankCardBuilder} = require('canvacord')
const calculateLevelXp = require('../../Utility/Leveling/calculateLevelXp');

module.exports = {
    /**
     * 
     * @param {Client} client
     * @param {Interaction} interaction
     */
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription("Shows you/someone's level")
        .addMentionableOption(option => 
            option
                .setName(`target-user`)
                .setDescription(`The user who's level you want to view`)
        ),
    run: async({interaction, client, handler}) => {
        if(!interaction.inGuild()){
            interaction.reply('This command can only be used inside a server.');
            return;
        }

        await interaction.deferReply();
        
        //Fetch Target User
        const mentionedUserId   = interaction.options.get('target-user')?.value;
        const targetUserId      = mentionedUserId||interaction.member.id;
        const targetUser        = await interaction.guild.members.fetch(targetUserId)

        const fetchedLevel = await Level.findOne({
            userId: targetUserId,
            guildId: interaction.guild.id
        })

        if(!fetchedLevel){
            interaction.editReply(
                mentionedUserId ? `${targetUser.user.tag} doesn't have any levels yet.` : `You don't have any levels  yet.`
            );
            return;
        }

        //Calculate Rank
        let allLevels = await Level.find({
            guildId:interaction.guild.id
        }).select('-_id userId currentLevel currentXp');

        allLevels.sort((a,b) => {
            //Check For Same Levels
            if(a.currentLevel === b.currentLevel) return b.xp - a.xp
            else{return b.Level - a.Level}
        });

        //Get Current User Rank 
        let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) +1;

        Font.loadDefault()
        const rank = new RankCardBuilder()
            .setAvatar(targetUser.user.displayAvatarURL({size:256}))
            .setRank(currentRank)
            .setLevel(fetchedLevel.currentLevel)
            .setCurrentXP(fetchedLevel.currentXp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.currentLevel))
            .setUsername(targetUser.displayName || targetUser.user.username)
            .setStatus(targetUser.presence?.status || "offline")
            .setTextStyles({
                level:'GRADE :',
                xp:'EXP :',
                rank:"CLASS RANK :"
            });


        const data = await rank.build({
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
