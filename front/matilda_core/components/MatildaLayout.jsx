import React, { useMemo, useContext, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import * as Icons from '@ant-design/icons'
import { MatildaContext } from '../Matilda'
import { useMatildaRequest } from './MatildaRequest'

/**
 * @function MatildaLayout
 * @param {*} props 
 * @returns 
 */
export function MatildaLayout (props) {
  const { layout: { config } } = props
  const { responsive: { isMobile } } = useContext(MatildaContext)

  const showSider = useMemo(() => {
    return isMobile || config.theme != 'clean'
  }, [config.theme, isMobile])

  return (
    <Layout>
      <Header />

      <Layout>
        {showSider && <Sider />}
        <Layout.Content style={{ minHeight: '100vh', padding: 15, paddingTop: 80, paddingLeft: 15 }}>
          {props.children}
        </Layout.Content>
      </Layout>

      <Footer />
    </Layout>
  )
}

/**
 * @function useMatildaLayout
 * @param {*} configProps 
 * @returns 
 */
export function useMatildaLayout (configProps = {}) {
  const config = useMemo(() => {
    return Object.assign({
      theme: 'default'
    }, configProps)
  }, [configProps])

  return { config }
}

/****************************************************************************************************************** */

function Header () {
  const { getConfig, responsive: { isMobile } } = useContext(MatildaContext)
  const logo = getConfig('global_logo')
  const title = getConfig('global_title')

  return (
    <Layout.Header style={{ position: 'fixed', zIndex: 999, width: '100%' }}>
      <div style={{ float: 'left', color: '#fff', textTransform: 'uppercase', fontWeight: 20 }}>
        {logo ? (
          <img src={logo} alt={title} title={title} style={{ height: height - 30 }} />
        ) : (
          <span>{title}</span>
        )}
      </div>
      <div style={{ float: 'right' }}>
        {isMobile ? <MenuMobile /> : <MenuSecondary />}
      </div>
    </Layout.Header>
  )
}

function Footer () {
  const { getConfig } = useContext(MatildaContext)
  const footer = getConfig('global_footer')

  return (
    <Layout.Footer style={{ textAlign: 'center' }}>{footer}</Layout.Footer>
  )
}

function Sider () {
  return (
    <Layout.Sider
      collapsible
      defaultCollapsed
      theme='dark'
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <MenuPrimary />
      </div>
    </Layout.Sider>
  )
}

/****************************************************************************************************************** */

function MenuPrimary () {
  const { getConfig, getTranslation, getSession } = useContext(MatildaContext)
  const session = getSession()

  const sidebarItems = useMemo(() => {
    let items = []
    if (session) {
      // filter permissions
      items = getConfig('sidebar_items').filter((i) => !i.permission || (session.group_permissions && session.group_permissions.includes(i.permission)))
      // order by index
      items = items.sort((a, b) => a.index - b.index)
      // update labels
      items = items.map((i) => { if (i.label.startsWith('locale.')) { i.label = getTranslation(i.label.replace('locale.', '')) } return i })
    }

    return items
  }, [session])

  return (
    <Menu theme="dark" mode="vertical" selectedKeys={[]}>
      {sidebarItems.map((sidebarItem) => {
        const IconItem = sidebarItem.icon ? Icons[sidebarItem.icon] : null
        return (
          <Menu.Item key={sidebarItem.name} icon={IconItem ? <IconItem /> : null} onClick={() => {}}>
            {sidebarItem.label}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

function MenuSecondary () {
  const { getSession, getTranslation, getAvailableLocales, responsive: { isMobile } } = useContext(MatildaContext)
  const session = getSession()
  const availableLocales = getAvailableLocales()
  const request = useMatildaRequest()

  const onChangeLocale = (newLocale) => {
    request.send('matilda_core.helper_update_session_locale', { locale: newLocale }).then(({ result }) => {
      if (!result) return
      window.location.reload()
    })
  }

  return (
    <Menu theme="dark" mode={isMobile ? "inline" : "horizontal"}>
      {session?.user_uuid && (
        <Menu.SubMenu
          key="profile"
          icon={<Icons.UserOutlined />}
          title={getTranslation('matilda_core.header.profile')}
        >
          <Menu.Item
            key={"profile_account_settings"}
          >{getTranslation('matilda_core.header.account_settings')}</Menu.Item>
          <Menu.Item
            key={"profile_groups"}
          >{getTranslation('matilda_core.header.groups')}</Menu.Item>
          <Menu.Item
            key={"profile_logout"}
          >{getTranslation('matilda_core.header.logout')}</Menu.Item>
        </Menu.SubMenu>
      )}
      <Menu.SubMenu
        key="language"
        icon={<Icons.FlagOutlined />}
        title={getTranslation('matilda_core.header.lang')}
      >
        {availableLocales.map((availableLocale) => {
          return (
            <Menu.Item
              key={availableLocale}
              onClick={() => onChangeLocale(availableLocale)}
            >{availableLocale.toUpperCase()}</Menu.Item>
          )
        })}
      </Menu.SubMenu>
    </Menu>
  )
}

function MenuMobile () {
  return (
    <Menu theme="dark" mode="horizontal">
      <Menu.Item
        key={"menu_mobile_toggle"}
        icon={<Icons.MenuOutlined />}
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        title={'Menu'}
      >Menu</Menu.Item>
    </Menu>
  )
}