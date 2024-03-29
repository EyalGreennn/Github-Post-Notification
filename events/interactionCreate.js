const sqlite=require(`better-sqlite3`);
const db=new sqlite("json.sqlite");

module.exports={
    name:'interactionCreate',
    async execute(interaction,client){
        if(interaction.isCommand()){
            const {commandName}=interaction;
            const command = client.slashcommands.get(commandName);
            if(!command)return;
            try{
                command.execute(interaction);
            }catch(err){
            console.error(err);
            return interaction.reply({
                content: `**There was an error while executing the command.**`,
                ephemeral: true,
            });
            }
        }else{
            return;
        };
    },
};