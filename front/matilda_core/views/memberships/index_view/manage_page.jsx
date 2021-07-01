import { Row, Col, Card, Descriptions, Form, Button, Input, Select } from 'antd'
import React,  { useMemo, useState, useEffect, useContext } from 'react'
import { useMatildaRequest } from '../../../components/MatildaRequest'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'
import { MatildaPagesWrapper } from 'matilda_core/components/MatildaPages'

export default function ManagePage (props) {
  const { pages } = props
  const request = useMatildaRequest()
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const [user, setUser] = useState(null)
  const [membership, setMembership] = useState(null)
  const form = useMatildaForm('matilda_core.memberships_edit_permissions_role_action', {}, { manageSuccess: false })
  const { Option } = Select

  useEffect(() => {
    request.send('matilda_core.memberships_manage_api', {user_uuid: props.userUuid}).then((response) => {
      if (!response.result) return
      console.log(response)
      setUser(response.payload.user)
      setMembership(response.payload.membership)
    })
  }, [])

  useEffect(() => {
    if (form.response && form.response.result) {
      window.location.reload()
    }
  }, [form.response])

  const onClickRoleAdvanced = () => {
    pages.openDrawer('users_index_manage_page_role_advanced')
  }

  const showPermissions = getConfig('memberships_show_permissions_editor')
  const permissionsRole = getConfig('memberships_permissions_roles')

  const roles = useMemo(() => {
    let items = []
    if (permissionsRole) {
      items = permissionsRole
      items = items.map((i) => {
        if(i.label.startsWith('locale.')){
          i.label = getTranslation(i.label.replace('locale.', ''))
        }
        return i
      })
    }
    return items
  }, [permissionsRole])

  console.log(user)
  console.log(membership)

  return (
    <MatildaPagesWrapper pages={pages}>
      <Row gutter={[16, 16]}>
        <Col sm={{span: 24}} lg={{span: 18}}>
          <Card title={getTranslation("matilda_core.titles.informations")}>
            {user && (
              <Descriptions 
                bordered
                column={{sm: 1, lg: 2}}
              >
                <Descriptions.Item label={getTranslation("matilda_core.labels.name")}>{user.name}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("matilda_core.labels.surname")}>{user.surname}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("matilda_core.labels.username")}>{user.username}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("matilda_core.labels.email")}>{user.email}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("matilda_core.labels.registration_date")}>{user.created_at}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("matilda_core.labels.last_access_date")}></Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>

        <Col sm={{span: 24}} lg={{span: 6}}>
          <Card 
            title={getTranslation("matilda_core.titles.edit_permissions_role")}
            extra={showPermissions ? <a onClick={onClickRoleAdvanced}>{getTranslation("matilda_core.titles.edit_permissions")}</a> : ''}
          >
            <MatildaForm form={form}>
              <Form.Item
                name="role"
                label={getTranslation("matilda_core.labels.role")}
              >
                <Select>
                  {roles && roles.map(role => {
                    return <Option value={role.name} key={role.name} >{getTranslation(role.label)}</Option>
                  })}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {getTranslation("matilda_core.cta.confirm")}
                </Button>
              </Form.Item>
            </MatildaForm>
          </Card>
        </Col>
      </Row>
    </MatildaPagesWrapper>
  )
}