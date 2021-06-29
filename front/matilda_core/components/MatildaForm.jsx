import React from 'react'
import { Form } from 'antd'

/**
 * @function MatildaForm
 * @param {*} props
 */
export function MatildaForm (props) {
  const { form: { antdForm } } = props

  return (
    <Form
      form={antdForm}
      layout='vertical'
    >
      {props.children}
    </Form>
  )
}

/**
 * @function useMatildaForm
 */
export function useMatildaForm () {
  const [antdForm] = Form.useForm()

  return { antdForm }
}