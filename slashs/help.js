const {SlashCommandBuilder,EmbedBuilder}=require("discord.js");
const config=require(`../config`);
module.exports={
    data:new SlashCommandBuilder()
    .setName("help")
    .setDescription(`View bot commands`),
    async execute(interaction){
        const embed=new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Bot Commands`)
        .setDescription(`**\`/help\` • View bot commands\n\`/invite\` • Get the bot invite link\n\`/set-notification <channel> <username>\` • Connect a user to the github notification system\n\`reset-info\` • reset the github notification system info.**`)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({text:`${config.embedFooter}`,iconURL:interaction.guild.iconURL()})
        return await interaction.reply({embeds:[embed]});
    },
};