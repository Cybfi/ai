import natural from 'natural'
import keyword_extractor from 'keyword-extractor'
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sentenceTokenizer = new natural.SentenceTokenizer();

export const parse = (input) => {
    const stemmedSentence = [];
    const sentences = sentenceTokenizer.tokenize(input)
    for (const sentence of sentences) {
        const words = keyword_extractor.extract(sentence,{
            language:"english",
            remove_digits: true,
            return_changed_case:true,
            remove_duplicates: true
        });
        for (const word of words) {
            const stemmedWord = natural.PorterStemmer.stem(word)
            stemmedSentence.push(stemmedWord)
        }
    }
    return stemmedSentence
}

export const inference = async (input) => {
    const model = JSON.parse(await readFileSync(dirname(fileURLToPath(import.meta.url)) + "\\..\\..\\..\\model\\model.json"));
    const keywords = parse(input)

    let score = {}
    for (const category of Object.keys(model)) {
        for(const messageChunk of model[category]) {
            for (const keyword of keywords) {
                for (const modelChunk of messageChunk) {
                    if (messageChunk.includes(keyword)) {
                        if (!score[category]) score[category] = 0;
                        score[category] = score[category] + natural.JaroWinklerDistance(modelChunk, keyword)
                    }
                }
            }
        }
    }

    let finalName;
    if (Object.keys(score).length >= 1) finalName = Object.keys(score).reduce((a, b) => score[a] > score[b] ? a : b);

    const final = {
        name  : finalName,
        score : score[finalName],
        stack : score
    }

    return final;
}