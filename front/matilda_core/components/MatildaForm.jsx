/**
 * NOTE: Deprecated
 */

import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import mapboxgl from '!mapbox-gl'
import mapboxglgeocoder from 'mapbox-gl-geocoder'
import { notification, Form } from 'antd'
import { useMatildaRequest } from './MatildaRequest'
import { MatildaContext } from '../index'

import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

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

export function MatildaFormMapInput (props) {
  const { style, zoom, value, onChange } = props
  const { getConfig, getLocale } = useContext(MatildaContext)
  const [mapItem, setMapItem] = useState(null)
  const [location, setLocation] = useState(value || { lat: null, lng: null, name: null })
  mapboxgl.accessToken = getConfig('mapbox_token')

  const mapRef = useCallback((el) => {
    if (!el) return

    setMapItem(new mapboxgl.Map({
      container: el,
      center: [location.lng, location.lat],
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: zoom || 10
    }))
  }, [])

  useEffect(() => {
    if (!mapItem) return

    let geocoder = new mapboxglgeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      language: getLocale() + '-' + getLocale().toUpperCase()
    })
    geocoder.on('result', (e) => {
      setLocation({ lng: e.result.center[0], lat: e.result.center[1], name: e.result.place_name })
    })
    mapItem.addControl(geocoder)

    mapItem.marker = new mapboxgl.Marker()
    mapItem.geocoder = geocoder
  }, [mapItem])

  useEffect(() => {
    if (value) setLocation(value)
  }, [value])

  useEffect(() => {
    if (mapItem?.marker && location) {
      const markerCenter = [location.lng, location.lat]
      mapItem.marker.setLngLat(markerCenter).addTo(mapItem)
      mapItem.setCenter(markerCenter)
    }
    onChange(location)
  }, [location])

  return (
    <div ref={mapRef} style={Object.assign({ backgroundColor: '#eeeeee' }, style)} />
  )
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

  /**
   * @function onSubmit
   * @param {*} formParams 
   */
  const onSubmit = (formParams) => {
    const params = Object.assign({}, extraParams, formParams)
    matildaRequest.send(routeKey, params).then((response) => {
      setResponse(response)
      if (config.onResponse) config.onResponse(response)

      if (response.result) {
        if (config.onSuccess) config.onSuccess(response)

        if (config.manageSuccess) {
          antdForm.resetFields()
          notification['success']({ message: config.defaultSuccessMessage })
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
              notification['error']({ message: errorsWithoutFields[0].message })
            }
          } else {
            notification['error']({ message: config.defaultErrorMessage })
          }
        }
      }
    })
  }

  return { antdForm, extraParams, matildaRequest, response, onSubmit, setExtraParams }
}