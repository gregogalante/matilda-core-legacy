import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { ConfigProvider, Layout, Menu } from 'antd'
import * as Icons from '@ant-design/icons'
import { MatildaProvider } from './MatildaContext'
import { useMatildaRequest } from './matildaRequestHook'
import { useMatildaRedirect } from './matildaRedirectHook'
import { useMatildaTranslator } from './matildaTranslatorHook'

import en from 'antd/lib/locale/en_GB'
import it from 'antd/lib/locale/it_IT'
import us from 'antd/lib/locale/en_US'

/**
 * @function MatildaContainerHeader
 * @param {*} props 
 * @returns 
 */
export function MatildaContainerHeader (props) {
  const { matilda } = props
  const { config: { global_title, global_logo }, i18n: { available_locales }, session } = matilda
  const { requestSend: requestSendHelperUpdateSessionLocale } = useMatildaRequest('matilda_core.helper_update_session_locale', true)
  const { t } = useMatildaTranslator()

  //////////////////////////////////////////////////////////

  const onChangeLocale = (newLocale) => {
    requestSendHelperUpdateSessionLocale({ locale: newLocale }).then((response) => {
      if (!response.result) return
      window.location.reload()
    })
  }

  //////////////////////////////////////////////////////////

  return (
    <Layout.Header className="matilda-container__header">
      <div className="matilda-container__header-logo">
        {global_logo ? (
          <img src={global_logo} />
        ) : (
          <span>{global_title}</span>
        )}
      </div>
      <Menu className="matilda-container__header-menu" theme="dark" mode="horizontal">
        {session?.user_uuid && (
          <Menu.SubMenu key="profile" icon={<Icons.UserOutlined />}>
            <Menu.Item key={`profile_account_settings`}>{t('matilda_core.header.account_settings')}</Menu.Item>
            <Menu.Item key={`profile_groups`}>{t('matilda_core.header.groups')}</Menu.Item>
            <Menu.Item key={`profile_logout`}>{t('matilda_core.header.logout')}</Menu.Item>
          </Menu.SubMenu>
        )}
        <Menu.SubMenu key="language" icon={<Icons.FlagOutlined />}>
          {available_locales.map((availableLocale) => {
            return (
              <Menu.Item
                key={`locale_${availableLocale}`}
                onClick={() => onChangeLocale(availableLocale)}
              >{availableLocale.toUpperCase()}</Menu.Item>
            )
          })}
        </Menu.SubMenu>
      </Menu>
    </Layout.Header>
  )
}

/**
 * @function MatildaContainerFooter
 * @param {*} props 
 * @returns 
 */
export function MatildaContainerFooter (props) {
  const { matilda } = props
  const { config: { global_title } } = matilda

  return (
    <Layout.Footer style={{ textAlign: 'center' }}>{global_title} - © {new Date().getFullYear()}</Layout.Footer>
  )
}

/**
 * @function MatildaContainerSidebar
 * @param {*} props 
 */
export function MatildaContainerSidebar (props) {
  const { matilda, sidebarCollapsedValue, onSidebarCollapsedChange } = props
  const { view: { sidebar }, session } = matilda
  const { redirectRun: redirectRunForSidebarItem } = useMatildaRedirect()

  console.log(matilda)

  //////////////////////////////////////////////////////////

  const sidebarItems = useMemo(() => {
    let items = []
    if (matilda?.config?.sidebar_items) {
      // filter permissions
      items = items.filter((i) => !i.permission || (session?.group_permissions && session.group_permissions.includes(i.permission)))
      // order by index
      items = matilda.config.sidebar_items.sort((a, b) => a.index - b.index)
      // update labels
      items = items.map((i) => { if (i.label.startsWith('locale.')) { i.label = matilda?.i18n?.translations[i.label.replace('locale.', '')] } return i })
    }

    return items
  }, [matilda])

  //////////////////////////////////////////////////////////

  const onGoToPage = (sidebarItem) => {
    redirectRunForSidebarItem({ path: sidebarItem.url })
  }

  //////////////////////////////////////////////////////////

  return (
    <Layout.Sider
      className="matilda-container__side"
      width={250}
      collapsible
      collapsed={sidebarCollapsedValue}
      onCollapse={onSidebarCollapsedChange}
    >
      <div className="logo" />
      <Menu mode="vertical" className="matilda-container__side-menu" selectedKeys={[sidebar]}>
        {sidebarItems.map((sidebarItem) => {
          const IconItem = sidebarItem.icon ? Icons[sidebarItem.icon] : null
          return (
            <Menu.Item key={sidebarItem.name} onClick={() => onGoToPage(sidebarItem)} icon={IconItem ? <IconItem /> : null}>
              {sidebarItem.label}
            </Menu.Item>
          )
        })}
      </Menu>
    </Layout.Sider>
  )
}

/**
 * @function MatildaContainer
 * @description Main container for all Matilda React components.
 * @param {*} props 
 */
export function MatildaContainer (props) {
const { matilda, layout, children } = props
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  //////////////////////////////////////////////////////////

  const antdLocale = useMemo(() => {
    const availableLocales = { en, it, us }
    return availableLocales[matilda?.i18n?.locale] || en
  }, [matilda])

  //////////////////////////////////////////////////////////

  const onSidebarCollapsedChange = (value) => {
    setSidebarCollapsed(value)
  }

  //////////////////////////////////////////////////////////

  if (layout == 'authentication') {
    return (
      <MatildaProvider matilda={matilda}>
        <ConfigProvider locale={antdLocale}>
          <Layout className="matilda-container">
            <MatildaContainerHeader matilda={matilda} />
            <Layout.Content className="matilda-container__content matilda-container__content--authentication">
              {children}
            </Layout.Content>
            <MatildaContainerFooter matilda={matilda} />
          </Layout>      
        </ConfigProvider>
      </MatildaProvider>
    )
  }

  //////////////////////////////////////////////////////////

  return (
    <MatildaProvider matilda={matilda}>
      <ConfigProvider locale={antdLocale}>
        <Layout className="matilda-container">
          <MatildaContainerHeader matilda={matilda} />
          <Layout>
            <MatildaContainerSidebar matilda={matilda} sidebarCollapsedValue={sidebarCollapsed} onSidebarCollapsedChange={onSidebarCollapsedChange} />
            <Layout>
              <Layout.Content className={`matilda-container__content matilda-container__content--sidebar ${sidebarCollapsed ? 'matilda-container__content--sidebar-collapsed' : ''}`}>
                {children}
              </Layout.Content>
              <MatildaContainerFooter matilda={matilda} />
            </Layout>
          </Layout>
        </Layout>      
      </ConfigProvider>
    </MatildaProvider>
  )
}

MatildaContainer.propTypes = {
  matilda: PropTypes.object,
  layout: PropTypes.oneOf(['authentication']),
  children: PropTypes.any
}
