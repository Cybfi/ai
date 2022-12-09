import { parse, inference } from '../src/lib/parse/index.mjs'
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let i = 1

while(true) {
    const inputPart = await rl.question('> ')
    console.time("parse")
    console.log(parse(inputPart))
    console.log(await inference(inputPart))
    console.timeEnd("parse")
    console.log(i++)
}