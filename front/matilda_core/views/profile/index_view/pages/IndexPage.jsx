import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Form, Input, notification, Space } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import NavigatorWrapperComponent from 'matilda_core/components/NavigatorWrapperComponent'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'
import { useMatildaRequest } from 'matilda_core/components/MatildaRequest'

export default function IndexPage (props) {
  const { navigator } = props
  const request = useMatildaRequest()
  const { getTranslation } = useContext(MatildaContext)
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
      form.antdForm.setFieldsValue({
        name: user.name,
        surname: user.surname
      })
    }
  }, [user])

  const form = useMatildaForm('matilda_core.profile_edit_info_action', {}, { manageSuccess: false })
  const openNotification = () => {
    notification.open({
      message: getTranslation('messages.user_update_success'),
      duration: 4,
      icon: <CheckCircleTwoTone />
    })
  }
  useEffect(() => {
    if (form.response && form.response.result) {
      indexApi()
      openNotification()
      // TODO
    }
  }, [form.response])

  return (
    <NavigatorWrapperComponent navigator={navigator} >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Card 
          title={getTranslation("titles.personal_informations")}
          // extra={}
        >
          <MatildaForm form={form}>
            <Form.Item
              name="name"
              label={getTranslation("labels.name")}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="surname"
              label={getTranslation("labels.surname")}
            >
              <Input />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                {getTranslation("cta.update")}
              </Button>
            </Form.Item>
          </MatildaForm>
        </Card>
      </Space>
    </NavigatorWrapperComponent>
  )
}