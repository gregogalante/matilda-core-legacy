import React, { useState, useContext, useMemo, useRef, useEffect } from 'react'
import { useMatildaRequest } from './MatildaRequest'
import { MatildaContext } from '../index'

import mapboxgl from '!mapbox-gl'
import mapboxglgeocoder from 'mapbox-gl-geocoder'

/**
 * @function MatildaForm
 * @param {*} props
 */
export function MatildaMap (props) {

  return (
    <div ref={props.mapContainer} />
  )
}

/***************************************************************************************************** */

/**
 * @function useMatildaMap
 * @param 
 */
export function useMatildaMap (defaultLng = 12, defaultLat = 44, defaultZoom = 4.5, extraParamsProps = {}) {
  const { getTranslation, getLocale, getConfig } = useContext(MatildaContext)
  const [extraParams, setExtraParams] = useState(extraParamsProps)

  mapboxgl.accessToken = getConfig('mapbox_token')

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(defaultLng); //12
  const [lat, setLat] = useState(defaultLat); //44
  const [zoom, setZoom] = useState(defaultZoom); //4.5
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });

    // TODO
    // map.current.getStyle().layers.forEach((layer) => {
    //   if(layer.id.indexOf('-label')>0){
    //     map.current.setLayoutProperty(layer.id, 'text-field', ['get', 'name_' + getLocale()])
    //   }
    // })

    let geocoder = new mapboxglgeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      language: getLocale()+'-'+getLocale().toUpperCase()
    })
    map.current.addControl(geocoder)

    // let marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current)
  })

  /**
   * @function getLat
   * @returns 
   */
  const getLat = () => {
    return lat
  }

  /**
   * @function getLng
   * @returns 
   */
  const getLng = () => {
    return lng
  }

  return { mapContainer, getLat, getLng }
}