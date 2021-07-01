import React, { useContext, useEffect, useState } from "react"
import { Row, Col, Card, Form, Button, Input, Result } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { MatildaContext } from "matilda_core"
import {
  MatildaForm,
  useMatildaForm,
} from "matilda_core/components/MatildaForm"

export default function SignupPage() {
  const { getTranslation, getConfig, getRoute } = useContext(MatildaContext)
  const form = useMatildaForm(
    "matilda_core.authentication_recover_password_action",
    {},
    { manageSuccess: false }
  )
  const loginPath = getRoute("matilda_core.authentication_login_view")
  const updatePwdPath = getRoute("matilda_core.authentication_update_password_view")
  const [mailSended, setMailSended] = useState(false)

  useEffect(() => {
    if (form.response && form.response.result) {
      setMailSended(true)
    }
  }, [form.response])

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: "100%" }}>
        <Card
          title={getTranslation("matilda_core.titles.recover_password")}
          extra={<a href={loginPath.path}>{getTranslation("matilda_core.cta.login")}</a>}
        >
          {mailSended ? (
            <Result 
              status="success"
              title={getTranslation("matilda_core.strings.recover_password_complete_title")}
              extra={<a href={updatePwdPath.path}>{getTranslation("matilda_core.cta.continue")}</a>}
            />
          ) : (
            <MatildaForm form={form}>
              <Form.Item
                name="username_email"
                label={getTranslation("matilda_core.labels.username_or_email")}
              >
                <Input />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit" block>
                  {getTranslation("matilda_core.cta.confirm")}
                </Button>
              </Form.Item>
            </MatildaForm>
          )}
        </Card>
      </Col>
    </Row>
  )
}
