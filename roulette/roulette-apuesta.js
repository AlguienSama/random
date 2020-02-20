const Discord = require('discord.js');
const db = require('megadb');
let game = new db.crearDB('games');

//const {error} = require('../../files/logs.js');
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
        const seconds = pad(lastTime % 60, 2);
        let result = minutes + " minutos y " + seconds + " segundos";

        let players = await game.get(`roulette.${message.channel.id}.bets`);

        let lider = await game.get(`roulette.${message.channel.id}.bets.bet0.user`);

        for (let bet in players) {
        }
    }
};