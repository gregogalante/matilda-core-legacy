import { ConfigProvider, Layout, Menu, Form, SubMenu, notification } from 'antd'
import {
  UserOutlined,
  FlagOutlined
} from '@ant-design/icons';
import React, { useMemo, useContext } from 'react'

import en from 'antd/lib/locale/en_GB'
import it from 'antd/lib/locale/it_IT'
import us from 'antd/lib/locale/en_US'

const { Header, Content, Footer, Sider } = Layout

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

/**
 * @function MatildaContainer
 * @description Main container for all Matilda React components.
 * @param {*} props 
 */
export function MatildaContainer ({ matilda, layout, children }) {
  const { config: { global_title, global_logo }, i18n: { available_locales, locale } } = matilda

  const antdLocale = useMemo(() => {
    const availableLocales = { en, it, us }
    return availableLocales[matilda?.i18n?.locale] || en
  }, [matilda])

  const HeaderComponent = () => {
    return (
      <Header className="layout__header">
        <div className="layout__header-logo">
          {global_logo ? (
            <img src={global_logo} />
          ) : (
            <span>{global_title}</span>
          )}
        </div>
        <Menu className="layout__header-menu" theme="dark" mode="horizontal" selectedKeys={[`locale_${locale}`]}>
          <Menu.SubMenu key="language" icon={<FlagOutlined />}>
            {available_locales.map((availableLocale) => {
              return (
                <Menu.Item key={`locale_${availableLocale}`}>{availableLocale.toUpperCase()}</Menu.Item>
              )
            })}
          </Menu.SubMenu>
        </Menu>
      </Header>
    )
  }

  const FooterComponent = () => {
    return (
      <Footer style={{ textAlign: 'center' }}>{global_title} - © {new Date().getFullYear()}</Footer>
    )
  }

  if (layout == 'authentication') {
    return (
      <MatildaProvider matilda={matilda}>
        <ConfigProvider locale={antdLocale}>
          <Layout className="layout">
            <Layout>
              <HeaderComponent />
              <Content className="layout__content layout__content--authentication">
                {children}
              </Content>
              <FooterComponent />
            </Layout>
          </Layout>      
        </ConfigProvider>
      </MatildaProvider>
    )
  }

  return (
    <MatildaProvider matilda={matilda}>
      <ConfigProvider locale={antdLocale}>
        <Layout className="layout">
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
            }}
          >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
          </Menu>
          </Sider>
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            <HeaderComponent />
            <Content className="layout__content">
              
            </Content>
            <FooterComponent />
          </Layout>
        </Layout>      
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
  const { _Form: { fallbackErrorMessage } } = useContext(MatildaContext)
  const [form] = Form.useForm()

  /**
   * @function formOnResponseError
   * @param {object} response Oggetto risposta proveniente da useMatildaRequest
   * @returns 
   */
  const formOnResponseError = (response) => {
    if (response.result) return

    const fieldsKeys = Object.keys(form.getFieldsValue())
    if (response.errors && response.errors.length > 0) {
      const errorsWithFields = response.errors.filter((e) => fieldsKeys.includes(e.code))
      form.setFields(errorsWithFields.map((err) => ({ name: err.code, errors: [err.message] })))

      const errorsWithoutFields = response.errors.filter(x => !errorsWithFields.includes(x))
      if (errorsWithoutFields.length > 0) {
        notification['error']({
          message: 'Error',
          description: errorsWithoutFields[0].message
        })
      }
    } else {
      if (errorsWithoutFields.length > 0) {
        notification['error']({
          message: 'Error',
          description: fallbackErrorMessage
        })
      }
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