import React, { useContext, useEffect } from "react"
import { Row, Col, Card, Form, Button, Input } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { MatildaContext } from "matilda_core"
import {
  MatildaForm,
  useMatildaForm,
} from "matilda_core/components/MatildaForm"

export default function SignupPage() {
  const { getTranslation, getConfig, getRoute } = useContext(MatildaContext)
  const form = useMatildaForm(
    "matilda_core.authentication_signup_action",
    {},
    { manageSuccess: false }
  )
  const loginPath = getRoute("matilda_core.authentication_login_view")

  useEffect(() => {
    if (form.response && form.response.result) {
      window.location.replace(loginPath.path)
    }
  }, [form.response])

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: "100%" }}>
        <Card 
          title={getTranslation("titles.signup")}
          extra={<a href={loginPath.path}>{getTranslation("cta.login")}</a>}
        >
          <MatildaForm form={form}>
            <Form.Item
              name="name"
              label={getTranslation("labels.name")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="surname"
              label={getTranslation("labels.surname")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label={getTranslation("labels.username")}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label={getTranslation("labels.email")}
              rules={[{ required: true }, { type: 'email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation("labels.password")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label={getTranslation("labels.password_confirmation")}
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" block>
                {getTranslation("cta.confirm")}
              </Button>
            </Form.Item>
          </MatildaForm>
        </Card>
      </Col>
    </Row>
  )
}
