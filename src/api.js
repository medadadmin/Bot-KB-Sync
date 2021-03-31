const axios = require('axios');
const nanoid = require('nanoid').customAlphabet('1234567890abcdef', 10);

function setApiDefaults(api) {
    axios.defaults.baseURL = api;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
}

async function login(email, password) {
    const res = await axios.post(`auth/login/basic/default`, JSON.stringify({email, password}));
    const token = res.data.payload.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

async function saveQuestions(bot, questions, useIntent = false) {
    // todo: load first
    const mainFlow = {
        "flow": {
            "name": "main.flow.json",
            "version": "0.0.1",
            "flow": "main.flow.json",
            "location": "main.flow.json",
            "startNode": "main",
            "catchAll": {"onReceive": [], "next": []},
            "links": [{
                "source": "24a71a2957",
                "sourcePort": "out0",
                "target": "entry",
                "points": [{"x": 545, "y": 231}, {"x": 266, "y": 8}]
            }],
            "nodes": [{
                "id": "entry",
                "name": "main",
                "next": [],
                "onEnter": [],
                "onReceive": null,
                "x": 265,
                "y": -10,
                "lastModified": "2021-03-07T10:17:24.486Z"
            }]
        }
    };

    for (let i = 0; i < questions.length; i++) {
        console.log(`${Math.ceil((i + 1) * 100 / questions.length)}%`);
        if (useIntent) {
            const question = questions[i];
            const lang = Object.keys(question.questions)[0];
            const intent = {
                name: question.questions[lang][0].replace(/[\s']/g, '-').toLowerCase(),
                utterances: question.questions
            }

            await addIntent(intent);

            const element = await addTextElement({
                "formData": {[`markdown$${lang}`]: false,[`typing$${lang}`]: true, [`text$${lang}`]: question.answers[lang][0]}
            })

            mainFlow.flow.nodes.push({
                "id": nanoid(),
                "name": intent.name,
                "onEnter": [`say #!${element.data}`],
                "onReceive": null,
                "next": [],
                "type": "standard"
            })

            const entryNode = mainFlow.flow.nodes[0];
            entryNode.next.push({"condition": `event.nlu.intent.name === '${intent.name}'`, "node": intent.name})
        } else {
            await addQna(questions[i]);
        }

    }

    if (useIntent) {
        await updateMainFlow(mainFlow);
    }

    function addQna(question) {
        return axios.post(`bots/${bot}/mod/qna/questions`, JSON.stringify(question));
    }

    function addIntent(intent) {
        return axios.post(`bots/${bot}/nlu/intents`, JSON.stringify(intent));
    }

    function updateMainFlow(flow) {
        return axios.post(`bots/${bot}/flow/main.flow.json`, JSON.stringify(flow));
    }

    function addTextElement(text) {
        return axios.post(`bots/${bot}/content/builtin_text/element`, JSON.stringify(text));
    }
}

async function clearPreviousQuestions(bot) {
    const res = await axios.get(`bots/${bot}/mod/qna/questions`);
    const previousQuestions = res.data.items;

    for (let i = 0; i < previousQuestions.length; i++) {
        await axios.post(`bots/${bot}/mod/qna/questions/${previousQuestions[i].id}/delete`)
    }
}

module.exports = {
    setApiDefaults,
    login,
    saveQuestions,
    clearPreviousQuestions
};
