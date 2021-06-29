import React, { useContext } from 'react'
import { Row, Col, Card, Form, Button, Input } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function LoginView () {
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const form = useMatildaForm()
  const signupActive = getConfig('authentication_permit_signup')

  return (
    <Row justify="center" align="center">
      <Col xs={{ span: 24 }} sm={{ span: 16 }} md={{ span: 12 }} lg={{ span: 8 }}>
        <Card title={getTranslation('matilda_core.titles.login')}>
          <MatildaForm form={form}>
            <Form.Item
              name="username_email"
              label={getTranslation('matilda_core.labels.username_or_email')}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={getTranslation('matilda_core.helps.insert_username_or_email')}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation('matilda_core.labels.password')}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={getTranslation('matilda_core.helps.insert_password')}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" block>
                {getTranslation('matilda_core.cta.login')}
              </Button>
              {signupActive && (
                <div style={{ marginTop: 15 }}>
                  <a href="#">{getTranslation('matilda_core.cta.signup')}</a> | <a href="#">{getTranslation('matilda_core.cta.recover_password')}</a>
                </div>
              )}
            </Form.Item>
          </MatildaForm>
        </Card>
      </Col>
    </Row>
  )
}