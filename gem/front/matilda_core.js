import 'antd/dist/antd.css'
import { ConfigProvider, Form, notification } from 'antd'
import React, { useMemo, useContext } from 'react'

import en from 'antd/lib/locale/en_GB'
import it from 'antd/lib/locale/it_IT'
import us from 'antd/lib/locale/en_US'

/**
 * @function MatildaContext
 */
export const MatildaContext = React.createContext()

 /**
  * @function MatildaProvider
  * @param {*} props 
  */
export function MatildaProvider (props) {
  const value = {
    _Translator: {
      translations: props.matilda?.i18n?.translations || {}
    },
    _Request: {
      routes: props.matilda?.router?.routes || {},
      fallbackErrorMessage: props.matilda?.i18n?.translations['matilda_core.messages.general_error']
    },
    _Redirect: {
      routes: props.matilda?.router?.routes || {}
    }
  }

  return (
    <MatildaContext.Provider value={value} >
      {props.children}
    </MatildaContext.Provider>
  )
}

/**
 * @function MatildaContainer
 * @description Main container for all Matilda React components.
 * @param {*} props 
 */
export function MatildaContainer (props) {
  console.log(props)

  const locale = useMemo(() => {
    const availableLocales = { en, it, us }
    return availableLocales[props.matilda?.i18n?.locale] || en
  }, [props.matilda])

  return (
    <MatildaProvider matilda={props.matilda}>
      <ConfigProvider locale={locale}>
        {props.children}
      </ConfigProvider>
    </MatildaProvider>
  )
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function useMatildaForm
 * @returns 
 */
export function useMatildaForm() {
  const [form] = Form.useForm()

  /**
   * @function formOnResponseError
   * @param {object} response Oggetto risposta proveniente da useMatildaRequest
   * @returns 
   */
  const formOnResponseError = (response) => {
    if (response.result) return

    const fieldsKeys = Object.keys(form.getFieldsValue())
    const errorsWithFields = response.errors.filter((e) => fieldsKeys.includes(e.code))
    const errorsWithoutFields = response.errors.filter(x => !errorsWithFields.includes(x))

    form.setFields(errorsWithFields.map((err) => ({ name: err.code, errors: [err.message] })))

    if (errorsWithoutFields.length > 0) {
      notification['error']({
        message: 'Error',
        description: errorsWithoutFields[0].message
      })
    }
  }

  return { form, formOnResponseError }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function useMatildaTranslator
 * @returns 
 */
export function useMatildaTranslator() {
  const { _Translator: { translations } } = useContext(MatildaContext)

  /**
   * @function translate
   * @param {string} key Stringa che identifica la traduzione
   * @returns 
   */
  const translate = (key) => {
    return translations[key] || key
  }

  return { translate, t: translate }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function useMatildaRequest
 * @param {string|object} route Stringa che identifica la rotta o oggetto
 * @param {string} route.path Path dove eseguire la richiesta
 * @param {string} route.method Metodo da utilizzare per la chiamata (es: GET, POST ecc.)
 * @returns 
 */
export function useMatildaRequest(route) {
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
        return resolve(response)
      }).catch((error) => {
        console.error(error)
        return resolve({ result: false, errors: [{ message: fallbackErrorMessage }] })
      })
    })
  }

  return { requestSend }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function useMatildaRedirect
 * @param {string|object} route Stringa che identifica la rotta o oggetto
 * @param {string} route.path Path dove eseguire la richiesta
 * @param {string} route.method Metodo da utilizzare per la chiamata (es: GET, POST ecc.)
 * @returns 
 */
export function useMatildaRedirect(route) {
  const { _Redirect: { routes } } = useContext(MatildaContext)

  /**
   * @function redirectRun
   * @param {*} options
   * @param {boolean} options.replace Specifica se eseguire il redirect sostituendo la pagina attuale o navigando alla pagina successiva
   */
  const redirectRun = (options = {}) => {
    const routeObject = typeof route == 'string' ? routes[route] : route
    if (options.replace) {
      window.location.replace(routeObject.path)
    } else {
      window.location.href = routeObject.path
    }
  }

  return { redirectRun }
}