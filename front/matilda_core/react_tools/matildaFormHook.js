import { useContext } from 'react'
import { Form, notification } from 'antd'
import { MatildaContext } from './MatildaContext'

/**
 * @function useMatildaForm
 * @returns 
 */
 export function useMatildaForm() {
  const { _Form: { fallbackErrorMessage } } = useContext(MatildaContext)
  const [form] = Form.useForm()

  /**
   * @function formOnResponseError
   * @param {object} response Oggetto risposta proveniente da useMatildaRequest
   * @returns 
   */
  const formOnResponseError = (response) => {
    if (response.result) return

    const fieldsKeys = Object.keys(form.getFieldsValue())
    if (response.errors && response.errors.length > 0) {
      const errorsWithFields = response.errors.filter((e) => fieldsKeys.includes(e.code))
      form.setFields(errorsWithFields.map((err) => ({ name: err.code, errors: [err.message] })))

      const errorsWithoutFields = response.errors.filter(x => !errorsWithFields.includes(x))
      if (errorsWithoutFields.length > 0) {
        notification['error']({
          message: 'Error',
          description: errorsWithoutFields[0].message
        })
      }
    } else {
      if (errorsWithoutFields.length > 0) {
        notification['error']({
          message: 'Error',
          description: fallbackErrorMessage
        })
      }
    }
  }

  return { form, formOnResponseError }
}