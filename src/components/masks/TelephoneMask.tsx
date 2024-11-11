'use client'
import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'
import { CustomProps } from './Register'

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
