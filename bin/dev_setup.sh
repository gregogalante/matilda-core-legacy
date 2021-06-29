cd example

bundle install
yarn install

rails db:drop
rails db:migrate
rails db:seed

rails matilda_core:generator:group uuid=demo name=Demo
rails matilda_core:generator:user group_uuid=demo username=demo email=demo@mail.com password=Password1!

rm -rf ./app/javascript/packs/matilda.js
rails matilda_core:install:front_update

cd ..