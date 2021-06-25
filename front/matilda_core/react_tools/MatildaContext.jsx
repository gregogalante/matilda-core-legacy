import React from 'react'

/**
 * @function MatildaContext
 */
 export const MatildaContext = React.createContext()

 /**
  * @function MatildaProvider
  * @param {*} props 
  */
export function MatildaProvider ({ matilda, children }) {
  const value = Object.assign(matilda, {
    _Translator: {
      translations: matilda?.i18n?.translations || {}
    },
    _Request: {
      routes: matilda?.router?.routes || {},
      fallbackErrorMessage: matilda?.i18n?.translations['matilda_core.messages.general_error']
    },
    _Redirect: {
      routes: matilda?.router?.routes || {}
    },
    _Form: {
      fallbackErrorMessage: matilda?.i18n?.translations['matilda_core.messages.general_error']
    },
  })

  return (
    <MatildaContext.Provider value={value} >
      {children}
    </MatildaContext.Provider>
  )
}