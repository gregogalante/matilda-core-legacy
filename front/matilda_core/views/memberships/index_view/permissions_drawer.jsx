import React, { useContext, useEffect } from 'react'
import { Form, Input, Button, Alert, Space, Card } from 'antd'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function PermissionsDrawer (props) {
  const { pages } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const form = useMatildaForm('matilda_core.memberships_edit_permissions_action', {}, { manageSuccess: false })

  useEffect(() => {
    if (form.response && form.response.result) {
      pages.closeDrawer()
    }
  }, [form.response])


  // const permissions = getConfig('memberships_permissions')

  return (
    <Space direction="vertical" size='large' style={{ width: '100%' }}>
      {/* <Alert
        message={getTranslation('helps.invitation_user_guide')}
        type="info"
      /> */}

      <Card title={getTranslation("matilda_core.titles.edit_permissions")}>
        <MatildaForm form={form}>

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