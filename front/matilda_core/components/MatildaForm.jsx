import React, { useState, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { notification, Form } from 'antd'
import { useMatildaRequest } from './MatildaRequest'
import { MatildaContext } from '../index'

/**
 * @function MatildaForm
 * @param {*} props
 */
export function MatildaForm (props) {
  const { form: { antdForm, onSubmit }, style } = props

  return (
    <Form
      form={antdForm}
      layout='vertical'
      onFinish={onSubmit}
      style={style}
    >
      {props.children}
    </Form>
  )
}

MatildaForm.propTypes = {
  style: PropTypes.object
}

MatildaForm.defaultProps = {
  style: {}
}

/***************************************************************************************************** */

/**
 * @function useMatildaForm
 * @param {string} routeKey
 * @param {object} extraParamsProps
 * @param {object} configProps
 */
export function useMatildaForm (routeKey, extraParamsProps = {}, configProps = {}) {
  const { getTranslation } = useContext(MatildaContext)
  const matildaRequest = useMatildaRequest({ manageError: false })
  const [extraParams, setExtraParams] = useState(extraParamsProps)
  const [response, setResponse] = useState(null)
  const [antdForm] = Form.useForm()

  const config = useMemo(() => {
    return Object.assign({
      onResponse: null,
      onSuccess: null,
      onError: null,
      manageError: true,
      manageSuccess: true,
      defaultErrorMessage: getTranslation('messages.general_error'),
      defaultSuccessMessage: getTranslation('messages.general_success')
    }, configProps)
  }, [configProps])

  const onSubmit = (formParams) => {
    const params = Object.assign(extraParams, formParams)
    matildaRequest.send(routeKey, params).then((response) => {
      setResponse(response)
      if (config.onResponse) config.onResponse(response)

      if (response.result) {
        if (config.onSuccess) config.onSuccess(response)

        if (config.manageSuccess) {
          antdForm.resetFields()
          notification['success']({ description: config.defaultSuccessMessage })
        }
      } else {
        if (config.onError) config.onError(response)

        if (config.manageError) {
          if (response.errors && response.errors.length > 0) {
            const fieldsKeys = Object.keys(antdForm.getFieldsValue())
            const errorsWithFields = response.errors.filter((e) => fieldsKeys.includes(e.code))
            const errorsWithoutFields = response.errors.filter(x => !errorsWithFields.includes(x))
            antdForm.setFields(errorsWithFields.map((err) => ({ name: err.code, errors: [err.message] })))

            if (errorsWithoutFields.length > 0) {
              notification['error']({ description: errorsWithoutFields[0].message })
            }
          } else {
            notification['error']({ description: config.defaultErrorMessage })
          }
        }
      }
    })
  }

  return { antdForm, matildaRequest, response, onSubmit, setExtraParams }
}