import React from 'react'
import { Card, Form, Input, Button, Checkbox, Alert } from 'antd'
import { MatildaContainer, useMatilda } from 'matilda_core'

export default function LoginView(props) {
  const { I18n, Requests, containerProps } = useMatilda(props.matilda)

  //////////////////////////////////////////////////////////

  const onFinishLogin = (values) => {
    Requests.post('/matilda/core/authentication/login-action', values).then((response) => {
      console.log(response)
    }).catch((err) => {
      console.log(err)
    })
  }

  //////////////////////////////////////////////////////////

  return (
    <MatildaContainer props={containerProps}>
      <div className="LoginView" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh', background: '#eee' }}>
        <Card title={I18n.t('matilda_core.titles.login')} style={{ width: '100%', maxWidth: 500 }}>
          <Form
            name="login"
            layout='vertical'
            onFinish={onFinishLogin}
          >
            <Form.Item
              label={I18n.t('matilda_core.labels.username_or_email')}
              name="username_email"
              rules={[{ required: true, message: I18n.t('matilda_core.messages.username_email_not_valid') }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={I18n.t('matilda_core.labels.password')}
              name="password"
              rules={[{ required: true, message: I18n.t('matilda_core.messages.password_not_valid') }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                {I18n.t('matilda_core.cta.login')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </MatildaContainer>
  )
}