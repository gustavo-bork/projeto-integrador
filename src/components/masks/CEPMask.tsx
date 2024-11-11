import { forwardRef } from 'react'
import { IMaskInput } from 'react-imask'

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const CEPMask = forwardRef<HTMLInputElement, CustomProps>((props, ref) => {
  const { onChange, ...other } = props
  return (
    <IMaskInput
      {...other}
      mask='00000-000'
      definitions={{
        '#': /[1-9]/
      }}
      inputRef={ref}
      onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  )
})
