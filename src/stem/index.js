const Stemmer = require('./arabic-stemmer');
const Snowball = require('./snowball');
const snowball = new Snowball('English');

function stem(text, lang) {
    if(lang === 'ar') {
        return stemAr(text);
    }else{
        return stemEn(text);
    }
}

function stemAr(text) {
    const stemmer = new Stemmer();
    return text.split(' ').map(w => stemmer.stem(w).normalized).join(' ')
}

function stemEn(text) {
    return text.split(' ').map(w => {
        snowball.setCurrent(w);
        snowball.stem();
        return snowball.getCurrent()
    }).join(' ');
}

module.exports = {
    stem,
};
