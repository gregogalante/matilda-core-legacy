import React from 'react'
import { Card, Form, Input, Button, Checkbox, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { MatildaContainer, useMatildaRequest, useMatildaRedirect, useMatildaTranslator } from 'matilda_core'

export default (props) => <MatildaContainer matilda={props.matilda}><SelectView /></MatildaContainer>

/********************************************************************************************** */

function SelectView() {
  const { t } = useMatildaTranslator()

  //////////////////////////////////////////////////////////

  // ...

  //////////////////////////////////////////////////////////

  return (
    <div id="SelectView">
      
    </div>
  )
}