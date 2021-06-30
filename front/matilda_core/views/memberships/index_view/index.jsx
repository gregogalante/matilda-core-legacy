import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import { MatildaPages, useMatildaPages } from 'matilda_core/components/MatildaPages'
import IndexPage from './index_page'
import ManagePage from './manage_page'
import InviteDrawer from './invite_drawer'

export default (props) => {
  const layout = useMatildaLayout({ siderActiveKey: 'matilda_core.memberships' })
  const pages = useMatildaPages([
    {
      key: 'users_index',
      label: 'matilda_core.titles.users_list',
      pages: [
        {
          key: 'users_index_index_page',
          label: 'matilda_core.titles.users_list',
          component: IndexPage,
          drawers: [
            {
              key: 'users_index_index_page_invite_drawer',
              label: 'matilda_core.titles.invite_user',
              component: InviteDrawer,
              size: 'medium'
            }
          ]
        },
        {
          key: 'users_index_manage_page',
          label: 'matilda_core.titles.manage_user',
          component: ManagePage
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
