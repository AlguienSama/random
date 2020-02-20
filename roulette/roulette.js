const Discord = require('discord.js');
const db = require('megadb');
let bank = new db.crearDB('bank');
let game = new db.crearDB('games');

/*
*
* "channel_id": {
*   "time": miliseconds
*   "bets": {
*       "betN": {
*           "user": "userID"
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


//const {error} = require('../../files/logs.js');
const {success, fail} = require('../../files/embeds.js');

module.exports = {
    name: 'roulette',
    alias: ['ruleta'],
    description: 'La ruleta',
    usage: 'roulette <dinero> <apuesta>',
    permission: 'None',
    type: 'roulette',

    run: async (message, args) => {

        //let moneda = await bank.get(`${message.guild.id}.moneda`);
        let moneda = " # ";

        let pares = {'par': ['par', 'even'], 'impar': ['impar', 'odden']};
        let mitad = {'1-18': ['1-18'], '19-36':['19-36']};
        let trio = {'1st': ['1st', '1-12'], '2nd': ['2nd', '13-24'], '3rd': ['3rd', '25-36']};
        let fila = {'r1': ['r1','f1'], 'r2': ['r2','f2'], 'r3': ['r3','f3']};
        let color = {'rojo': ['red', 'rojo'], 'negro': ['black', 'negro']};

        if (!args[0] || args[0] === "help") {
            let msg = `Pleno: 0 al 37\nParidad: ${await keysA(pares)}\nMitades: ${await keysA(mitad)}
            Docenas: ${await keysA(trio)}\nFilas: ${await keysA(fila)}\nColor: ${await keysA(color)}`;
            return message.channel.send(await success(message, msg))
        }
        if (!args[1]) return message.channel.send(await fail(message, "No has introducido nada!"));
        if (isNaN(parseInt(args[0]))) return message.channel.send(await fail(message, "Valor a apostar invalido!"));

        let bet = parseInt(args.shift());
        if (bet < 100 && bet > 300000)
            return message.channel.send(await fail(message, "Debes de apostar entre **100** "+moneda+" y **300.000** "+moneda));
        let argsS = ","+args.toString();
        console.log(argsS);

        pares = opt(pares, argsS);
        mitad = opt(mitad, argsS);
        trio = opt(trio, argsS);
        fila = opt(fila, argsS);
        color = opt(color, argsS);

        let num = [];
        for (let i=0;i<37;i++) {
            for (let j=0;j<args.length;j++) {
                if (args[j] == i)
                    num.push(i)
            }
        }

        let totalAmount = num.length+pares.length+mitad.length+trio.length+fila.length+color.length;

        if (totalAmount === 0)
            return message.channel.send(await fail(message, "Debes de apostar algo!"));

        let betTotal = bet*totalAmount;

        console.log("Pares => "+pares+"\nMitades => "+mitad+"\nTrios => "+trio+"\nFilas => "+fila+"\nColores => "+color+"\nNums => "+num);

        if (!game.has(`roulette.${message.channel.id}.time`) || await game.get(`roulette.${message.channel.id}.time`)<message.createdAt.getTime())
            await game.set(`roulette.${message.channel.id}.time`, message.createdAt.getTime()+300000).catch(err => console.log("1 => "+err));

        let apuesta = game.has(`roulette.${message.channel.id}.bets.bet0`) ? await game.size(`roulette.${message.channel.id}.bets`) : 0;

        await game.set(`roulette.${message.channel.id}.bets.bet${apuesta}`,
            {user: message.author.id, bet: bet, num: num, par: pares, mitad: mitad, trio: trio, fila:fila, color: color}).catch(err => console.log("2 => "+err));

        let msg = "["+strArray(num) +"] ["+ strArray(pares) +"] ["+ strArray(mitad) +"] ["+ strArray(trio) +"] ["+ strArray(fila) +"] ["+ strArray(color) +"]";

        let lastTime = (await game.obtener(`roulette.${message.channel.id}.time`)-message.createdAt.getTime())/1000;
        const minutes = pad(Math.floor((lastTime % 3600) / 60), 2);
        const seconds = pad(Math.floor(lastTime % 60), 2);
        let result = minutes + " minutos y " + seconds + " segundos";

        return message.channel.send(await success(message, "Apostados ``"+bet+"``<a:lain:668781874986090496> a ``"+msg+"``\n" +
            "Total apostado``"+betTotal+"``<a:lain:668781874986090496>\n\n" +
            "Tiempo restante: ``"+result+"``"))
    }
};

function strArray(array) {
    if (array.length > 1)
        return array.join(" ");
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

async function keysA(array) {
    let val = [];
    console.log(array);
    for (let c in array) {
        val.push(c)
    }
    return val;
}
