/*
*
* "guild_id": {
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
* */

let args = ['par'];

let num = [];
for (let i = 0; i<37; i++) {
    num[i] = i;
}
let even = {'par': ['par', '1-23'], 'impar':['impar', '24-36']};
let trio = {'1st': ['1st', '1-12'], '2nd': ['2nd', '13-24'], '3rd': ['3rd', '25-36']};
let color = {'red': ['red', 'rojo'], 'black': ['black','negro']};

//num = opt(num, args);
even1 = opt(even, args);
trio1 = opt(trio, args);
color1 = opt(color, args);

let bet = args[0];

console.log(even1,trio1,color1);

/*games.set(`${channel.id}.roulette.${message.author.id}.bet${await game.keys(`${channel.id}.roulette.bet${message.author.id}`)}`,
    {bet: bet, num: num, even: even, trio: trio, color: color});
*/
let spin = Math.floor(Math.random() * 37);

function opt(opts, args) {
    let val = [];
    for (let c in opts) {
        for(let i=0; i<opts[c].length; i++) {
            if (args.includes(opts[c][i]))
                val.push(c);
        }
    }
    return val;
}