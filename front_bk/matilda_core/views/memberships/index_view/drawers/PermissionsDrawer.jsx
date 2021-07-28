import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Form, Input, Button, Alert, Space, Card, Select, Checkbox } from 'antd'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function PermissionsDrawer (props) {
  const { pages } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const userPermissions = props.membership.permissions
  const userUuid = props.user.uuid
  // const [checked, setChecked] = useState(userPermissions || [])
  const form = useMatildaForm('matilda_core.memberships_edit_permissions_action', {user_uuid: userUuid, permissions: userPermissions}, { manageSuccess: false })

  useEffect(() => {
    if (form.response && form.response.result) {
      // pages.closeDrawer()
      props.onComplete()
      // window.location.reload()
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

  const onCheckChange = (e) => {
    // if (checked.includes(e.target.id)){
    //   setChecked(checked.filter(item => item !== e.target.id))
    // } else {
    //   setChecked(lastChecked => [...lastChecked, e.target.id])
    // }
    
    if (form.extraParams.permissions.includes(e.target.id)){
      form.setExtraParams({
        user_uuid: userUuid,
        permissions: form.extraParams.permissions.filter(item => item !== e.target.id)
      })
    } else {
      form.setExtraParams({
        user_uuid: userUuid,
        permissions: [...form.extraParams.permissions, e.target.id]
      })
    }
  }

  return (
    <Space direction="vertical" size='large' style={{ width: '100%' }}>
      <Card title={getTranslation("titles.edit_permissions")}>
        <MatildaForm form={form}>
          {permissions && permissions.map(permission => {
            return (
              <Form.Item 
                key={permission.name}
                name={permission.name}
              >
                <Checkbox checked={form.extraParams.permissions.includes(permission.name)} onChange={onCheckChange}>{getTranslation(permission.label)}</Checkbox>
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