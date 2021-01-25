const {parseArgs} = require('./config');
const {setApiDefaults, login, saveQuestions} = require('./api');
const {parseFile} = require('./utils');

main();

async function main() {
    try {
        const {api, bot, email, password, file} = parseArgs();
        setApiDefaults(api);

        await login(email, password);
        const questions = await parseFile(file);
        await saveQuestions(bot, questions);
    } catch (e) {
        console.error(e);
    }
}

