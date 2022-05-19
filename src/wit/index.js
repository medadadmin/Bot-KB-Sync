const {parseArgs} = require('../config');
const {setApiDefaults, saveQuestions} = require('./wit-api');
const {stem} = require('../stem');

main();

async function main() {
  try {
    const {token, file, clear} = parseArgs(false);
    setApiDefaults(token);

    if(clear) {
      // todo: implement
    }

    const questions = parseQNAFile(file);
    await saveQuestions(questions);
  } catch (e) {
    console.error(e);
  }
}

function parseQNAFile(file) {
  const qnas = require(file).qnas;

  const questions = qnas.map(({id, data}) => {
    return {
      name: `__qna__${id}`,
      utterances: data.questions[Object.keys(data.questions)[0]].map(text => stem(text, Object.keys(data.questions)[0]))
    }
  });

  return questions;
}
