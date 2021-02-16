const {parseArgs} = require('./config');
const {setApiDefaults, login, saveQuestions, clearPreviousQuestions} = require('./api');
const {parseFile} = require('./utils');

main();

async function main() {
    try {
        const {api, bot, email, password, file, clear} = parseArgs();
        setApiDefaults(api);

        await login(email, password);

        if(clear) {
            await clearPreviousQuestions(bot);
        }


        const questions = await parseFile(file);
        await saveQuestions(bot, questions);
    } catch (e) {
        console.error(e);
    }
}

