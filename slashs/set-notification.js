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
    .setName("set-notification")
    .setDescription(`[ADMIN] Set a github notifications (Github-Notifications)`)
    .addChannelOption(o=>o.setName("channel").setDescription(`the channel to set`).setRequired(true))
    .addStringOption(o=>o.setName("username").setDescription(`the username to connect`).setRequired(true)),
    async execute(interaction){
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return await interaction.reply({content:`> **You are not allowed to use this!**`,ephemeral:true});
        }
        const channel=interaction.options.getChannel("channel")
        const username=interaction.options.getString("username")
        const e=db.prepare(`SELECT * FROM github WHERE guild=?`).get(interaction.guild.id);
        if(e){
            db.prepare(`UPDATE github SET username=?,channel=? WHERE guild=?`).run(username,channel.id,interaction.guild.id)
        }
        db.prepare(`INSERT INTO github (channel,username,guild) VALUES (?,?,?)`).run(channel.id,username,interaction.guild.id)
        const embed=new EmbedBuilder()
        .setColor("Green")
        .setTitle(`Notification Set`)
        .setDescription(`**Setted the username to \`${username}\` and the channel to ${channel} successfully.**`)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({text:`${config.embedFooter}`,iconURL:interaction.guild.iconURL()})
        return await interaction.reply({embeds:[embed]});
    },
};