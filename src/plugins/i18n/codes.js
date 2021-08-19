const locales = require('./locales');

module.exports = locales.map(locale => locale.code);
