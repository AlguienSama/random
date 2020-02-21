const Discord = require('discord.js');
const db = require('megadb');
let game = new db.crearDB('games');

//const {error} = require('../../files/logs.js');
//const {success, fail} = require('../../files/embeds.js');
const {success, fail} = require('../extras/embeds.js');

module.exports = {
    name: 'ruleta-apuesta',
    alias: ['ruleta-bets', 'ruleta-apuestas'],
    description: 'La ruleta',
    usage: 'roulette-apuestas',
    permission: 'None',
    type: 'roulette',

    run: async (message, args) => {
        if (!game.has(`roulette.${message.channel.id}`))
            return message.channel.send(await fail(message, "Aún no se ha iniciado ninguna partida!"));

        let lastTime = (await game.obtener(`roulette.${message.channel.id}.time`)-message.createdAt.getTime())/1000;
        const minutes = pad(Math.floor((lastTime % 3600) / 60), 2);
        const seconds = pad(Math.floor(lastTime % 60), 2);
        let result = minutes + " minutos y " + seconds + " segundos";

        let lider = await game.get(`roulette.${message.channel.id}.bets.bet0.user`);

        let ap = await game.get(`roulette.${message.channel.id}.bets`);
        let stadist = [];
        for (let betID in ap) {
            let obj = ap[betID];
            let motive = [];
            pushMotive(obj["num"]);
            pushMotive(obj["par"]);
            pushMotive(obj["mitad"]);
            pushMotive(obj["trio"]);
            pushMotive(obj["fila"]);
            pushMotive(obj["color"]);
            function pushMotive(arg) {
                if (arg !== undefined && arg.length>0)
                    return motive.push(arg);
            }
            stadist.push(`<@${obj["user"]}> => ***${obj["bet"]}*** : [ **${motive.join("** | **")}** ]`);
        }
        let embed = new Discord.RichEmbed()
            .setTitle('RULETA')
            .setDescription(`Lider: <@${lider}>`)
            .addField('APUESTAS', stadist.join("\n"))
            .addField("TIEMPO", result);
        await message.channel.send(embed);
    }
};

function pad(padStr, max) {
    let str = padStr.toString();
    return str.length < max ? pad("0" + str, max) : str;
}