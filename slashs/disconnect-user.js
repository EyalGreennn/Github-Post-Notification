const {SlashCommandBuilder,EmbedBuilder, PermissionsBitField}=require("discord.js");
const config=require(`../config`);
const sqlite=require("better-sqlite3");
const db=new sqlite("json.sqlite");
db.exec(`CREATE TABLE IF NOT EXISTS github (
    guild TEXT,
    username TEXT,
    channel TEXT
);
`);
module.exports={
    data:new SlashCommandBuilder()
    .setName("reset-info")
    .setDescription(`[ADMIN] Reset the github notification info (Github-Notifications)`),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({content:`> **You are not allowed to use this!**`,ephemeral:true});
        }
        const e=db.prepare(`SELECT * FROM github WHERE guild=?`).get(interaction.guild.id);
        await db.prepare(`DELETE FROM github WHERE  guild=?`).run(interaction.guild.id);
        const embed=new EmbedBuilder()
        .setColor("Green")
        .setTitle(`Deleted data`)
        .setDescription(`**\`${interaction.guild.name}\` data has been deleted successfully.**`)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({text:`${config.embedFooter}`,iconURL:interaction.guild.iconURL()})
        return await interaction.reply({embeds:[embed]});
    },
};