const fs = require('fs');
const axios = require('axios');

const token = 'CRMWQSGB5G6ZKURBUQRGQSN44TPDSBDT';

main();

async function main() {
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
        const intents = await getIntent(message);

        res.push({message, intents})
    }

   fs.writeFileSync('try-results.json', JSON.stringify(res, null, 2));
}

async function getIntent(message) {
    const res = await axios.get('https://api.wit.ai/message', {
        headers: {'Authorization': `Bearer ${token}`},
        params: {v: '20200513', q: message}
    });

    return res.data.intents;
}
