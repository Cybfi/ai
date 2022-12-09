import natural from 'natural'
import keyword_extractor from 'keyword-extractor'
import { readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sentenceTokenizer = new natural.SentenceTokenizer();

export const parse = (input) => {
    const stemmedSentence = [];

    // Split the input up by sentence
    const sentences = sentenceTokenizer.tokenize(input)
    for (const sentence of sentences) {

        // Split the sentence up into keywords
        const words = keyword_extractor.extract(sentence,{
            language:"english",
            remove_digits: true,
            return_changed_case:true,
            remove_duplicates: true
        });
        for (const word of words) {

            // Get the word "base" and store it
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
            if(keywords.some(i => messageChunk.includes(i))) {
                if (!score[category]) score[category] = 1; else score[category]++
            }
        }
    }
    if (!score.innocent) { score.innocent = 1 }
    const result = {}

    for (const item of Object.keys(score)) {
        if (score[item] >= score.innocent) result[item] = score[item];
    }

    let finalName;
    if (Object.keys(result).length >= 1) finalName = Object.keys(result).reduce((a, b) => result[a] > result[b] ? a : b);

    const final = {
        name  : finalName,
        score : result[finalName],
        stack : score
    }

    return final;
}