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
          title={getTranslation("matilda_core.titles.signup")}
          extra={<a href={loginPath.path}>{getTranslation("matilda_core.cta.login")}</a>}
        >
          <MatildaForm form={form}>
            <Form.Item
              name="name"
              label={getTranslation("matilda_core.labels.name")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="surname"
              label={getTranslation("matilda_core.labels.surname")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="username"
              label={getTranslation("matilda_core.labels.username")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label={getTranslation("matilda_core.labels.email")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label={getTranslation("matilda_core.labels.password")}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="password_confirmation"
              label={getTranslation(
                "matilda_core.labels.password_confirmation"
              )}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" block>
                {getTranslation("matilda_core.cta.confirm")}
              </Button>
            </Form.Item>
          </MatildaForm>
        </Card>
      </Col>
    </Row>
  )
}
