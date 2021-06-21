cd example
rm -rf ./app/javascript/packs/matilda.js

rails matilda_core:install:front

export matilda_core_global_ui_version=''
rails s -p 3000 & ./bin/webpack-dev-server