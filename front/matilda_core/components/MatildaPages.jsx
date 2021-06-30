import React, { useMemo, useState, useContext } from 'react'
import { Layout, Menu, Drawer, PageHeader } from 'antd'
import { MatildaContext } from '../index'

/**
 * @function MatildaPages
 * @param {*} props
 */
export function MatildaPages (props) {
  const { pages } = props
  const { getTranslation, responsive: { isDesktop } } = useContext(MatildaContext)

  const drawerWidth = useMemo(() => {
    const drawerSizesMap = { large: 768, medium: 568, small: 368 }
    if (!isDesktop) return '100%'

    return drawerSizesMap[pages.currentDrawer?.size] || drawerSizesMap.medium
  }, [pages.currentDrawer, isDesktop])

  const onSelectRoute = (routeKey) => {
    pages.goToRoute(routeKey)
  }

  const onCloseDrawer = () => {
    pages.closeDrawer()
  }

  const SiderContainer = isDesktop ? ({ children }) => <Layout.Sider width={200} theme="light">{children}</Layout.Sider> : ({ children }) => <div>{children}</div>

  const renderRoutes = (routes) => {
    const renderRouteSubmenu = (route) => {
      return (
        <Menu.SubMenu key={route.key} title={getTranslation(route.label)}>
          {renderRoutes(route.routes)}
        </Menu.SubMenu>
      )
    }

    return (
      <>
        {routes.map((route) => {
          if (route.routes) return renderRouteSubmenu(route, key)

          return <Menu.Item key={route.key} onClick={() => onSelectRoute(route.key)}>{getTranslation(route.label)}</Menu.Item>
        })}
      </>
    )
  }

  return (
    <>
      <Layout style={{ backgroundColor: '#fff' }}>
        {pages.routes.length > 0 && (
          <SiderContainer>
            <Menu
              mode={isDesktop ? 'inline' : 'horizontal'}
              selectedKeys={[pages.currentPageData.routeKey]}
              style={{ height: '100%' }}
            >
              {renderRoutes(pages.routes)}
            </Menu>
          </SiderContainer>
        )}
        <Layout.Content>
          <pages.currentPage.component {...pages.currentPageData.props} pages={pages} />
        </Layout.Content>
      </Layout>

      <Drawer
        title={getTranslation(pages.currentDrawer?.label)}
        placement="right"
        closable={true}
        onClose={onCloseDrawer}
        visible={!!pages.currentDrawer}
        width={drawerWidth}
      >
        {pages.currentDrawer && <pages.currentDrawer.component {...pages.currentDrawer?.props} pages={pages} />}
      </Drawer>
    </>
  )
}

/**
 * @function MatildaPagesWrapper
 * @param {*} props
 * @returns 
 */
export function MatildaPagesWrapper (props) {
  const { pages, extra } = props
  if (!pages) return null

  const { getTranslation } = useContext(MatildaContext)
  const title = getTranslation(pages.currentPage.label)
  const hasBack = !!pages.currentPage.backKey

  const onClickBack = () => {
    console.log('TODO: Back')
  }

  return (
    <PageHeader
      title={title}
      extra={extra}
      onBack={hasBack ? onClickBack : null}
    >
      {props.children}
    </PageHeader>
  )
}
MatildaPagesWrapper.defaultProps = {
  extra: []
}

/**
 * @function useMatildaPages
 * @param {*} routesProps
 */
export function useMatildaPages (routesProps = []) {
  const [currentPageData, setCurrentPageData] = useState({ routeKey: routesProps[0].key, pageKey: null, props: {} })
  const [currentDrawerData, setCurrentDrawerData] = useState(null)

  const routes = useMemo(() => {
    const setRouteBackKey = (route, prevKey = null) => {
      route.backKey = prevKey

      if (route.pages) route.pages = route.pages.map((p) => setRouteBackKey(p, route.key))
      if (route.routes) route.routes = route.routes.map((p) => setRouteBackKey(p, route.key))

      return route
    }
    return routesProps.map((r) => setRouteBackKey(r))
  }, [routesProps])

  const currentRoute = useMemo(() => {
    const findCurrentRoute = (routes) => {
      let currentRoute = null

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        if (route.key == currentPageData.routeKey) {
          currentRoute = route
          break
        }

        if (route.routes) {
          currentRoute = findCurrentRoute(route.routes)
          if (currentRoute) break
        }
      }

      return currentRoute
    }

    return findCurrentRoute(routes)
  }, [currentPageData, routesProps])

  const currentPage = useMemo(() => {
    const currentPage = currentRoute.pages.filter((p) => p.key == currentPageData.key)[0]
    return currentPage || currentRoute.pages[0]
  }, [currentPageData, routesProps])

  const currentDrawer = useMemo(() => {
    if (!currentDrawerData || !currentPage.drawers) return

    return currentPage.drawers.filter((d) => d.key == currentDrawerData.key)[0]
  }, [currentDrawerData, routesProps])

  const goToRoute = (routeKey, props = {}) => {
    setCurrentPageData({ routeKey: routeKey, pageKey: null, props })
    setCurrentDrawerData(null)
  }

  const goToPage = (pageKey, props = {}) => {
    setCurrentPageData({ routeKey: currentPageData.routeKey, pageKey: pageKey, props })
    setCurrentDrawerData(null)
  }

  const openDrawer = (drawerKey, params = {}) => {
    setCurrentDrawerData({ key: drawerKey, params })
  }

  const closeDrawer = () => {
    setCurrentDrawerData(null)
  }

  return { routes, currentRoute, currentPage, currentPageData, currentDrawer, currentDrawerData, goToRoute, goToPage, openDrawer, closeDrawer }
}
