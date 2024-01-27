const {EmbedBuilder}=require(`discord.js`);
const better=require(`better-chalk`);
module.exports={
    name: 'guildCreate',
    async execute(guild,client){
        console.log(better.hex(`#0000FF`,true)+(`I joined to new guild ${guild.name}`));
        const guild2=client.guilds.cache.get("1167430336699965511");
        const channel=guild2.channels.cache.get("1175391530547154954");
        const owner=await guild.fetchOwner();
        const embed=new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`Guild Joined`)
        .addFields(
            {name: `Guild:`,value:`${guild.name}`,inline:true},
            {name: `Owner:`,value:`${owner}`,inline:true},
            {name: `Guild Members:`,value:`${guild.memberCount}`,inline:true},
            {name: `Date:`,value:`<t:${Math.floor(Date.now()/1000)}:d>`}
        )
        .setTimestamp();
        await channel.send({embeds:[embed]});
        const slashcommands=client.slashcommands.map((command) => command.data.toJSON());
        console.log(slashcommands)
            await guild.commands.set(slashcommands)
    },
};