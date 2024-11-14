'use client'

import React, { useEffect, useRef, useState } from 'react'
import mapboxgl, { LngLatLike, NavigationControl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import SearchComponent from './Search'

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [center, setCenter] = useState<LngLatLike>([-49.2730, -25.4277])
  const [zoom, setZoom] = useState(10.12)

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    if (!mapContainer.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/gustavo-bork/cm3ewpfe1000001qv5hvy18jh',
      zoom,
      center
    })

    map.current.setLanguage("pt")
    map.current.on('move', () => {
      const mapCenter = map.current!.getCenter()
      const mapZoom = map.current!.getZoom()

      setCenter([mapCenter.lng, mapCenter.lat])
      setZoom(mapZoom)
    })

    const nav = new NavigationControl()
    map.current.addControl(nav)

    return () => map.current?.remove()
  }, [])


  return (
    <div>
      <SearchComponent map={map.current!} />
      <div className='h-[75vh] w-[90vw]' id='map-container' ref={mapContainer} />
    </div>
  )
}

export default Map
