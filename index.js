const Discord = require('discord.js');
const { fstat } = require('fs');
const fs = require("fs")
const bot = new Discord.Client();
const bdd = require('./bdd.json');


bot.on("ready", async () => {
    console.log("Le bot est allumé")
    bot.user.setStatus("dnd")
    bot.user.setActivity("+help", {type: "LISTENING"})
})
bot.on("guildMemberAdd", member => {
    member.send(`Bienvenue sur le serveur ${member.user}, en espérant que le serveur te plaise !
Lien d'invitation : https://discord.gg/6xhMtQ4bxx`)
  //  bot.channels.cache.get('835100093156687902').send(`Bienvenue sur le serveur ${member.user}, en espérant que le serveur te plaise !`);
    member.roles.add('835099571822657557')


})


bot.on("message", message => {
    if(message.content.startsWith("+clear")){
        message.delete();
        if(message.member.hasPermission('MANAGE_MESSAGES')){

            let args = message.content.trim().split(/ +/g);

            if(args[1])
                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){

                    message.channel.bulkDelete(args[1])
                    message.channel.send(`Vous avez supprimer ${args[1]} message(s)`)
                    message.channel.bulkDelete(1)
                    
            }

            else{
                message.channel.send("Vous devez indiquer une valeur entre 1 et 99 !")
            }
            else{
                message.channel.send("Veuillez indiquer une valeur au dessus de 0 !")

                if(message.content.startsWith("+mb")){
                    message.delete()
                    if(message.member.hasPermission('MANAGE_MESSAGES')){
                        if(message.content.length >5){
                            message_bienvenue = message.content.slice(4)
                            console.log(message_bienvenue)
                        }
                    }
                }
            }
        }
    }

    if(message.content.startsWith("+warn")){
        message.delete() 
        if(message.member.hasPermission('KICK_MEMBERS')){

            if(!message.mentions.users.first())return;
            utilisateur = message.mentions.users.first().id

            if(bdd["warn"][utilisateur] == 6){

                delete bdd["warn"][utilisateur]
                message.guild.members.ban(utilisateur)
             }
            else{
                if(!bdd["warn"][utilisateur]){
                    bdd["warn"][utilisateur] = 1
                    Savebdd();
                    message.channel.send("L'utilisateur a obtenu(e) " + bdd["warn"][utilisateur] + " Avertissement !- ");
                }
                else{
                    bdd["warn"][utilisateur]++
                    Savebdd();
                    message.channel.send("L'utilisateur a obtenu(e) " + bdd["warn"][utilisateur] + " Avertissement !");
                }
            }
        }
    }

    if(message.content.startsWith("+stats")){
        let online = message.guild.members.cache.filter(({ presence }) => presence.status !== 'offline').size;
        let totalsmembers = message.guild.members.cache.size;
        let totalservers = bot.guilds.cache.size;
        let totalbots = message.guild.members.cache.filter(member => member.user.bot).size;
        let totalrole = message.guild.roles.cache.get('835099571822657557').members.map(member => member.user.tag).length;

        const MonEmbed = new Discord.MessageEmbed()
            .setColor('#caa148')
            .setTitle('Statistiques')
            .setURL('https://discord.gg/3u9XV7pJF5')
            .setAuthor('Stats - FRD', '', 'https://discord.gg/3u9XV7pJF5')
            .setDescription('Voici les statstiques du serveur !')
            .setThumbnail('')
            .addFields(
                { name: 'Nombres de membres total', value: totalsmembers, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Nombres de serveurs avec ce bot ', value: totalservers, inline: true },
                { name: 'Nombres de bots sur le serveur ', value: totalbots, inline: true },
            )
            .setImage()
            .setTimestamp()
            .setFooter('Administration de FRD.');
        
        message.channel.send(MonEmbed);

    }
})

    

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue");
    });
}

var token = 'ODE2MzA0NTI4MTE0MzE5Mzc3.YD5A1Q.LAdXqdkEXJ_0td_ltTsq8PoVY0k'
bot.login(token);