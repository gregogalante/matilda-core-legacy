import 'antd/dist/antd.css'
import { ConfigProvider } from 'antd'
import React, { useState } from 'react'
import PropTypes from 'prop-types'

import en from 'antd/lib/locale/en_GB'
import it from 'antd/lib/locale/it_IT'
import us from 'antd/lib/locale/en_US'

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function useMatilda
 * @description Main hook for all Matilda React components.
 * @param {*} matildaProps 
 * @returns 
 */
export function useMatilda (matildaProps) {
  const [i18n, setI18n] = useState(matildaProps.i18n)
  console.log(matildaProps)

  //////////////////////////////////////////////////////////

  const I18n_translate = (key) => {
    return i18n.translations[key] || key
  }

  //////////////////////////////////////////////////////////

  const Requests_post = (pathNameOrUrl, params = {}, options = {}) => {
    const url = pathNameOrUrl // TODO

    return fetch(url, Object.assign({
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(params)
    }, options)).then((response) => response.json())
  }

  const Requests_get = (pathNameOrUrl, params = {}, options = {}) => {
    const url = pathNameOrUrl // TODO

    return fetch(url, Object.assign({
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      method: "GET"
    }, options)).then((response) => response.json())
  }

  //////////////////////////////////////////////////////////

  return {
    I18n: {
      translate: I18n_translate,
      t: I18n_translate
    },
    Requests: {
      post: Requests_post,
      get: Requests_get
    },
    containerProps: {
      locale: i18n.locale
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @function MatildaContainer
 * @description Main container for all Matilda React components.
 * @param {*} props 
 */
export function MatildaContainer (props) {

  const availableLocales = { en, it, us }

  //////////////////////////////////////////////////////////

  return (
    <ConfigProvider locale={availableLocales[props.locale] || en}>
      {props.children}
    </ConfigProvider>
  )
}

MatildaContainer.propTypes = {
  locale: PropTypes.string
}

MatildaContainer.defaultProps = {
  locale: 'en'
}
