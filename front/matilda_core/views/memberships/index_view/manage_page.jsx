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
  const form = useMatildaForm('matilda_core.memberships_edit_permissions_role_action', {user_uuid: props.userUuid}, { manageSuccess: false })

  useEffect(() => {
    request.send('matilda_core.memberships_manage_api', {user_uuid: props.userUuid}).then((response) => {
      if (!response.result) return
      setUser(response.payload.user)
      setMembership(response.payload.membership)
    })
  }, [])

  useEffect(() => {
    if (form.response && form.response.result) {
      // window.location.replace(redirectPath.path)
      window.location.reload()
    }
  }, [form.response])

  const onClickRoleAdvanced = () => {
    pages.openDrawer('users_index_manage_page_role_advanced', {user, membership})
  }

  const showPermissions = getConfig('memberships_show_permissions_editor')
  const permissionsRole = getConfig('memberships_permissions_roles')

  const roles = useMemo(() => {
    let items = []
    if(permissionsRole){
      permissionsRole.map(i => {
        items.push(
          Object.assign({
            label: getTranslation(i.label),
            value: i.name
          })
        )
      })
    }
    return items
  }, [permissionsRole])

  return (
    <MatildaPagesWrapper pages={pages}>
      <Row gutter={[16, 16]}>
        <Col sm={{span: 24}} lg={{span: 18}}>
          <Card title={getTranslation("titles.informations")}>
            {user && (
              <Descriptions 
                bordered
                column={{sm: 1, lg: 2}}
              >
                <Descriptions.Item label={getTranslation("labels.name")}>{user.name}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("labels.surname")}>{user.surname}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("labels.username")}>{user.username}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("labels.email")}>{user.email}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("labels.registration_date")}>{user.created_at}</Descriptions.Item>
                <Descriptions.Item label={getTranslation("labels.last_access_date")}></Descriptions.Item>
              </Descriptions>
            )}
          </Card>
        </Col>

        <Col sm={{span: 24}} lg={{span: 6}}>
          <Card 
            title={getTranslation("titles.edit_permissions_role")}
            extra={showPermissions && user ? <a onClick={onClickRoleAdvanced}>{getTranslation("titles.edit_permissions")}</a> : ''}
          >
            <MatildaForm form={form}>
              <Form.Item
                name="role"
                label={getTranslation("labels.role")}
              >
                {membership && (
                  <Select defaultValue={membership.permissions_role} options={roles} />
                )}
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  {getTranslation("cta.confirm")}
                </Button>
              </Form.Item>
            </MatildaForm>
          </Card>
        </Col>
      </Row>
    </MatildaPagesWrapper>
  )
}