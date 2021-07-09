import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Form, Input, notification, List, Space } from 'antd'
import { MatildaPagesWrapper } from 'matilda_core/components/MatildaPages'
import { useMatildaRequest } from 'matilda_core/components/MatildaRequest'
import { StarOutlined, StarFilled, DeleteOutlined, CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons'
import { MatildaContext } from 'matilda_core'
import Item from 'antd/lib/list/Item'

export default function EmailsPage (props) {
  const { pages } = props
  const { getTranslation } = useContext(MatildaContext)
  const request = useMatildaRequest()
  const [emails, setEmails] = useState(null)

  const indexApi = () => {
    request.send('matilda_core.profile_index_api', {}).then((response) => {
      if (!response.result) return
      setEmails(response.payload.user_emails)
    })
  }
  console.log(emails)

  useEffect(() => {
    indexApi()
  }, [])
  
  const onDeleteEmail = (email) => {
    request.send('matilda_core.profile_remove_email_action', {email}).then((response) => {
      if(!response.result){
        notification.open({
          message: 'Email delete error',
          duration: 4,
          icon: <CloseCircleTwoTone />
        })
        return
      }

      notification.open({
        message: 'Email delete success',
        duration: 4,
        icon: <CheckCircleTwoTone />
      })
      indexApi()
    })
  }

  const onAddEmail = () => {
    pages.openDrawer(
      'profile_index_emails_page_add_email', 
      {onComplete: () => { pages.closeDrawer(), indexApi(), openNotificationAddEmailSuccess() }}
    )
  }

  const openNotificationAddEmailSuccess = () => {}

  return (
    <MatildaPagesWrapper
      pages={pages}
    >
      <Card 
        title={getTranslation("titles.email_addresses")}
        extra={<Button type='link' onClick={onAddEmail}>{getTranslation('cta.add')}</Button>}
      >
        {emails && (
          <List 
            bordered 
            dataSource={emails}
            renderItem={email => (
            <List.Item style={{display: 'flex', justifyContent: 'space-between'}}>
              {email.email} 
              <Space>
                {email.primary ? (
                  <Button icon={<StarFilled/>} />
                ) : (
                  <>
                    <Button icon={<StarOutlined/>} />
                    <Button type='danger' icon={<DeleteOutlined/>} onClick={() => onDeleteEmail(email.email)} />
                  </>
                )}
              </Space>
            </List.Item>
          )} />
        )}
      </Card>
    </MatildaPagesWrapper>
  )
}