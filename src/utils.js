const xlsx = require('xlsx');
const fs = require('fs');
const {sheetNameToLang} = require('./config')

function buildQuestionEntity(contexts = [], lang, alternatives, answer) {
    return {
        "action": "text",
        "contexts": ['global', ...contexts.filter(context => !!context)],
        "enabled": true,
        "answers": {[lang]: [answer]},
        "questions": {[lang]: alternatives},
        "redirectFlow": "",
        "redirectNode": ""
    }
}

async function parseFile(file) {
    let questions = {};

    const template = {}

    const buffer = await fs.promises.readFile(file);
    const wb = xlsx.read(buffer, {type: 'buffer'});
    const dataArr = Object.values(wb.Sheets).map(sheet => xlsx.utils.sheet_to_json(sheet, {header: 1, defval: null}));
    dataArr.forEach((sheet, i) => {
        const sheetName = wb.SheetNames[i];
        let headers = sheet.splice(0, 1)[0];
        if (!headers) {
            return;
        }
        headers.forEach((header, i) => {
            if (header) {
                template[i] = header
            }
        });

        const data = dataArr.reduce((acc, val) => acc.concat(val), []);
        data.forEach(row => {
            let question = {};
            row.forEach((value, i) => {
                const header = template[i];
                question[header] = value;
            });

            if (!questions[sheetNameToLang[sheetName]]) {
                questions[sheetNameToLang[sheetName]] = {}
            }

            if (!questions[sheetNameToLang[sheetName]][question.Intent]) {
                questions[sheetNameToLang[sheetName]][question.Intent] = []
            }

            if (!question.Question) {
                return;
            }

            if (!question.Answers) {
                question.Answers = 'TO_BE_ANSWERED'
            }

            questions[sheetNameToLang[sheetName]][question.Intent].push(question);
        })
    })

    const questionsList = [];
    Object.keys(questions).forEach(lang => {
        Object.keys(questions[lang]).forEach(intent => {
            const intentQuestions = questions[lang][intent];
            if(intentQuestions && intentQuestions.length) {
                const {Category, Answers, Intent, Order} = intentQuestions[0];
                questionsList.push(buildQuestionEntity([`Category/${Category}`, `Intent/${Intent}`,  `Order/${Order}`], lang, intentQuestions.map(q => q.Question), Answers));
            }
        })
    })

    return questionsList;
}

module.exports = {
    buildQuestionEntity,
    parseFile,
};
