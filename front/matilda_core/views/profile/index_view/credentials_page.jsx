import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Form, Input, notification } from 'antd'
import { MatildaPagesWrapper } from 'matilda_core/components/MatildaPages'

export default function CredentialsPage (props) {
  const { pages } = props

  

  return (
    <MatildaPagesWrapper
      pages={pages}
    >
      <Card 
        // title={getTranslation("titles.edit_permissions_role")}
        // extra={}
      >
        
      </Card>
    </MatildaPagesWrapper>
  )
}