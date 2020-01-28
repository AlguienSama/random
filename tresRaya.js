const Discord = require('discord.js');
const db = require('megadb');
let game = new db.crearDB('games');

class Player {
    constructor(id, username, displayAvatarURL, apuesta = 0) {
        this.id = id;
        this.name = username;
        this.avatar = displayAvatarURL;
        this.turn = false;
        this.apuesta = apuesta;
    }

}

// Help
const help = "```" +
    "COMO JUGAR?" +
    "\n - El turno será del jugador al que le salga la ficha al lado de su nombre" +
    "\n - Introduce las coordenadas de la posición donde quieres colocar la ficha" +
    "\n" +
    "\n Coordenadas :    A1 A2 A3" +
    "\n                  B1 B2 B3" +
    "\n                  C1 C2 C3" +
    "```";

// Fichas
const blue = "🔷";
const orange = "🔶";

// Mapas
const map = [
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜",
    "⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜⬛⬜⬜⬜⬜⬜"
];

// Posiciones
const xPos = ['a', 'b', 'c'];
const yPos = ['1', '2', '3'];

function marcador(player1, player2) {
    let dinero = player2.apuesta;
    let conv = dinero => String(dinero).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    return "```" +
        `\n${player1.turn ? blue : " >"} ${player1.name}\n${player2.turn ? orange : " >"} ${player2.name}` +
        `\n\nDinero apostado => ${conv(dinero)} 💰 ` +
        "```"
}

module.exports = {
    name: '3raya',
    alias: [''],
    description: '',
    usage: '',
    permission: '',
    type: '',

    run: async (message, args) => {
        let user = false;
        let apuesta = 0;
        let frase = "";
        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
            frase = `${user} a sido retado por ${message.author}. ` + "``/3raya``";
            // apuesta = testNaN(args[1]);
        } else {
            frase = `${message.author} está esperando un oponente. ` + "``/3raya``";
            // apuesta = testNaN(args[0]);
        }

        function testNaN(bal) {
            let apuesta;
            if (bal) {
                apuesta = parseInt(bal);
                if (isNaN(apuesta))
                    apuesta = 0;
            }
            return apuesta;
        }



        message.channel.send(frase).then(() => {

            const player1 = new Player(message.author.id, message.author.username, message.author.displayAvatarURL);

            let filter1;
            if (!user)
                filter1 = m => m.author.id !== player1.id;
            else
                filter1 = m => m.author.id === user.id;
            const collector = message.channel.createMessageCollector(filter1, {max: 1});

            collector.on("end", async msg => {
                const player2 = new Player(msg.first().author.id, msg.first().author.username, msg.first().author.displayAvatarURL);
                player1.turn = true;
                let mar = await marcador(player1, player2);
                await message.channel.send(help + "```" + map.join("\n") + "```" + mar).then(async msg => {

                })
            })

        });


    }
};

const textFilter = m => xPos.some(n => m.content.toLowerCase().includes(n)) && yPos.some(n => m.content.toLowerCase().includes(n));

//let msgCord = message.content.toLowerCase();

let xCord = 'x'; // array position
let yCord = 'y'; // string position

let positions = [
    [2,3,4],
    [8,9,10],
    [14,15,16]
];

function cord(incl, keys, cord, pice) {
    for (let i = 0; i < incl.length; i++) {
        if (incl.includes(incl[i]))
            cord[i] = replaceAt(keys[i], pice)
    }
}

function addPice(table, xCord, yCord) {


}

function replaceAt(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);

}