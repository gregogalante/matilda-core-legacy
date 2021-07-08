import React, { useMemo, useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { MatildaContext } from '../'
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
      paginated={!!config.pagination}
      pagination={table.pagination}
      onChange={table.onTableChange}
      scroll={{ x: 1024 }}
      bordered
      sticky
    />
  )
}
MatildaTable.propTypes = {
  table: PropTypes.shape({
    config: PropTypes.shape({
      columns: PropTypes.array.isRequired,
      data: PropTypes.array,
      route: PropTypes.string,
      routeDataParser: PropTypes.func,
      routePaginationParser: PropTypes.func,
      pagination: PropTypes.any
    }).isRequired
  }).isRequired
}

/***************************************************************************************************** */

/**
 * @function useMatildaTable
 * @param {*} configProps
 */
export function useMatildaTable (configProps = {}) {
  // identifico stati e hook vari
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState(configProps.pagination)
  const request = useMatildaRequest()
  
  // imposto configurazione della componente
  const config = useMemo(() => {
    return Object.assign({
      columns: [],
      data: [],
      route: null,
      routeExtraParams: {},
      routeDataParser: () => [],
      routePaginationParser: null,
      pagination: false,
    }, configProps)
  }, [configProps])

  // gestisco il primo caricamento di dati della tabella
  useEffect(() => {
    if (config.route) {
      loadData()
    } else {
      setData(config.data)
      setLoading(false)
    }
  }, [])

  /**
   * @function loadData
   * @param {*} pagination 
   * @param {*} sort 
   */
  const loadData = (pagination = {}, sort = {}) => {
    setLoading(true)

    // definisco parametri richiesta
    let params = {
      page: pagination?.current || 1,
      per_page: pagination?.pageSize || 25,
      sort_field: sort.field || '',
      sort_order: {ascend:'ASC',descend:'DESC'}[sort.order] || 'ASC'
    }
    params = Object.assign(params, config.routeExtraParams)

    // invio richiesta
    request.send(config.route, params).then((response) => {
      if (!response.result) return

      // gestisco dati paginazione da risposta (se la paginazione e attiva)
      if (config.pagination) {
        if (config.routePaginationParser) { // caso in cui la risposta viene parsata dall'esterno
          setPagination(config.routePaginationParser(response))
        } else if (response.payload?.params?.pagination) { // caso in cui la risposta viene parsata su standard matilda
          setPagination({ total: response.payload.params.pagination.total_items, current: response.payload.params.pagination.page, pageSize: response.payload.params.pagination.per_page })
        } else { // altri casi
          setPagination(config.pagination)
        }
      }

      // salvo dati arrivati da risposta api
      setData(config.routeDataParser(response))

      // disattivo loading
      setLoading(false)
    })
  }

  /**
   * @function onTableChange
   * @param {*} pagination 
   * @param {*} sort 
   * @param {*} filter 
   */
  const onTableChange = (pagination, filters, sort) => {
    loadData(pagination, sort)
  }

  return { config, loading, data, pagination, loadData, onTableChange }
}
