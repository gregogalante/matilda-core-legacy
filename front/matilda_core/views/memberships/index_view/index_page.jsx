import React, { useContext } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import { MatildaPagesWrapper } from 'matilda_core/components/MatildaPages'
import { MatildaTable, useMatildaTable } from 'matilda_core/components/MatildaTable'
import { useMatildaRequest } from '../../../components/MatildaRequest'

export default function IndexPage (props) {
  const { pages } = props
  const { getTranslation } = useContext(MatildaContext)
  const request = useMatildaRequest()

  const tableColumns = [
    {
      key: 'username',
      dataIndex: 'username',
      title: getTranslation('matilda_core.labels.username'),
      sorter: true,
    },
    {
      key: 'surname',
      dataIndex: 'surname',
      title: getTranslation('matilda_core.labels.surname'),
      responsive: ['md'],
      sorter: true,
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: getTranslation('matilda_core.labels.name'),
      responsive: ['md'],
      sorter: true,
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: getTranslation('matilda_core.labels.email'),
      sorter: true,
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'uuid',
      width: 100,
      render: (userUuid) => {
        return (
          <Button onClick={() => onGoToManageUser(userUuid)}>{getTranslation('matilda_core.cta.manage')}</Button>
        )
      }
    }
  ]
  const table = useMatildaTable({
    columns: tableColumns,
    route: 'matilda_core.memberships_index_api',
    pagination: true,
    routeDataParser: (response) => response.payload.users.map((user) => ({ key: user.uuid, uuid: user.uuid, email: user.email, username: user.username, surname: user.surname, name: user.name }))
  })

  const onClickInvite = () => {
    pages.openDrawer('users_index_index_page_invite_drawer')
  }

  const onGoToManageUser = (userUuid) => {
    pages.goToPage('users_index_manage_page', { userUuid })
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
      <MatildaTable table={table} />
    </MatildaPagesWrapper>
  )
}