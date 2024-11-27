'use client'

// Next imports
import { useRouter } from 'next/navigation'

// React imports
import { useEffect, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { toast } from 'react-toastify'
import { useLocalStorage } from 'react-use'

// Mapbox imports
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl, { NavigationControl, FullscreenControl, Marker } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Component imports
import SearchComponent from './Search'
import { Skeleton } from '@mui/material'

import type { AddressOption } from './types'

import axios from 'axios'

import { User } from '@prisma/client'

const Map = () => {
  const router = useRouter()

  // Refs
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  // States
  const [center, setCenter] = useState<LngLatLike>([-49.2730, -25.4277])
  const [zoom, setZoom] = useState(10.12)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [userData] = useLocalStorage<User>('userData')

  useEffect(() => {
    if (!userData) {
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

    const nav = new NavigationControl()
    map.current.addControl(nav)

    const fullscreen = new FullscreenControl()
    map.current.addControl(fullscreen)

    map.current.on('load', () => setIsMapLoaded(true))

    return () => map.current?.remove()
  }, [])

  const handleChange = (_: SyntheticEvent<Element, Event>, value: string | AddressOption | null) => {
    if (typeof value === 'string' || value === null) return

    const { center, place_name } = value

    const userId = userData?.id
    axios
      .post('/api/home', { center, place_name, userId })
      .then(() => {
        map.current?.flyTo({ center, essential: true, zoom })
        new Marker().setLngLat(center).addTo(map.current!)
        setCenter(center)
      })
      .catch(err => {
        if (axios.isAxiosError(err))
          toast.error(err.response?.data.message)
      })
  }

  return (
    <div>
      {isMapLoaded ? (
        <SearchComponent onChange={handleChange} />
      ) : (
        <Skeleton variant='rectangular' width={250} height={50} />
      )}
      <div style={{ width: '70vw', height: '70vh' }} id='map-container' ref={mapContainer} />
    </div>
  )
}

export default Map
