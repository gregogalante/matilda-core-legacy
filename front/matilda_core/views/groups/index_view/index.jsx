import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import IndexPage from './pages/IndexPage'

export default (props) => {
  const layout = useMatildaLayout({ siderActiveKey: 'matilda_core.groups' })

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <IndexPage />
      </MatildaLayout>
    </MatildaContainer>
  )
}
