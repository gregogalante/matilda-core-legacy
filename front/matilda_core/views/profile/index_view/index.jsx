import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import { MatildaPages, useMatildaPages } from 'matilda_core/components/MatildaPages'
import IndexPage from './index_page'
import EmailsPage from './emails_page'
import CredentialsPage from './credentials_page'
import AddEmailDrawer from './add_email_drawer'

export default (props) => {
  const layout = useMatildaLayout()
  const pages = useMatildaPages([
    {
      key: 'profile_index',
      label: 'titles.profile_manage',
      pages: [
        {
          key: 'profile_index_index_page',
          component: IndexPage,
          drawers: []
        },
      ]
    },
    {
      key: 'profile_emails',
      label: 'titles.profile_emails_manage',
      pages: [{
        key: 'profile_index_emails_page',
        component: EmailsPage,
        drawers: [
          {
            key: 'profile_index_emails_page_add_email',
            label: 'titles.add_email_address',
            component: AddEmailDrawer,
            size: 'medium'
          }
        ]
      }],
    },
    {
      key: 'profile_credentials',
      label: 'titles.profile_credentials_manage',
      pages: [{
        key: 'profile_index_credentials_page',
        component: CredentialsPage,
        drawers: []
      }],
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
