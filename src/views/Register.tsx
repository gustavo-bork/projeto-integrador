'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
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
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'

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
  email: string
  password: string
  confirmPassword: string
}

const Register = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const handleRegister = () => {
    if (emailError || nameError || passwordError) return

    if (userData.name.length === 0) {
      setNameError(true)
      return
    }

    if (userData.email.length === 0) {
      setEmailError(true)
      return
    }

    if (userData.password.length === 0) {
      setPasswordError(true)
      return
    }

    setLoading(true)
    axios.post('/api/register', userData)
      .then(resp => {
        setLoading(false)
        localStorage.setItem('userData', JSON.stringify({
          name: userData.name,
          email: userData.email,
          id: resp.data.id
        }))

        router.push('/')
      })
      .catch(error => {
        setLoading(false)
        console.error(error)
        if (error instanceof AxiosError)
          toast.error(error?.response?.data?.message)
      })
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
          <div>
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
              onBlur={() => {
                if (userData.name.length > 0) {
                  setNameError(false)
                } else {
                  setNameError(true)
                }
              }}
              error={nameError}
              helperText={nameError ? 'Insira um nome' : ''}
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
              onBlur={e => {
                if (userData.email.length > 0 && e.target.validity.valid) {
                  setEmailError(false)
                } else {
                  setEmailError(true)
                }
              }}
              error={emailError}
              helperText={emailError ? 'Insira um e-mail válido' : ''}
              inputProps={{
                type: 'email'
              }}
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
              error={passwordError}
              helperText={passwordError ? 'As senhas não correspondem' : ''}
            />
            <TextField
              className='my-2'
              fullWidth
              name='confirmPassword'
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
              onBlur={() => {
                if (userData.password === userData.confirmPassword) {
                  setPasswordError(false)
                } else {
                  setPasswordError(true)
                }
              }}
            />
          </div>
          <div className='py-3 flex justify-center items-center flex-wrap gap-2'>
            <Button
              fullWidth
              variant='contained'
              onClick={handleRegister}
            >
              {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
            </Button>
          </div>
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
