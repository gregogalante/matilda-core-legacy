import { Controller } from 'stimulus'
import { getSreenSizes, enableScroll, disableScroll } from '../utils'

class HeaderController extends Controller {
  static targets = ['profileMenu']

  connect() {
    // set menu preference to close in case of mobile device
    if (getSreenSizes().width <= 768) {
      fetch($routes.update_menu_preference + `?menu_preference=closed`)
        .then(_response => {})
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
    if (getSreenSizes().width > 768) {
      setTimeout(() => {
        const preference = document.body.classList.contains('is-menu-closed') ? 'closed' : 'opened'
        fetch($routes.update_menu_preference + `?menu_preference=${preference}`).then(_response => {})
      }, 250)
    }
    
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
