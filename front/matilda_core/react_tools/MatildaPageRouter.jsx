import React, { useContext, useState } from 'react'
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
  const [currentRoute, setCurrentRoute] = useState([0])
  const { view } = useContext(MatildaContext)
  const { t } = useMatildaTranslator()

  const renderRoutes = (routes, prefix = '') => {
    return (
      <>
        {routes.map((route, index) => {
          const key = `${prefix}_${index}`
          if (route.subPages) return renderRouteSubmenu(route, key)

          return <Menu.Item key={key}>{t(route.label)}</Menu.Item>
        })}
      </>
    )
  }

  const renderRouteSubmenu = (route, index) => {
    return (
      <Menu.SubMenu key={index} title={t(route.label)}>
        {renderRoutes(route.subPages, index)}
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
        {(routes.length > 1 || routes[0]?.subPages) && (
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
          {routes[currentRoute[0]].component}
        </Layout.Content>
      </Layout>
    </div>
  )
}

MatildaPageRouter.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.any,
    label: PropTypes.string,
    subPages: PropTypes.array,
    internalPages: PropTypes.array
  }))
}

MatildaPageRouter.defaultProps = {
  routes: []
}
