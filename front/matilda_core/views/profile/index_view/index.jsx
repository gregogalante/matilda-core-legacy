import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import { MatildaPages, useMatildaPages } from 'matilda_core/components/MatildaPages'
import IndexPage from './pages/IndexPage'
import EmailsPage from './pages/EmailsPage'
import CredentialsPage from './pages/CredentialsPage'
import AddEmailDrawer from './drawers/AddEmailDrawer'

export default (props) => {
  const layout = useMatildaLayout()
  const pages = useMatildaPages([
    {
      key: 'profile_index',
      label: 'titles.profile_manage',
      pages: [
        {
          key: 'profile_index_index_page',
          label: 'titles.profile_manage',
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
        label: 'titles.profile_emails_manage',
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
        label: 'titles.profile_credentials_manage',
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
