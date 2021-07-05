import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Form, Input, Button, Alert, Space, Card, Select, Checkbox } from 'antd'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function PermissionsDrawer (props) {
  const { pages } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const form = useMatildaForm('matilda_core.memberships_edit_permissions_action', {user_uuid: props.user.uuid}, { manageSuccess: false })
  const { Option } = Select

  useEffect(() => {
    if (form.response && form.response.result) {
      pages.closeDrawer()
    }
  }, [form.response])

  const membershipsPermissions = getConfig('memberships_permissions')
  const permissions = useMemo(() => {
    let items = []
    if (membershipsPermissions) {
      items = membershipsPermissions
      items = items.map((i) => {
        if(i.label.startsWith('locale.')){
          i.label = getTranslation(i.label.replace('locale.matilda_core.', ''))
        }
        if(i.group.startsWith('locale.')){
          i.group = getTranslation(i.group.replace('locale.matilda_core.', ''))
        }
        return i
      })
    }
    return items
  }, [membershipsPermissions])

  const userPermissions = props.membership.permissions

  console.log(props)

  // const [isChecked, setIsChecked] = useState(null)
  // let isChecked = []
  // userPermissions.map(p => isChecked.push(p))
  const isChecked = useMemo(() => {
    let permissions = []
    if(userPermissions){
      userPermissions.map(p => permissions.push(p))
    }
    return permissions
  }, [userPermissions])
  console.log(isChecked)

  const onCheckChange = (e) => {
    console.log(e.target)
    if (isChecked.includes(e.target.id)){
      isChecked.filter(item => item !== e.target.id)
    } else {
      isChecked.push(e.target.id)
    }
  }

  return (
    <Space direction="vertical" size='large' style={{ width: '100%' }}>
      {/* <Alert
        message={getTranslation('helps.invitation_user_guide')}
        type="info"
      /> */}

      <Card title={getTranslation("titles.edit_permissions")}>
        <MatildaForm form={form}>
          {permissions && permissions.map(permission => {
            return (
              <Form.Item 
                key={permission.name}
                name={permission.name}
              >
                <Checkbox checked={isChecked.includes(permission.name)} onChange={onCheckChange}>{getTranslation(permission.label)}</Checkbox>
              </Form.Item>
            )
          })}
  
          <Form.Item style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" block>
              {getTranslation('cta.confirm')}
            </Button>
          </Form.Item>
        </MatildaForm>
      </Card>
    </Space>
  )
}