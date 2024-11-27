// React imports
import { useMemo, useCallback, useState } from 'react'
import type { SyntheticEvent } from 'react'

// Axios import
import axios from 'axios'

// MUI imports
import { TextField, Grid, debounce } from '@mui/material'

// Custom MUI imports
import CustomAutocomplete from '@core/components/mui/Autocomplete'

import type { AddressOption } from './types'

interface SearchProps {
  onChange: (_: SyntheticEvent<Element, Event>, value: string | AddressOption | null) => void
}

export const SearchComponent = ({ onChange }: SearchProps) => {
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

  const debouncedSearch = useMemo(
    () => debounce(searchLocation, 500),
    [searchLocation]
  )

  return (
    <Grid container spacing={2} paddingBottom={2} paddingLeft={2}>
      <CustomAutocomplete
        freeSolo
        open={open}
        loading={loading}
        filterOptions={(option) => option}
        loadingText="Carregando..."
        noOptionsText="Nenhum endereço encontrado"
        sx={{ width: 250 }}
        options={addresses}
        getOptionLabel={option => typeof option === 'string' ? option : option.place_name}
        onChange={onChange}
        onInputChange={(_, newValue) => debouncedSearch(newValue)}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderInput={params => (
          <TextField
            {...params}
            label="Pesquisar um local"
          />
        )}
      />
    </Grid>
  )
}

export default SearchComponent
