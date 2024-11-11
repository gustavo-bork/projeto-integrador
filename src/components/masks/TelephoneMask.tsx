'use client'
import { forwardRef } from 'react'

import { IMaskInput } from 'react-imask'

export interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const TelephoneMask = forwardRef<HTMLInputElement, CustomProps>((props, ref) => {
  const { onChange, ...other } = props

  return (
    <IMaskInput
      {...other}
      mask='(00) 00000-0000'
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite />
  )
})
