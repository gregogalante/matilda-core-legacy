import { useContext } from 'react'
import { MatildaContext } from './MatildaContext'

/**
 * @function useMatildaRedirect
 * @param {string|object} route Stringa che identifica la rotta o oggetto
 * @param {string} route.path Path dove eseguire la richiesta
 * @param {string} route.method Metodo da utilizzare per la chiamata (es: GET, POST ecc.)
 * @returns 
 */
 export function useMatildaRedirect(route = null) {
  const { _Redirect: { routes } } = useContext(MatildaContext)

  /**
   * @function redirectRun
   * @param {*} options
   * @param {boolean} options.replace Specifica se eseguire il redirect sostituendo la pagina attuale o navigando alla pagina successiva
   */
  const redirectRun = (options = {}) => {
    let routeObject = typeof route == 'string' ? routes[route] : route

    if (!routeObject) { routeObject = { path: options.path } }

    if (options.replace) {
      window.location.replace(routeObject.path)
    } else {
      window.location.href = routeObject.path
    }
  }

  return { redirectRun }
}