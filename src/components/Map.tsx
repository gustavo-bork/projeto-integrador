'use client'

// Next imports
import { useRouter } from 'next/navigation'

// React imports
import React, { useEffect, useRef, useState } from 'react'

// Mapbox imports
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl, { NavigationControl, FullscreenControl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Component imports
import SearchComponent from './Search'
import { Skeleton } from '@mui/material'

const Map = () => {
  const router = useRouter()

  // Refs
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  // States
  const [center, setCenter] = useState<LngLatLike>([-49.2730, -25.4277])
  const [zoom, setZoom] = useState(10.12)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/login')
    }
  }, [router])

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

    const fullscreen = new FullscreenControl()
    map.current.addControl(fullscreen)

    map.current.on('load', () => setIsMapLoaded(true))

    return () => map.current?.remove()
  }, [])


  return (
    <div>
      {isMapLoaded ? (
        <SearchComponent map={map.current!} />
      ) : (
        <Skeleton variant='rectangular' width={250} height={50} />
      )}
      <div style={{ width: '70vw', height: '70vh' }} id='map-container' ref={mapContainer} />
    </div>
  )
}

export default Map
