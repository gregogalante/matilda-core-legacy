import { Controller } from 'stimulus'
import { getSreenSizes, enableScroll, disableScroll } from '../utils'

class HeaderController extends Controller {
  static targets = ['profileMenu']

  connect() {
    // set menu preference to close in case of mobile device
    if (getSreenSizes().width <= 768) {
      document.body.classList.add('is-menu-closed')
    }
  }

  /**
   * @function toggleProfile
   */
  toggleProfile() {
    this.profileMenuTarget.classList.toggle('is-active')
  }

  /**
   * @function toggleMenu
   */
  toggleMenu() {    
    if (document.body.classList.contains('is-menu-closed')) {
      document.body.classList.remove('is-menu-closed')

      if (getSreenSizes().width <= 768) { disableScroll() }
    } else {
      document.body.classList.add('is-menu-closed')

      if (getSreenSizes().width <= 768) { enableScroll() }
    }
  }
}

export default HeaderController
