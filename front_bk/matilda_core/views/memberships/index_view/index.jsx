import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import { MatildaPages, useMatildaPages } from 'matilda_core/components/MatildaPages'
import IndexPage from './pages/IndexPage'
import ManagePage from './pages/ManagePage'
import InviteDrawer from './drawers/InviteDrawer'
import PermissionsDrawer from './drawers/PermissionsDrawer'

export default (props) => {
  const layout = useMatildaLayout({ siderActiveKey: 'matilda_core.memberships' })
  const pages = useMatildaPages([
    {
      key: 'users_index',
      label: 'titles.users_list',
      pages: [
        {
          key: 'users_index_index_page',
          label: 'titles.users_list',
          component: IndexPage,
          drawers: [
            {
              key: 'users_index_index_page_invite_drawer',
              label: 'titles.invite_user',
              component: InviteDrawer,
              size: 'medium'
            }
          ]
        },
        {
          key: 'users_index_manage_page',
          label: 'titles.manage_user',
          component: ManagePage,
          drawers: [
            {
              key: 'users_index_manage_page_role_advanced',
              label: 'titles.edit_permissions',
              component: PermissionsDrawer,
              size: 'medium'
            }
          ]
        },
      ]
    }
  ])

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <MatildaPages pages={pages} />
      </MatildaLayout>
    </MatildaContainer>
  )
}
