import React from 'react'
import PropTypes from 'prop-types'
import { Card, Spin } from 'antd'

export default function CardComponent (props) {
  const { content, contentDependOn } = props
  const cardProps = Object.assign({}, props, { content: undefined, contentDependOn: undefined })

  return (
    <Card {...cardProps}>
      {!!contentDependOn ? content(contentDependOn) : <div style={{ textAlign: 'center' }}><Spin /></div>}
    </Card>
  )
}

CardComponent.propTypes = {
  content: PropTypes.func.isRequired,
  contentDependOn: PropTypes.any
}

CardComponent.defaultProps = {
  contentDependOn: true
}