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

4. Installo le dipendenze front-end modificando il file **/package.json**

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

5. Creare uil file di configurazione in **/config/initializers/matilda_core.rb** e inserire il seguente codice

```ruby
MatildaCore.configure do |config|
  # Qui si possono sovrascrivere le configurazioni
end
```

6. Aggiungere le rotte sul file **/config/routes.rb**

```ruby
Rails.application.routes.draw do
  # ...

  mount MatildaCore::Engine => '/matilda/core'
end
```

7. Aggiungere un file **/app/javascript/packs/matilda.js** per eseguire il require dei moduli di Matilda

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

Le configurazioni disponibili sono documentate nel file sorgente [**lib/matilda_core/config.rb**](https://github.com/ideonetwork/matilda-core/blob/master/lib/matilda_core/config.rb).

Per configurare il modulo creare un file **/config/initializers/matilda_core.rb**:

```ruby
MatildaCore.configure do |config|
  config.global_title = 'My App Name'
end
```

## Personalizzazione

Tutto l'aspetto estetico dell'applicativo può essere personalizzato sovrascrivendo o personalizzando il CSS.
In fase di installazione il comando **rails matilda_core:install:front** viene utilizzato per copiare tutti i sorgenti in **/vendor/matilda_core**. I sorgenti NON DEVONO MAI ESSERE MODIFICATI perchè nel caso di aggiornamenti del modulo rieseguendo lo stesso comando i vecchi sorgenti vengono sovrascritti da quelli nuovi.

### Importare i sogenti JS e SCSS

Per importare direttamente i sorgenti Javascript e SCSS del modulo seguire i seguenti punti:

1. Modificare il file **/app/javascript/packs/matilda.js** sostituendo l'import aggiunto in fase di installazione del modulo e aggiungendo l'import di un proprio file Javascript e SCSS:

```javascript
// import '../../../vendor/matilda_core/loader.js'
import '../../../vendor/matilda_core/loader_assets.js'

import '../style/main.scss'
import '../scripts/main.js'
```

2. Modificare il file **/app/javascript/style/main.scss** in modo da importare il main file CSS del modulo:

```scss
@import '../../../vendor/matilda_core/style/main';
```

3. Modificare il file **/app/javascript/scripts/main.js** in modo da importare il main file javascript del modulo:

```javascript
import '../../../vendor/matilda_core/scripts/main'
```

A questo punto è possibile aggiungere il proprio codice CSS o Javascript all'interno dei file **/app/javascript/style/main.scss** e **/app/javascript/scripts/main.js**.

### Sovrascrivere le variabili SCSS di default

Tutte le variabili SCSS utilizzate dal modulo sono definite sul file parziale **/vendor/matilda_core/style/_variables.scss**. L'importazione del resto dei file parziali necessari è dichiarata sul file parziale  **/vendor/matilda_core/style/_imports.scss**. Per sovrascrivere le variabili SCSS di default basta copiare il contenuto del file **/vendor/matilda_core/style/_variables.scss** in un proprio file (esempio: **/app/javascript/style/_variables.scss**) e modificare il file **/app/javascript/style/main.scss** come di seguito:

```scss
// @import '../../../vendor/matilda_core/style/main';
@import 'variables';
@import '../../../vendor/matilda_core/style/imports';
```

## Multilingua

Matilda supporta nativamente il multilingua appoggiandosi a Rails I18n.

Se l'applicativo principale è configurato per lavorare con più di una lingua allora in automatico risulterà disponibile nell'header un selettore per il cambio lingua.

Al momento sono supportate la lingua inglese, italiana, americana.
