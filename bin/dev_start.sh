cd example
rm -rf ./app/javascript/packs/matilda.js

rails matilda_core:install:front

rails s -p 3000 & ./bin/webpack-dev-server
