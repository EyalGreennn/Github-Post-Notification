const {SlashCommandBuilder,EmbedBuilder}=require("discord.js");
const config=require(`../config`);
module.exports={
    data:new SlashCommandBuilder()
    .setName("invite")
    .setDescription(`Invite the bot`),
    async execute(interaction){
        const embed=new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Invite`)
        .setDescription(`**• Click [here](https://discord.com/api/oauth2/authorize?client_id=${interaction.client.user.id}&permissions=8&scope=bot) to add ${interaction.client.user} to your server!**`)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({text:`${config.embedFooter}`,iconURL:interaction.guild.iconURL()})
        return await interaction.reply({embeds:[embed]});
    },
};