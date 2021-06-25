import React, { useContext, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Layout, Menu } from 'antd'
import { MatildaContext, useMatildaTranslator } from 'matilda_core/react_tools'


/**
 * @function MatildaPageRouter
 * @param {*} props 
 * @returns 
 */
export function MatildaPageRouter (props) {
  const { routes } = props
  const [currentRouteIdentifier, setCurrentRouteIdentifier] = useState([0])
  const [currentPageIdentifier, setCurrentPageIdentifier] = useState(0)
  const { view } = useContext(MatildaContext)
  const { t } = useMatildaTranslator()

  //////////////////////////////////////////////////////////

  const CurrentComponent = useMemo(() => {
    const findCurrentRoute = (routes, index) => currentRouteIdentifier[index + 1] ? findCurrentRoute(routes[index].routes, index + 1) : routes[index]
    const findRouteComponent = (route) => route.component || (route.routes ? findRouteComponent(route.routes[0]) : () => null)
    const currentRoute = findCurrentRoute(routes, 0)

    return currentRoute.component || findRouteComponent(currentRoute)
  }, [currentRouteIdentifier, currentPageIdentifier])

  //////////////////////////////////////////////////////////

  const renderRoutes = (routes, prefix = '') => {
    return (
      <>
        {routes.map((route, index) => {
          const key = `${prefix}_${index}`
          if (route.routes) return renderRouteSubmenu(route, key)

          return <Menu.Item key={key}>{t(route.label)}</Menu.Item>
        })}
      </>
    )
  }

  const renderRouteSubmenu = (route, index) => {
    return (
      <Menu.SubMenu key={index} title={t(route.label)}>
        {renderRoutes(route.routes, index)}
      </Menu.SubMenu>
    )
  }

  return (
    <div className="matilda-page-router">
      {view?.section_head?.breadcrumbs && (
        <Breadcrumb className="matilda-page-router__breadcrumb">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          {view.section_head.breadcrumbs.map((breadcrumb, index) => <Breadcrumb.Item key={index}>{breadcrumb.label}</Breadcrumb.Item>)}
        </Breadcrumb>
      )}
      <Layout className="matilda-page-router__main">
        {(routes.length > 1 || routes[0]?.routes) && (
           <Layout.Sider width={200}>
            <Menu
              mode="inline"
              className="matilda-page-router__main-menu"
            >
              {renderRoutes(routes)}
            </Menu>
          </Layout.Sider>
        )}
        <Layout.Content className="matilda-page-router__main-content">
          <CurrentComponent />
        </Layout.Content>
      </Layout>
    </div>
  )
}

MatildaPageRouter.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.func,
    label: PropTypes.string,
    routes: PropTypes.array,
    pages: PropTypes.array
  }))
}

MatildaPageRouter.defaultProps = {
  routes: []
}
