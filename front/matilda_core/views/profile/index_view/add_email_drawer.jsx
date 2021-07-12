import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Form, Input, Button, Alert, Space, Card, Select, Checkbox } from 'antd'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function AddEmailDrawer (props) {
  const { pages } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const form = useMatildaForm('matilda_core.profile_create_email_action', {}, { manageSuccess: false })

  console.log(props)
  useEffect(() => {
    if (form.response && form.response.result) {
      props.onComplete()
    }
  }, [form.response])


  return (
    <Space direction="vertical" size='large' style={{ width: '100%' }}>
      <Card title={getTranslation("titles.add_email_address")}>
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