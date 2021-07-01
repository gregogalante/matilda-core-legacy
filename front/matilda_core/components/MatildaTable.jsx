import React, { useMemo, useState, useEffect } from 'react'
import { Table } from 'antd'
import { useMatildaRequest } from './MatildaRequest'

/**
 * @function MatildaTable
 * @param {*} props 
 */
export function MatildaTable (props) {
  const { table } = props
  const { config, loading, data } = table

  return (
    <Table
      columns={config.columns}
      loading={loading}
      dataSource={data}
      pagination={config.pagination}
      bordered
      sticky
    />
  )
}

/**
 * @function useMatildaTable
 * @param {*} configProps
 */
export function useMatildaTable (configProps = {}) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const request = useMatildaRequest()
 
  const config = useMemo(() => {
    return Object.assign({
      columns: [],
      data: [],
      route: null,
      routeDataParser: () => [],
      pagination: false,
    }, configProps)
  }, [configProps])

  useEffect(() => {
    if (config.route) {
      loadData()
    } else {
      setData(config.data)
      setLoading(false)
    }
  }, [])

  const loadData = (page = 1, sorter = {}) => {
    setLoading(true)

    let params = {}
    if (page) params = Object.assign(params, { page })
    if (sorter) params = Object.assign(params, sorter)

    request.send(config.route, params).then((response) => {
      if (!response.result) return

      setData(config.routeDataParser(response))
      setLoading(false)
    })
  }

  return { config, loading, data }
}
