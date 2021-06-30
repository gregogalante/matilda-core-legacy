import React, { useContext } from 'react'
import { Form, Input } from 'antd'
import { MatildaContext } from 'matilda_core'
import { MatildaForm, useMatildaForm } from 'matilda_core/components/MatildaForm'

export default function InviteDrawer () {
  const { getTranslation } = useContext(MatildaContext)
  const form = useMatildaForm('matilda_core.memberships_invitation_action')

  return (
    <MatildaForm
      form={form}
    >
      <Form.Item
        name="name"
        label={getTranslation('matilda_core.labels.name')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="surname"
        label={getTranslation('matilda_core.labels.surname')}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label={getTranslation('matilda_core.labels.email')}
        rules={[{ required: true }]}
      >
        <Input type="email" />
      </Form.Item>
    </MatildaForm>
  )
}