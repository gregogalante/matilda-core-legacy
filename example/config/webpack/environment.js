const { environment } = require('@rails/webpacker')
const matildaTheme = require('./matildaTheme')
environment.loaders.prepend('style', matildaTheme)
module.exports = environment
