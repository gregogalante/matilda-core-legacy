import React, { useContext, useEffect, useState } from "react"
import { Row, Col, Card, Form, Button, Input, Result } from "antd"
import { UserOutlined, LockOutlined, SmileOutlined } from "@ant-design/icons"
import { MatildaContext } from "matilda_core"
import {
  MatildaForm,
  useMatildaForm,
} from "matilda_core/components/MatildaForm"

export default function SignupPage(props) {
  const { getTranslation, getConfig, getRoute } = useContext(MatildaContext)
  const form = useMatildaForm(
    "matilda_core.authentication_update_password_action",
    { user_uuid: props.user_uuid },
    { manageSuccess: false }
  )
  const loginPath = getRoute("matilda_core.authentication_login_view")
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    if (form.response && form.response.result) {
      setUpdated(true)
    }
  }, [form.response])

  return (
    <Row justify="center" align="center">
      <Col style={{ maxWidth: 400, width: "100%" }}>
        <Card
          title={getTranslation("titles.recover_password")}
          extra={<a href={loginPath.path}>{getTranslation("cta.login")}</a>}
        >
          {updated ? (
            <Result 
              icon={<SmileOutlined />}
              title={getTranslation("strings.update_password_complete_title")}
              extra={<a href={loginPath.path}>{getTranslation("cta.continue")}</a>}
            />
          ) : (
            <MatildaForm form={form}>
              <Form.Item
                name="recover_password_code"
                label={getTranslation("labels.security_code")}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="password"
                label={getTranslation("labels.new_password")}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="password_confirmation"
                label={getTranslation("labels.new_password_confirmation")}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit" block>
                  {getTranslation("cta.confirm")}
                </Button>
              </Form.Item>
            </MatildaForm>
          )}
        </Card>
      </Col>
    </Row>
  )
}
