const Discord = require('discord.js');
const db = require('megadb');
let game = new db.crearDB('games');

/*
*
* "channel_id": {
*   "time": miliseconds
*   "user_id": {
*       betN: {
*           bet: money
*           number: [num]
*           even/odden: ['par'/'impar']
*           trios: ['1st'/'2nd'/'3rd']
*           color: [red, black]
*       }
*   }
* }
*
*/


const {error} = require('../../files/logs.js');
const {success, fail} = require('../../files/embeds.js');

module.exports = {
    name: 'roulette',
    alias: ['ruleta'],
    description: 'La ruleta',
    usage: 'roulette <dinero> <apuesta>',
    permission: 'None',
    type: 'roulette',
    init: async () => {

    },

    run: async (message, args) => {

        let even = {'par': ['par', 'even'], 'impar': ['impar', 'odden']};
        let trio = {'1st': ['1st', '1-12'], '2nd': ['2nd', '13-24'], '3rd': ['3rd', '25-36']};
        let color = {'rojo': ['red', 'rojo'], 'negro': ['black', 'negro']};

        if (args[0] === "help") {
            let msg = `Pleno: 0 al 37\nParidad: ${keysA(even)}\nDocenas: ${keysA(trio)}\nColor: ${keysA(color)}`;
            return message.channel.send(await success(message, msg))
        }
        if (!args[1]) return message.channel.send(await fail(message, "No has introducido nada!"));
        //if (!isNaN(parseInt(args[0]))) return message.channel.send(await fail(message, "Valor a apostar invalido!"));

        let bet = args.shift();
        let argsS = args.toString();
        console.log(args);
        console.log(argsS);

        even = opt(even, argsS);
        trio = opt(trio, argsS);
        color = opt(color, argsS);

        let num = [];
        for (let i=0;i<37;i++) {
            for (let j=0;j<args.length;j++) {
                if (args[j] == i)
                    num.push(i)
            }
        }

        let totalAmount = num.length+even.length+trio.length+color.length;

        if (totalAmount === 0)
            return message.channel.send(await fail(message, "Debes de apostar algo!"));

        let betTotal = bet*totalAmount;

        console.log(even, trio, color, num);

        if (!game.has(`roulette.${message.channel.id}.time`) || game.get(`roulette.${message.channel.id}.time`)<message.createdAt.getTime())
            await game.set(`roulette.${message.channel.id}.time`, message.createdAt.getTime()+300000).catch(err => console.log("1 => "+err));

        let apuesta = game.has(`roulette.${message.channel.id}.bet0`) ? game.keys(`roulette.${message.channel.id}.bet${message.author.id}`) : 0;
        await game.set(`roulette.${message.channel.id}.${message.author.id}.bet${apuesta}`,
            {bet: bet, num: num, even: even, trio: trio, color: color}).catch(err => console.log("2 => "+err));

        let msg = strArray(num) +" "+ strArray(even) +" "+ strArray(trio) +" "+ strArray(color);
        let lastTime = (await game.obtener(`roulette.${message.channel.id}.time`)-message.createdAt.getTime())/1000;

        const minutes = pad(Math.floor((lastTime % 3600) / 60), 2);
        const seconds = pad(lastTime % 60, 2);

        let result = minutes + " minutos y " + seconds + " segundos";

        return message.channel.send(await success(message, "Apostados ``"+bet+"``<a:lain:668781874986090496> a ``"+msg+"``\n" +
            "Total apostado``"+betTotal+"``<a:lain:668781874986090496>\n\n" +
            "Tiempo restante: ``"+result+"``"))
    }
};

function strArray(array) {
    if (array.length > 1)
        return "["+array.join(" ")+"] ";
    else if (array.length === 1)
        return array[0];
    else
        return "";
}

function pad(padStr, max) {
    let str = padStr.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function opt(opts, args) {
    let val = [];
    for (let c in opts) {
        for (let i = 0; i < opts[c].length; i++) {
            if (args.includes(","+opts[c][i]))
                val.push(c);
        }
    }
    return val;
}

function keysA(array) {
    let val = [];
    for (let c in array) {
        val.push(c)
    }
    return val;
}