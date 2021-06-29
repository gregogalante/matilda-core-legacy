import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import LoginView from './login_view'

export default (props) => {
  const layout = useMatildaLayout({ theme: 'clean' })

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <LoginView />
      </MatildaLayout>
    </MatildaContainer>
  )
}
