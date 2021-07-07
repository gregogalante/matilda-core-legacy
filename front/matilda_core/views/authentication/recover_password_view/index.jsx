import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import RecoverPasswordPage from './recover_password_page'

export default (props) => {
  const layout = useMatildaLayout({ theme: 'clean-centered' })

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <RecoverPasswordPage />
      </MatildaLayout>
    </MatildaContainer>
  )
}
