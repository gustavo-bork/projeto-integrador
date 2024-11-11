'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  MobileStepper,
  TextField,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'

import classnames from 'classnames'

import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
import type { SystemMode } from '@core/types'

import { TelephoneMask } from '@components/masks/TelephoneMask'
import { CEPMask } from '@components/masks/CEPMask'

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

type UserData = {
  name: string
  document: string
  email: string
  telephone: string
  cep: string
  street: string
  number: number
  neighborhood: string
  state: string
  city: string
  password: string
  confirmPassword: string
}

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [activeStep, setActiveStep] = useState(0)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const [userData, setUserData] = useState<UserData>({
    document: '',
    name: '',
    email: '',
    telephone: '',
    cep: '',
    street: '',
    number: 0,
    neighborhood: '',
    state: '',
    city: '',
    password: '',
    confirmPassword: ''
  })

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'

  // Hooks
  const { settings } = useSettings()
  const router = useRouter()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleNext = () => {
    if (activeStep < 1) setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        {!hidden && (
          <MaskImg alt='mask' src={authBackground} className={classnames({ fontSize: theme.direction === 'ltr' })} />
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='flex flex-col flex-grow gap-2 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Cadastro</Typography>
          </div>
          <form
            noValidate
            autoComplete='off'
            className='flex flex-col gap-5'
            onSubmit={e => {
              e.preventDefault()
              router.push('/kanban')
            }}
          >
            <div style={{ display: activeStep === 0 ? '' : 'none' }}>
              <div className='flex flex-col gap-1'>
                <Typography variant='h6'>Informações da conta</Typography>
              </div>
              <TextField
                className='my-2'
                fullWidth
                name='name'
                id='name-input'
                label='Nome'
                variant='outlined'
                color='secondary'
                value={userData.name}
                onKeyDown={handleKeyDown}
                onChange={handleChange}
              />
              <TextField
                className='my-2'
                fullWidth
                id='email-input'
                name='email'
                label='E-mail'
                variant='outlined'
                color='secondary'
                onKeyDown={handleKeyDown}
                value={userData.email}
                onChange={handleChange}
              />
              <TextField
                className='my-2'
                fullWidth
                name='telephone'
                id='cellphone-input'
                label='Telefone'
                variant='outlined'
                color='secondary'
                onKeyDown={handleKeyDown}
                InputProps={{
                  inputComponent: TelephoneMask as any
                }}
                value={userData.telephone}
                onChange={handleChange}
              />
              <TextField
                className='my-2'
                fullWidth
                name='password'
                label='Senha'
                id='password-input'
                type={isPasswordShown ? 'text' : 'password'}
                variant='outlined'
                color='secondary'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setIsPasswordShown(!isPasswordShown)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={userData.password}
                onChange={handleChange}
              />
              <TextField
                className='my-2'
                fullWidth
                name='confirm-password'
                label='Confirmar senha'
                id='confirm-password-adornment'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                variant='outlined'
                color='secondary'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={userData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: activeStep === 1 ? '' : 'none' }}>
              <div className='flex flex-col gap-1'>
                <Typography variant='h6'>Informações de endereço</Typography>
              </div>
              <TextField
                className='my-2'
                fullWidth
                name='cep'
                id='zip-code'
                label='CEP'
                variant='outlined'
                color='secondary'
                value={userData.cep}
                onChange={handleChange}
                InputProps={{
                  inputComponent: CEPMask as any
                }}
                onKeyDown={handleKeyDown}
              />
              <TextField
                className='my-2'
                fullWidth
                name='street'
                id='street'
                label='Rua'
                variant='outlined'
                color='secondary'
                value={userData.street}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <TextField
                className='my-2'
                fullWidth
                id='number'
                label='Número'
                variant='outlined'
                color='secondary'
                value={userData.number}
                onChange={handleChange}
              />
              <TextField
                className='my-2'
                fullWidth
                id='complement'
                label='Complemento'
                variant='outlined'
                color='secondary'
              />
              <TextField
                className='my-2'
                fullWidth
                name='neighborhood'
                id='neighborhood'
                label='Bairro'
                variant='outlined'
                color='secondary'
                value={userData.neighborhood}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <TextField
                className='my-2'
                fullWidth
                name='state'
                id='state'
                label='Estado'
                variant='outlined'
                color='secondary'
                value={userData.state}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              <TextField
                className='my-2'
                fullWidth
                name='city'
                id='city'
                label='Cidade'
                variant='outlined'
                color='secondary'
                value={userData.city}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </form>
          <MobileStepper
            sx={{ backgroundColor: 'background.paper', color: 'background.paper' }}
            variant='dots'
            steps={4}
            activeStep={activeStep}
            position='static'
            nextButton={
              activeStep < 1 ? (
                <Button size='small' onClick={handleNext}>
                  Próximo
                  <i className='tabler-arrow-right' />
                </Button>
              ) : (
                <Button size='small' onClick={handleNext}>
                  Finalizar
                </Button>
              )
            }
            backButton={
              <Button size='small' onClick={handleBack}>
                <i className='tabler-arrow-left' />
                Voltar
              </Button>
            }
          />
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography
              color='secondary'
              component={Link}
              onClick={e => {
                e.preventDefault()
                router.push('/login')
              }}
            >
              Voltar para Login
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
