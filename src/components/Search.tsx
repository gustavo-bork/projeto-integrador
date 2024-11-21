// React imports
import { SyntheticEvent, useCallback, useState } from 'react'

// Mapbox imports
import type { Map } from 'mapbox-gl'
import { Marker } from 'mapbox-gl'

// MUI imports
import { TextField, Grid, Skeleton } from '@mui/material'

// Custom MUI imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'
import axios from 'axios'

interface AddressOption {
  place_name: string
  center: [number, number]
}

export const SearchComponent = ({ map }: { map: Map }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState<AddressOption[]>([])

  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    const access_token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!
    const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token,
          autocomplete: true,
          limit: 5
        }
      }
    )

    const addressOptions = response.data.features.map((feature: any): AddressOption => ({
      place_name: feature.place_name,
      center: feature.center
    }))

    setAddresses(addressOptions)
    setLoading(false)


  }, [])

  const handleChange = (event: SyntheticEvent<Element, Event>, value: string | AddressOption | null) => {
    if (typeof value === 'string' || value === null) return

    const [longitude, latitude] = value.center
    map.flyTo({ center: [longitude, latitude], essential: true, zoom: 16 })
    new Marker().setLngLat([longitude, latitude]).addTo(map)
  }

  return (
    <Grid container spacing={2} paddingBottom={2} paddingLeft={2}>
      {!map ? (
        <>
          <Skeleton variant='rectangular' width={250} height={50} />
        </>
      ) : (
        <>
          <CustomAutocomplete
            freeSolo
            open={open}
            loading={loading}
            sx={{ width: 250 }}
            options={addresses}
            getOptionLabel={option => typeof option === 'string' ? option : option.place_name}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={handleChange}
            onInputChange={(_, location) => searchLocation(location)}
            renderInput={params => (<TextField {...params} label="Pesquisar um local" />)}
          />
        </>
      )
      }
    </Grid >
  )
}

export default SearchComponent
