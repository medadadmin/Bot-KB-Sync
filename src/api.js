const axios = require('axios');

function setApiDefaults(api) {
    axios.defaults.baseURL = api;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
}

async function login(email, password) {
    const res = await axios.post(`auth/login/basic/default`, JSON.stringify({email, password}));
    const token = res.data.payload.token;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

async function saveQuestions(bot, questions) {
    for (let i = 0; i < questions.length; i++) {
        console.log(`${Math.ceil((i + 1) * 100 / questions.length)}%`);
        await addQna(questions[i]);
    }

    function addQna(question) {
        return axios.post(`bots/${bot}/mod/qna/questions`, JSON.stringify(question));
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
