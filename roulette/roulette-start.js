const Discord = require('discord.js');
const db = require('megadb');
let game = new db.crearDB('games');
let client = new Discord.Client();

//const {error} = require('../../files/logs.js');
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
            return message.channel.send(await fail(message, "Solo el creador de la partida puede empezarla!"))

        await start(message.channel.id);
    }
};

async function start(channel) {
    await game.get(`roulette.${channel}.bets`)
}