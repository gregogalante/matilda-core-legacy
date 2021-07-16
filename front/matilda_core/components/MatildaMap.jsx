import React, { useState, useContext, useMemo, useRef, useEffect } from 'react'
import { useMatildaRequest } from './MatildaRequest'
import { MatildaContext } from '../index'

import mapboxgl from '!mapbox-gl'
import mapboxglgeocoder from 'mapbox-gl-geocoder'
import 'mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import 'mapbox-gl/dist/mapbox-gl.css'

/**
 * @function MatildaForm
 * @param {*} props
 */
export function MatildaMap (props) {
  const { map } = props
  const { mapContainer, config } = map

  return (
    <div ref={mapContainer} style={{width: config.width, height: config.height}} />
  )
}

/***************************************************************************************************** */

/**
 * @function useMatildaMap
 * @param 
 */
export function useMatildaMap (configProps = {}, extraParamsProps = {}) {
  const { getTranslation, getLocale, getConfig } = useContext(MatildaContext)
  const [extraParams, setExtraParams] = useState(extraParamsProps)

  // imposto configurazione della componente
  const config = useMemo(() => {
    return Object.assign({
      defaultLng: 12,
      defaultLat: 44,
      defaultZoom: 4.5,
      width: '100%',
      height: '400px'
    }, configProps)
  }, [configProps])

  mapboxgl.accessToken = getConfig('mapbox_token')

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(config.defaultLng);
  const [lat, setLat] = useState(config.defaultLat); 
  const [zoom, setZoom] = useState(config.defaultZoom); 
  useEffect(() => {
    if (map.current || !mapContainer.current) return;
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

    // TODO marker on geocoder position
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
  }, [mapContainer.current])

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

  return { mapContainer, getLat, getLng, config }
}