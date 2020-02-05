import Rails from '@rails/ujs'
import app from './app'
import FormController from './controllers/FormController'
import FlashController from './controllers/FlashController'
import HeaderController from './controllers/HeaderController'
import LinkController from './controllers/LinkController'
import ModalController from './controllers/ModalController'
import TippyController from './controllers/TippyController'

Rails.start()

app.register('form', FormController)
app.register('flash', FlashController)
app.register('header', HeaderController)
app.register('link', LinkController)
app.register('modal', ModalController)
app.register('tippy', TippyController)
