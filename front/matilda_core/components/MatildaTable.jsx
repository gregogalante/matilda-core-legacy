import React, { useMemo, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useMatildaRequest } from './MatildaRequest'

/**
 * @function MatildaTable
 * @param {*} props 
 */
export function MatildaTable (props) {
  const { table } = props
  const { config, loading, data, columns } = table

  let rowSelection = null
  if(config.selection == 'checkbox'){
    rowSelection = {type: 'checkbox', selectedRows: table.selectedRows, onChange: table.onChangeSelectedRows}
  } else if(config.selection == 'radio'){
    rowSelection = {type: 'radio', selectedRows: table.selectedRows, onChange: table.onChangeSelectedRows}
  }

  return (
    <Table
      columns={columns}
      loading={loading}
      dataSource={data}
      paginated={!!config.pagination}
      pagination={table.pagination}
      rowSelection={rowSelection}
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

  /**
   * @function getColumnSearchProps
   * @param {*} dataIndex 
   * @returns 
   */
   const getColumnSearchProps = (dataIndex) => {
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInputRef}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => onSearchChange(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => onSearchChange(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => onSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInputRef.current.select(), 100)
        }
      }
    }
  }

  /**
   * @function loadData
   * @param {*} pagination 
   * @param {*} sort 
   * @param {*} filters
   */
  const loadData = (pagination = {}, sort = {}, filters = {}) => {
    setLoading(true)

    // definisco parametri richiesta
    let params = {
      page: pagination?.current || 1,
      per_page: pagination?.pageSize || 25,
      sort_field: sort.field || '',
      sort_order: {ascend:'ASC',descend:'DESC'}[sort.order] || 'ASC',
      filters_keys: Object.keys(filters).join(','),
      filters_values: Object.values(filters).join(',')
    }

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
    loadData(pagination, sort, filters)
  }

  /**
   * @function onSearchChange
   * @param {*} selectedKeys 
   * @param {*} confirm 
   * @param {*} dataIndex 
   */
  const onSearchChange = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearch({
      text: selectedKeys[0],
      column: dataIndex
    })
  }

  /**
   * @function onSearchReset
   * @param {*} clearFilters 
   */
  const onSearchReset = (clearFilters) => {
    clearFilters()
    setSearch({ searchText: '' })
  }

  /**
   * @function onChangeSelectedRows
   * @param 
   * @returns 
   */
  const onChangeSelectedRows = (selectedRows) => {
    if(!config.checkbox) return
    setSelectedRows(selectedRows)
  }

  // imposto variabile per gestione delle richieste
  const request = useMatildaRequest()

  // imposto stato per gestire il loading della tabella
  const [loading, setLoading] = useState(true)
  
  // imposto stato per memorizzazione dei dati della tabella
  const [data, setData] = useState([])

  // imposto stato per memorizzazione dei dati di paginazione della tabella
  const [pagination, setPagination] = useState(configProps.pagination)

  // imposto stato per memorizzazione dei dati di ricerca
  const [search, setSearch] = useState({ text: '', column: '' })
  const searchInputRef = useRef()

  // imposto stato per memorizzare righe selezionate
  const [selectedRows, setSelectedRows] = useState([])
  
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
      selection: '',
    }, configProps)
  }, [configProps])

  // imposto colonne della componente (aggiornate a partire da config.columns)
  const columns = useMemo(() => {
    return config.columns.map((column) => {
      if (column.search) {
        column = Object.assign(column, getColumnSearchProps(column.dataIndex))
      }

      return column
    })
  }, [config.columns])

  // gestisco il primo caricamento di dati della tabella
  useEffect(() => {
    if (config.route) {
      loadData()
    } else {
      setData(config.data)
      setLoading(false)
    }
  }, [])

  return { config, loading, data, columns, pagination, loadData, onTableChange, selectedRows, onChangeSelectedRows }
}
