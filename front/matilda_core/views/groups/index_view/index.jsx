import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import IndexView from './index_view'

export default (props) => {
  const layout = useMatildaLayout()

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <IndexView />
      </MatildaLayout>
    </MatildaContainer>
  )
}
