const axios = require('axios');

function setApiDefaults(token) {
    axios.defaults.baseURL = 'https://api.wit.ai/';
    axios.defaults.headers['Content-Type'] = 'application/json';
    axios.defaults.headers['Authorization'] = `Bearer ${token}`;
    axios.defaults.params = {v: 20200513};
}

const UtterancesCallsLimitInMin = 200;
let utterancesCalls = 0;

const intentsAdd = name => {
    return axios.post('intents', {name});
};

const utterancesAdd = async body => {
    if (utterancesCalls >= UtterancesCallsLimitInMin) {
        utterancesCalls = 0;
        await sleep(60000);
    }

    utterancesCalls += body.length;
    await axios.post('utterances', body);
};

async function intentAdd(content) {
    try {
        await intentsAdd(content.name);
        const utterances = bpIntentToWitUtterances(content);
        await utterancesAdd(utterances);
    }catch (e) {
        console.log(e);
    }
}

function bpIntentToWitUtterances(content) {
    const utterances = [];
    content.utterances.forEach(async utterance => {
        utterances.push({
            text: utterance,
            intent: content.name,
            entities: [],
            traits: []
        });
    });
    return utterances;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveQuestions(questions) {
    for (let i = 0; i < questions.length; i++) {
        console.log(`${Math.ceil((i + 1) * 100 / questions.length)}%`);
        await intentAdd(questions[i]);
    }
}


module.exports = {
    setApiDefaults,
    saveQuestions,
};
