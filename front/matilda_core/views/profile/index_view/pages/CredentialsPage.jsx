import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Form, Input, notification, Space } from 'antd'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { useMatildaRequest } from 'matilda_core/components/MatildaRequest'

export default function CredentialsPage (props) {
  const { navigator } = props
  const request = useMatildaRequest()
  const { getTranslation } = useContext(MatildaContext)
  
  const form = useMatildaForm('matilda_core.profile_edit_password_action', {}, { manageSuccess: false })
  useEffect(() => {
    if (form.response && form.response.result) {
      form.antdForm.resetFields()
      notification.open({
        message: getTranslation('messages.password_update_success'),
        duration: 4,
        icon: <CheckCircleTwoTone />
      })
    }
  }, [form.response])

  const formUsername = useMatildaForm('matilda_core.profile_edit_username_action', {}, { manageSuccess: false })
  useEffect(() => {
    if (formUsername.response && formUsername.response.result) {
      indexApi()
      notification.open({
        message: getTranslation('messages.username_update_success'),
        duration: 4,
        icon: <CheckCircleTwoTone />
      })
    }
  }, [formUsername.response])

  const [user, setUser] = useState(null)
  const indexApi = () => {
    request.send('matilda_core.profile_index_api', {}).then((response) => {
      if (!response.result) return
      setUser(response.payload.user)
    })
  }
  useEffect(() => {
    indexApi()
  }, [])
  useEffect(() => {
    if(user){
      formUsername.antdForm.setFieldsValue({
        username: user.username
      })
    }
  }, [user])

  return (
    <NavigatorWrapperComponent navigator={navigator}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card 
          title={getTranslation("titles.update_password")}
        >
          <MatildaForm form={form}>
            <Form.Item
              name="password_old"
              label={getTranslation("labels.current_password")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation("labels.new_password")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label={getTranslation("labels.new_password_confirmation")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
    
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" >
                {getTranslation('cta.update')}
              </Button>
            </Form.Item>
          </MatildaForm>
        </Card>

        <Card 
          title={getTranslation("titles.username")}
        >
          <MatildaForm form={formUsername}>
            <Form.Item
              name="username"
              label={getTranslation("labels.username")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
    
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" >
                {getTranslation('cta.update')}
              </Button>
            </Form.Item>
          </MatildaForm>
        </Card>
      </Space>
    </NavigatorWrapperComponent>
  )
}