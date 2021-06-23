import React, { useContext } from 'react'
import { Card, List, Button } from 'antd'
import { MatildaContainer, MatildaContext, useMatildaRedirect, useMatildaRequest, useMatildaTranslator } from 'matilda_core/react_tools'
import './index.scss'

export default (props) => <MatildaContainer matilda={props.matilda} layout="authentication"><SelectView {...props} /></MatildaContainer>

/********************************************************************************************** */

function SelectView(props) {
  const { config: { groups_permit_creation_to_users} } = useContext(MatildaContext)
  const { requestSend: requestSendGroupsSelect } = useMatildaRequest('matilda_core.groups_select_action', true)
  const { redirectRun: redirectRunGroupsIndexView } = useMatildaRedirect('matilda_core.groups_index_view')
  const { t } = useMatildaTranslator()

  //////////////////////////////////////////////////////////

  const onSelectGroup = (groupUuid) => {
    requestSendGroupsSelect({ group_uuid: groupUuid }).then((response) => {
      if (response.result) redirectRunGroupsIndexView()
    })
  }

  //////////////////////////////////////////////////////////

  return (
    <div id="SelectView">
      <Card
        title={t('matilda_core.titles.select_a_group')}
        className="card"
        extra={groups_permit_creation_to_users ? <Button type="primary">{t('matilda_core.cta.create')}</Button> : null}
      >
        <List
          itemLayout="horizontal"
          dataSource={props.groups}
          renderItem={item => (
            <List.Item actions={[<a key="select" onClick={() => onSelectGroup(item.uuid)} >{t('matilda_core.cta.select')}</a>]}>
              <List.Item.Meta title={item.name} />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}