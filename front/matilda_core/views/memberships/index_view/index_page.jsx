import React, { useContext } from 'react'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import { MatildaPagesWrapper } from 'matilda_core/components/MatildaPages'
import { MatildaTable, useMatildaTable } from 'matilda_core/components/MatildaTable'

export default function IndexPage (props) {
  const { pages } = props
  const { getTranslation } = useContext(MatildaContext)

  const tableColumns = [
    {
      key: 'username',
      dataIndex: 'username',
      title: getTranslation('labels.username'),
      sorter: true,
    },
    {
      key: 'surname',
      dataIndex: 'surname',
      title: getTranslation('labels.surname'),
      responsive: ['md'],
      sorter: true,
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: getTranslation('labels.name'),
      responsive: ['md'],
      sorter: true,
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: getTranslation('labels.email'),
      sorter: true,
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'uuid',
      width: 150,
      fixed: 'right',
      render: (userUuid) => {
        return (
          <Button type="primary" onClick={() => onGoToManageUser(userUuid)} ghost block>{getTranslation('cta.manage')}</Button>
        )
      }
    }
  ]

  const table = useMatildaTable({
    columns: tableColumns,
    route: 'matilda_core.memberships_index_api',
    pagination: true,
    checkbox: true,
    routeDataParser: (response) => response.payload.users.map((user) => ({ key: user.uuid, uuid: user.uuid, email: user.email, username: user.username, surname: user.surname, name: user.name }))
  })

  const onClickInvite = () => {
    pages.openDrawer('users_index_index_page_invite_drawer', { onCompleted: () => { table.loadData(); pages.closeDrawer() } })
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
        >{getTranslation('cta.invite')}</Button>
      ]}
    >
      <MatildaTable table={table} />
    </MatildaPagesWrapper>
  )
}