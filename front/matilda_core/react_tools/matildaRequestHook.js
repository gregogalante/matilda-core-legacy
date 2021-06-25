import { useContext } from 'react'
import { notification } from 'antd'
import { MatildaContext } from './MatildaContext'

/**
 * @function useMatildaRequest
 * @param {string|object} route Stringa che identifica la rotta o oggetto
 * @param {string} route.path Path dove eseguire la richiesta
 * @param {string} route.method Metodo da utilizzare per la chiamata (es: GET, POST ecc.)
 * @param {boolean} manageError Specifica se gestire l'error direttamente internamente
 * @returns 
 */
 export function useMatildaRequest(route, manageError = false) {
  const { _Request: { routes, fallbackErrorMessage } } = useContext(MatildaContext)

  /**
   * @function requestSend
   * @param {*} params 
   * @param {object} options Sostituisce i parametri di una richiesta tramite fetch()
   * @returns 
   */
  const requestSend = (params, options = {}) => {
    const routeObject = typeof route == 'string' ? routes[route] : route
    const method = routeObject?.method || 'GET'
    const body = method == 'GET' ? null : JSON.stringify(params)

    let url = routeObject?.path || ''
    // TODO: Generare per GET

    return new Promise((resolve, reject) => {
      fetch(url, Object.assign({
        method, body,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        } 
      }, options)).then((response) => {
        return response.json()
      }).then((response) => {
        if (!response.result && manageError) requestManageError(response)
        return resolve(response)
      }).catch((error) => {
        console.error(error)
        const response = { result: false, errors: [{ message: fallbackErrorMessage }] }
        if (manageError) requestManageError(response)
        return resolve(response)
      })
    })
  }

  /**
   * @function requestManageError
   * @description Esegue la gestione dell'errore delle API.
   * @param {*} response 
   */
  const requestManageError = (response) => {
    if (response.result) return

    let errorMessage = fallbackErrorMessage
    if (response.errors && response.errors.length > 0) {
      errorMessage = response.errors[0].message
    }

    notification['error']({
      message: 'Error',
      description: errorMessage
    })
  }

  return { requestSend, requestManageError }
}