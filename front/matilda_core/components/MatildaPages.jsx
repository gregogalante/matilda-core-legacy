/**
 * NOTE: Deprecated
 */

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

          return <Menu.Item key={route.key} onClick={() => pages.goToRoute(route.key)}>{getTranslation(route.label)}</Menu.Item>
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
          <div key={pages.currentRute?.key}>
            <pages.currentPage.component {...pages.currentPageData.props} key={pages.currentPage.key} pages={pages} />
          </div>
        </Layout.Content>
      </Layout>

      <Drawer
        title={getTranslation(pages.currentDrawer?.label)}
        placement="right"
        closable={true}
        onClose={() => pages.closeDrawer()}
        visible={!!pages.currentDrawer}
        width={drawerWidth}
      >
        {pages.currentDrawer && <pages.currentDrawer.component {...pages.currentDrawerData?.props} pages={pages} />}
      </Drawer>
    </>
  )
}

/***************************************************************************************************** */

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
  const { prevPageKey } = pages.currentPageData

  return (
    <PageHeader
      title={title}
      extra={extra}
      onBack={prevPageKey ? () => pages.goToPage(prevPageKey, {}, true) : null}
    >
      {props.children}
    </PageHeader>
  )
}
MatildaPagesWrapper.defaultProps = {
  extra: []
}

/***************************************************************************************************** */

/**
 * @function useMatildaPages
 * @param {*} routesProps
 */
export function useMatildaPages (routesProps = [], defaultProps = {}) {
  const [currentPageData, setCurrentPageData] = useState({ routeKey: routesProps[0].key, pageKey: null, prevPageKey: null, props: defaultProps })
  const [currentDrawerData, setCurrentDrawerData] = useState(null)
  const [routes, setRoutes] = useState(routesProps)

  // identifico la route corrente
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

  // identifico la page corrente
  const currentPage = useMemo(() => {
    const currentPage = currentRoute.pages.filter((p) => p.key == currentPageData.pageKey)[0]
    return currentPage || currentRoute.pages[0]
  }, [currentPageData, routesProps])

  const currentDrawer = useMemo(() => {
    if (!currentDrawerData || !currentPage.drawers) return

    return currentPage.drawers.filter((d) => d.key == currentDrawerData.key)[0]
  }, [currentDrawerData, routesProps])

  /**
   * @function goToRoute
   * @param {*} routeKey 
   * @param {*} props 
   */
  const goToRoute = (routeKey, props = {}) => {
    setCurrentPageData({ routeKey: routeKey, pageKey: null, props: Object.assign({}, defaultProps, props) })
    setCurrentDrawerData(null)
  }

  /**
   * @function goToPage
   * @param {*} pageKey
   * @param {*} props 
   * @param {boolean} reset
   */
  const goToPage = (pageKey, props = {}, reset = false) => {
    setCurrentPageData({ routeKey: currentPageData.routeKey, pageKey: pageKey, prevPageKey: reset ? null : currentPage.key, props: Object.assign({}, defaultProps, props) })
    setCurrentDrawerData(null)
  }

  /**
   * @function openDrawer
   * @param {*} drawerKey 
   * @param {*} props 
   */
  const openDrawer = (drawerKey, props = {}) => {
    setCurrentDrawerData({ key: drawerKey, props: Object.assign({}, defaultProps, props) })
  }

  /**
   * @function closeDrawer
   */
  const closeDrawer = () => {
    setCurrentDrawerData(null)
  }

  /**
   * @function addRoutes
   * @param {*} newRoutes 
   */
  const addRoutes = (newRoutes) => {
    setRoutes(routes.concat(newRoutes))
  }

  return { routes, currentRoute, currentPage, currentPageData, currentDrawer, currentDrawerData, goToRoute, goToPage, openDrawer, closeDrawer, addRoutes }
}
