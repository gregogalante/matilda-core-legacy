import React, { useContext, useEffect } from 'react'
import { Row, Col, Card, Form, Button, Input } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function LoginPage () {
  const { getTranslation, getConfig, getRoute } = useContext(MatildaContext)
  const form = useMatildaForm('matilda_core.authentication_login_action', {}, { manageSuccess: false })
  const signupActive = getConfig('authentication_permit_signup')
  const customLoginRedirect = getConfig('authentication_session_valid_custom_redirect')
  const redirectPath = customLoginRedirect ? getRoute(customLoginRedirect) : getRoute('matilda_core.groups_select_view')

  const signupPath = getRoute("matilda_core.authentication_signup_view")
  const recoverPwdPath = getRoute("matilda_core.authentication_recover_password_view")

  useEffect(() => {
    if (form.response && form.response.result) {
      window.location.replace(redirectPath.path)
    }
  }, [form.response])

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: '100%' }}>
        <Card title={getTranslation('titles.login')}>
          <MatildaForm
            form={form}
          >
            <Form.Item
              name="username_email"
              label={getTranslation('labels.username_or_email')}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder={getTranslation('helps.insert_username_or_email')}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation('labels.password')}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder={getTranslation('helps.insert_password')}
              />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" block>
                {getTranslation('cta.login')}
              </Button>
              {signupActive && (
                <div style={{ marginTop: 15 }}>
                  <a href={signupPath.path}>{getTranslation('cta.signup')}</a> | <a href={recoverPwdPath.path}>{getTranslation('cta.recover_password')}</a>
                </div>
              )}
            </Form.Item>
          </MatildaForm>
        </Card>
      </Col>
    </Row>
  )
}