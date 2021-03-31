const fs = require('fs');
const axios = require('axios');
const {stem} = require("../stem");

const token = 'ERVIAS2HGFMTEUSRT5NKTWQYXCDVOEMN';

main();

async function main() {
    const lang = 'arabic';
    const messages = [
        'سبل الوصول لمقالات علمية في دوريات محكمة',
        'سبل الوصول لمقالات علمية',
        'الوصول لمقالات علمية في دوريات محكمة',
        'الوصول لمقالات علمية',
        'مقالات علمية في دوريات محكمة',
        'الوصول لمقالات في دوريات محكمة',
        'الوصول الى مقالات في دوريات محكمة',
        'الوصول الى مقالات في الدوريات المحكمة',
        'وصول لمقالات في دوريات محكمة'
    ];

    const res = [];

    for (const message of messages) {
        const stemmedMessage = stem(message, lang);
        const intents = await getIntent(stemmedMessage);

        res.push({message, stemmedMessage, intents})
    }

   fs.writeFileSync('try-results-stemmed.json', JSON.stringify(res, null, 2));
}

async function getIntent(message) {
    const res = await axios.get('https://api.wit.ai/message', {
        headers: {'Authorization': `Bearer ${token}`},
        params: {v: '20200513', q: message}
    });

    return res.data.intents;
}
