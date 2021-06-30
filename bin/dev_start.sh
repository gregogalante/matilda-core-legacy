cd example

rails matilda_core:install:front_update

rails s -p 3001 & ./bin/webpack-dev-server
