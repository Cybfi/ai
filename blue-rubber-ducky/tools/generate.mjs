import { parse } from '../src/lib/parse/index.mjs'
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync, readFileSync } from 'node:fs';

const modelTemplate = JSON.parse(readFileSync(dirname(fileURLToPath(import.meta.url)) + '\\..\\model\\rawModel.json'))

const model = {}

console.time("generate model")

for(const category of Object.keys(modelTemplate)) {
    model[category] = []
    for(const message of modelTemplate[category]) {
        model[category].push(parse(message))
    }
}
writeFileSync(dirname(fileURLToPath(import.meta.url)) + '\\..\\model\\model.json', JSON.stringify(model), null, 0)
console.timeEnd("generate model")