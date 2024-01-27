const better=require("better-chalk");
const {EmbedBuilder}=require(`discord.js`);
const config=require(`../config`);
const sqlite=require("better-sqlite3");
const https = require('https');
const db=new sqlite("json.sqlite");
db.exec(`CREATE TABLE IF NOT EXISTS github (
    guild TEXT,
    username TEXT,
    channel TEXT
);
`);
function repoNameFromURL(url){
    const p=url.split('/');
    return p[p.length-1];
}
module.exports={
    name:'ready',
    once:true,
    async execute(client){
        console.log(better.hex("#0000FF",true)+(`Logged is as ${client.user.username}`));
        for(const guild of client.guilds.cache.values()){
            const slashcommands=client.slashcommands.map((command) => command.data.toJSON());
            await guild.commands.set(slashcommands)
        }
        setInterval(async () => {
            const e=db.prepare('SELECT * FROM github').all();
            for(const g of e){
                try{
                    const options={
                        hostname:'api.github.com',
                        path:`/users/${g.username}/events/public`,
                        method:'GET',
                        headers:{
                            'User-Agent':'Github Post Notification'
                        },
                    };
                    const req=https.request(options,async(res)=>{
                        let data='';
                        res.on('data',(c)=>{
                            data+=c
                        });
                        res.on('end',async()=>{
                            const events=JSON.parse(data);
                            const openrepo=events.filter(async(event)=>{
                                event.type==="CreateEvent"
                            });
                            const lastedrepo=openrepo[0];
                            let p2=""
                            const eventdate=new Date(lastedrepo.created_at);
                            const current=new Date();
                            const repo=repoNameFromURL(lastedrepo.repo.url)
                            if(p2!==repo&&current-eventdate<=5*60*1000){
                                const embed=new EmbedBuilder()
                                .setColor("Blue")
                                .setTitle(`New Post`)
                                .setThumbnail(lastedrepo.actor.avatar_url)
                                .setFooter({text: config.embedFooter,
                                    iconURL: client.guilds.cache.get(g.guild).iconURL()})
                                .setDescription(`**${g.username}** posted: [\`${repo}\`](https://github.com/${g.username}/${repo})`);
                                const channel=client.channels.cache.get(g.channel);
                                await channel.send({embeds:[embed]});
                                p2=repo
                            }
                        });
                    });
                    req.on('error', (error) => {
                        console.error(`${error.message}`);
                      });
                      req.end();
                }catch (error) {
                    console.error(`${error.message}`);
                  }
            }
                  }, 15000);
    }
}