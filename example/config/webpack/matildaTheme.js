const getStyleRule = require('@rails/webpacker/package/utils/get_style_rule')

module.exports = getStyleRule(/\.less$/i, false, [
  {
    loader: 'less-loader',
    options: {
      sourceMap: true,
      lessOptions: {
        modifyVars: {
          'primary-color': "#0097e6", 
        },
        javascriptEnabled: true
      }
    },
  }
])