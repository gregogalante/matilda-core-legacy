import React, { useContext } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import { MatildaPagesWrapper } from 'matilda_core/components/MatildaPages'

export default function IndexPage (props) {
  const { pages } = props
  const { getTranslation } = useContext(MatildaContext)

  const onClickInvite = () => {
    pages.openDrawer('users_index_index_page_invite_drawer')
  }

  return (
    <MatildaPagesWrapper
      pages={pages}
      extra={[
        <Button
          key='invite'
          type="primary"
          icon={<PlusCircleOutlined />}
          onClick={onClickInvite}
        >{getTranslation('matilda_core.cta.invite')}</Button>
      ]}
    >
      INDEX CONTENT
    </MatildaPagesWrapper>
  )
}