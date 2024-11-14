// React imports
import { useState } from 'react'

// Mapbox imports
import type { Map } from 'mapbox-gl'
import { Marker } from 'mapbox-gl'

// MUI imports
import { TextField, Button, Grid, Skeleton } from '@mui/material'

export const SearchComponent = ({ map }: { map: Map }) => {
  const [query, setQuery] = useState('')

  const searchLocation = async () => {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}`)
    const data = await response.json()
    const [longitude, latitude] = data.features[0].center

    map.flyTo({ center: [longitude, latitude], essential: true, zoom: 16 })
    new Marker().setLngLat([longitude, latitude]).addTo(map)

  }

  return (
    <Grid container spacing={2} paddingBottom={2} paddingLeft={2}>
      {map ? (
        <>
          <Skeleton variant='rectangular' width={160} height={40}/>
          <Skeleton variant='rectangular' width={40} height={40} />
        </>
      ) : (
        <>
          <TextField
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            label='Pesquisar um local'
          />
          <Button
            variant='outlined'
            onClick={searchLocation}
          >
            <i className='tabler-search' />
          </Button>
        </>
      )
      }
    </Grid >
  )
}

export default SearchComponent
