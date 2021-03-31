const minimist = require('minimist');

const sheetNameToLang = {
    'Arabic': 'ar',
    'English': 'en',
}

function parseArgs(validate = true) {
    const args = minimist(process.argv.slice(2));

    if(validate) {
        if (!args.api) {
            throw 'make sure to use --api with botpress api base url'
        }

        if (!args.bot) {
            throw 'make sure to use --bot with botpress bot id'
        }

        if (!args.file) {
            throw 'make sure to use --file with file containing questions'
        }

        if (!args.email || !args.password) {
            throw 'make sure to use --email and --password with botpress admin login info'
        }
    }

    return args;
}

module.exports = {
    sheetNameToLang,
    parseArgs,
};
