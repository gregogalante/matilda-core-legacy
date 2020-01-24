# Matilda Core

Modulo Core per il progetto Matilda.

## Installazione

1. Aggiungo la gemma sul Gemfile

2. Eseguo le migrazioni

```ruby
rails matilda_core:install:migrations
rails db:migrate
```

3. Copio le dipendenze font-end in **vendor**

```ruby
rails matilda_core:install:front
```

4. Installo le dipendenze front-end modificando il file **package.json**

```js
{
  "name": "app_name",
  "private": true,
  "dependencies": {
    "@matilda/core": "file:./vendor/matilda_core",
    // ...
  },
  "version": "0.1.0",
  "devDependencies": {
    // ...
  }
}
```

5. Creare uil file di configurazione in **config/initializers/matilda_core.rb** e inserire il seguente codice

```ruby
MatildaCore.configure do |config|
  # Qui si possono sovrascrivere le configurazioni
end
```

6. Aggiungere le rotte sul file **config/routes.rb**

```ruby
Rails.application.routes.draw do
  # ...

  mount MatildaCore::Engine => '/matilda/core'
end
```

7. Aggiungere un file **app/javasccript/packs/matilda.js** per eseguire il require dei moduli di Matilda

```javascript
import '../../../vendor/matilda_core/loader.js'
```

NOTE: Se ci sono problemi di compilazione aggiungere sul file di configurazione di webpacker, nell'array **resolved_paths** la path del modulo di Matilda

```yaml
default: &default
  #...

  resolved_paths: ['vendor/matilda_core']
```

## Configurazione

Le configurazioni disponibili sono documentate nel file sorgente **/lib/matilda_core/config.rb**.

Per configurare il modulo creare un file **/config/initializers/matilda_core.rb**:

```ruby
MatildaCore.configure do |config|
  config.global_title = 'My App Name'
end
```

## Multilingua

TODO
