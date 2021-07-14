import React from 'react'
import { MatildaContainer } from 'matilda_core'
import { MatildaLayout, useMatildaLayout } from 'matilda_core/components/MatildaLayout'
import SelectPage from './select_page'

export default (props) => {
  const layout = useMatildaLayout({ theme: 'clean-centered' })

  return (
    <MatildaContainer {...props}>
      <MatildaLayout layout={layout}>
        <SelectPage {...props} />
      </MatildaLayout>
    </MatildaContainer>
  )
}
