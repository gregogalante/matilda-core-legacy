import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { PageHeader } from 'antd'
import { MatildaContext } from '../'

 export default function NavigatorWrapperComponent (props) {
  const { navigator, extra } = props
  const { prevPageKey } = navigator.currentPageData
  const { getTranslation } = useContext(MatildaContext)
  const title = getTranslation(navigator.currentPage.label)
  
  const onClickBack = () => {
    if (prevPageKey) {
      navigator.goToPage(prevPageKey, {}, true)
    }
  }

  return (
    <PageHeader
      title={title}
      extra={extra}
      onBack={onClickBack}
    >
      {props.children}
    </PageHeader>
  )
}

NavigatorWrapperComponent.propTypes = {
  navigator: PropTypes.object.isRequired,
  extra: PropTypes.any
}

NavigatorWrapperComponent.defaultProps = {
  extra: []
}