import React from 'react'
import { MatildaContainer } from 'matilda_core/Matilda'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'

export default (props) => {
  const layout = useMatildaLayout({ theme: 'clean' })

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        DEMO
      </MatildaLayout>
    </MatildaContainer>
  )
}
