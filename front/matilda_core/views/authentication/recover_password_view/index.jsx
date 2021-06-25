import React, { useContext } from 'react'
import { Card, Form, Input, Button, Checkbox, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MatildaContainer, MatildaContext, useMatildaForm, useMatildaRequest, useMatildaRedirect, useMatildaTranslator } from 'matilda_core/react_tools'
import './index.scss'

export default (props) => <MatildaContainer matilda={props.matilda} layout="authentication"><RecoverPasswordView {...props} /></MatildaContainer>

/********************************************************************************************** */

function RecoverPasswordView() {
  const { config: { authentication_session_valid_custom_redirect, authentication_permit_signup }, view: { key } } = useContext(MatildaContext)
  const { form, formOnResponseError } = useMatildaForm()
  const { requestSend: requestSendAuthenticationLogin } = useMatildaRequest('matilda_core.authentication_login_action')
  const { redirectRun: redirectRunAuthenticationLogin } = useMatildaRedirect(authentication_session_valid_custom_redirect ? { path: authentication_session_valid_custom_redirect } : 'matilda_core.groups_select_view')
  const { t } = useMatildaTranslator()

  //////////////////////////////////////////////////////////

  const onFinishLogin = (values) => {
    requestSendAuthenticationLogin(values).then((response) => {
      if (response.result) {
        redirectRunAuthenticationLogin({ replace: true })
      } else {
        formOnResponseError(response)
      }
    })
  }

  //////////////////////////////////////////////////////////

  return (
    <div id={key}>
      <Card title={t('matilda_core.titles.recover_password')} className="card">
        <Form
          name="login"
          className="form"
          layout="vertical"
          initialValues={{ remember: true }}
          form={form}
          onFinish={onFinishLogin}
        >
          <Form.Item
            name="username_email"
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder={t('matilda_core.labels.username_or_email')} />
          </Form.Item>

          <Form.Item
            name="password"
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder={t('matilda_core.labels.password')} />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="form__forgot" href="">
              {t('matilda_core.cta.recover_password')}
            </a>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" className="form__button">
                {t('matilda_core.cta.login')}
              </Button>
              {authentication_permit_signup && (
                <div>
                  <a href="">{t('matilda_core.cta.signup')}</a>
                </div>
              )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}