import React, { useContext, useRef, useMemo, useState } from 'react'
import { Form, Row, Col, Space, Card, Checkbox } from 'antd'
import { MatildaContext } from 'matilda_core'
import FormComponent from 'matilda_core/components/FormComponent'

export default function PermissionsDrawer (props) {
  const { navigator, membership: { permissions: userPermissions }, user: { uuid: userUuid }, c } = props
  const { getTranslation, getConfig } = useContext(MatildaContext)
  const membershipsPermissionsConfig = getConfig('memberships_permissions')
  const [newUserPermissions, setNewUserPermissions] = useState(userPermissions)

  const permissionsOptions = useMemo(() => {
    let items = []
    if (membershipsPermissionsConfig) {
      items = membershipsPermissionsConfig
      items = items.map((i) => {
        if(i.label.startsWith('locale.')){
          i.label = getTranslation(i.label.replace('locale.matilda_core.', ''))
        }
        if(i.group.startsWith('locale.')){
          i.group = getTranslation(i.group.replace('locale.matilda_core.', ''))
        }
        return i
      })
    }
    return items
  }, [membershipsPermissionsConfig])

  /**
   * @function onCheckChange
   * @param {*} e 
   */
  const onCheckChange = (e) => {
    setNewUserPermissions(newUserPermissions.includes(e.target.id) ? newUserPermissions.filter(item => item !== e.target.id) : [...newUserPermissions, e.target.id])
  }

  /**
   * @function onPermissionsUpdated
   */
  const onPermissionsUpdated = () => {
    navigator.closeDrawer()
    onCompleted()
  }

  return (
    <Row gutter={[15, 15]}>
      <Col sm={24}>
        <Card title={getTranslation("titles.edit_permissions")}>
          <FormComponent
            path='matilda_core.memberships_edit_permissions_action'
            paramsDecorator={(p) => Object.assign(p, { user_uuid: userUuid, permissions: newUserPermissions })}
            onResponseSuccess={onPermissionsUpdated}
          >
            {permissionsOptions && permissionsOptions.map(permission => {
              return (
                <Form.Item 
                  key={permission.name}
                  name={permission.name}
                >
                  <Checkbox checked={newUserPermissions.includes(permission.name)} onChange={onCheckChange}>{getTranslation(permission.label)}</Checkbox>
                </Form.Item>
              )
            })}
          </FormComponent>
        </Card>
      </Col>
    </Row>
  )
}