const getStyleRule = require('@rails/webpacker/package/utils/get_style_rule')

module.exports = getStyleRule(/\.less$/i, false, [
  {
    loader: 'less-loader',
    options: {
      sourceMap: true,
      lessOptions: {
        modifyVars: {
          'primary-color': "#273c75", 
        },
        javascriptEnabled: true
      }
    },
  }
])