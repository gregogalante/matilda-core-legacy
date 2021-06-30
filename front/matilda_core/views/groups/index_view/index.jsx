import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import IndexPage from './index_page'

export default (props) => {
  const layout = useMatildaLayout()

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <IndexPage />
      </MatildaLayout>
    </MatildaContainer>
  )
}
