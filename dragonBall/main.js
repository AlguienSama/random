const Discord = require('discord.js');
const db = require('megadb');
const games = new db.crearDB('games');
const bank = new db.crearDB('bank');

module.exports = {
    dbGame: async (message) => {
        if (!games.has(`${message.guild.id}.dbGame`))
            await games.set(`${message.guild.id}.dbGame.balls`,
                {
                    db1: {price: 50000, img: "https://i.ibb.co/bm7HySB/db1.png", icon: "681462632275902509"},
                    db2: {price: 100000, img: "https://i.ibb.co/8cT7ynY/db2.png", icon: "681462674135318550"},
                    db3: {price: 50000, img: "https://i.ibb.co/NCSRWW5/db3.png", icon: "681462730321952804"},
                    db4: {price: 200000, img: "https://i.ibb.co/0M0qBs3/db4.png", icon: "681462750601674782"},
                    db5: {price: 50000, img: "https://i.ibb.co/cczZtng/db5.png", icon: "681462767449800745"},
                    db6: {price: 100000, img: "https://i.ibb.co/3m1nMPW/db6.png", icon: "681462782587437067"},
                    db7: {price: 50000, img: "https://i.ibb.co/M6VxRdC/db7.png", icon: "681462799708586024"}
                });
        if (!games.has(`${message.guild.id}.dbGame.time`) || await games.get(`${message.guild.id}.dbGame.time`) > Date.now()) {
            await games.set(`${message.guild.id}.dbGame.time`, Date.now() + Math.floor(Math.random() * 3600000 + 3600000));
            let moneda = await bank.get(`${message.guild.id}.moneda`);
            let numBall = Math.floor(Math.random() * 7 + 1);
            let ball = await games.get(`${message.guild.id}.dbGame.balls.db${numBall}`);
            let embed = new Discord.RichEmbed()
                .setTitle('DRAGON BALLS')
                .setColor('#ffbf0f')
                .setDescription("Precio: " + ball["price"] + " " + moneda)
                .setImage(ball["img"]);
            await message.channels.get("#").send(embed).then(async m => {
                let balls = await games.get(`${message.guild.id}.dbGame.balls`);
                for (let b of balls) {
                    m.react(b["icon"]);
                }

                const filter = (reaction) => {
                    return reaction.emoji.id === ball["icon"]
                };

                await m.awaitReactions(filter, { max:1, time:60000 })
                    .then(coll => {
                        
                    })

            });

        }

    }
};
