import Rails from '@rails/ujs'
import { Application } from 'stimulus'
import FormController from './controllers/FormController'
import FlashController from './controllers/FlashController'
import HeaderController from './controllers/HeaderController'
import LinkController from './controllers/LinkController'
import ModalController from './controllers/ModalController'
import TippyController from './controllers/TippyController'

Rails.start()

const application = Application.start()
application.register('form', FormController)
application.register('flash', FlashController)
application.register('header', HeaderController)
application.register('link', LinkController)
application.register('modal', ModalController)
application.register('tippy', TippyController)