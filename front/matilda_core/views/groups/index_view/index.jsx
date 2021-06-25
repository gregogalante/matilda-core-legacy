import React, { useContext } from 'react'
import { Card, List, Button } from 'antd'
import { MatildaContainer, MatildaPageRouter, MatildaContext, useMatildaRedirect, useMatildaRequest, useMatildaTranslator } from 'matilda_core/react_tools'
import './index.scss'

export default (props) => {
  return (
    <MatildaContainer matilda={props.matilda}>
      <MatildaPageRouter routes={[{
        component: <IndexView />
      }]} />
    </MatildaContainer>
  )
}

/********************************************************************************************** */

function IndexView() {
  const { view: { key } } = useContext(MatildaContext)
  const { t } = useMatildaTranslator()

  //////////////////////////////////////////////////////////

  // ....

  //////////////////////////////////////////////////////////

  return (
    <div id={`${key}__listing`}>
      
    </div>
  )
}