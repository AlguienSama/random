const Discord = require('discord.js');
const db = require('megadb');
let game = new db.crearDB('games');

//const {error} = require('../../files/logs.js');
//const {success, fail} = require('../../files/embeds.js');
const {success, fail} = require('../extras/embeds.js');

module.exports = {
    name: 'ruleta-start',
    alias: ['r-start', 'roulette-start'],
    description: 'La ruleta',
    usage: 'roulette-start',
    permission: 'None',
    type: 'roulette',
    init: async () => {

    },

    run: async (message, args) => {
        if (!game.has(`roulette.${message.channel.id}`))
            return message.channel.send(await fail(message, "Aún no se ha iniciado ninguna partida!"));

        let time = await game.get(`roulette.${message.channel.id}.time`);
        let players = await game.get(`roulette.${message.channel.id}.bets`);

        let lider = await game.get(`roulette.${message.channel.id}.bets.bet0.user`);

        if (message.author.id !== lider)
            return message.channel.send(await fail(message, "Solo el creador de la partida puede empezarla!"));

        await start(message.client, message.channel.id).then(async () => {
            //await game.delete(`roulette.${message.channel.id}`)
        })
    }
};

async function start(client, channel) {

    let num = Math.floor(Math.random() * 37);
    let par = num % 2 === 0 ? "par" : num !== 0 ? "impar" : 0;
    let mitad = num > 0 && num < 19 ? '1-18' : num > 18 && num < 37 ? '19-36' : 0;
    let trio = num > 24 ? '3st' : num > 12 ? '2nd' : num > 0 ? '1st' : 0;
    let fila = num % 3 === 1 ? 'r1' : num % 3 === 2 ? 'r2' : num !== 0 ? 'r3' : 0;
    let color = num > 0 && num < 11 && num % 2 === 1 || num > 10 && num < 19 && num % 2 === 0 ||
    num > 18 && num < 29 && num % 2 === 1 || num > 28 && num < 37 && num % 2 === 0 ? 'rojo' : num !== 0 ? 'negro' : 0;

    let ap = await game.get(`roulette.${channel}.bets`);

    console.log(num, par, mitad, trio, fila, color);

    let msg = num===0?"0":`**${num}** | **${par}** | **${mitad}** | **${trio}** | **${fila}** | **${color}**`;
    let ganadores = "";

    for (let betID in ap) {
        let obj = ap[betID];
        let bet = obj["bet"];
        let motive = [];
        console.log(bet);
        if (num === 0) {
            if (obj["num"].includes(num)) {
                bet*=36;
                motive.push(num);
            }
        } else {
            if (obj["num"].includes(num)) {
                bet*=36;
                motive.push(num);
                console.log(obj["user"]+" NUM "+num)
            }
            if (obj["par"].includes(par)) {
                bet*=2;
                motive.push(par);
                console.log(obj["user"]+" PAR "+par)
            }
            if (obj["mitad"].includes(mitad)) {
                bet*=2;
                motive.push(mitad);
                console.log(obj["user"]+" MITAD "+mitad)
            }
            if (obj["trio"].includes(trio)) {
                bet*=3;
                motive.push(trio);
                console.log(obj["user"]+" TRIO "+trio)
            }
            if (obj["fila"].includes(fila)) {
                bet*=3;
                motive.push(fila);
                console.log(obj["user"]+" FILA "+fila)
            }
            if (obj["color"].includes(color)) {
                bet*=2;
                motive.push(color);
                console.log(obj["user"]+" COLOR "+color)
            }
        }
        if (bet === obj["bet"])
            bet = 0;
        if (bet !== 0)
            ganadores+=`<@${obj["user"]}>\t => ***${bet}*** : [**${motive.join("** | **")}**]\n`;
        console.log(obj["user"]+" -- BET Total"+ bet);
    }

    let embed = new Discord.RichEmbed()
        .setTitle("RULETA!")
        .addField("RESULTADOS", msg)
        .addField("GANADORES", ganadores);

    await client.channels.get(channel).send(embed);
}
