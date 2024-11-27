'use client'

// React Imports
import { useState, useRef } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import {
  Typography,
  IconButton,
  InputAdornment,
  Checkbox,
  Button,
  FormControlLabel,
  Fade,
  CircularProgress,
  TextField
} from '@mui/material'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Component Imports
import Link from '@components/Link'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'
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

const LoginV2 = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [emailError, setEmailError] = useState(false)

  // Refs
  const emailRef = useRef<HTMLDivElement | null>(null)
  const passwordRef = useRef<HTMLDivElement | null>(null)

  // Vars
  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'

  // Hooks
  const router = useRouter()
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (emailRef.current === document.activeElement && passwordRef.current) {
        passwordRef.current?.focus()
      }
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (e.target.validity.valid) setEmailError(false)
  }

  const handleLogin = () => {
    if (emailError) return

    if (email.length > 0 && password.length > 0) {
      setSpinner(true)

      axios.post('/api/login', { email, password })
        .then(resp => {
          localStorage.setItem('userData', JSON.stringify(resp.data))
          router.push('/')
          setSpinner(false)
        })
        .catch(error => {
          console.error(error)
          setSpinner(false)
          if (error instanceof AxiosError) toast.error(error?.response?.data?.message)
        })
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
          <Fade in timeout={1000}>
            <MaskImg alt='mask' src={authBackground} className={classnames({ fontSize: theme.direction === 'ltr' })} />
          </Fade>
        )}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          {spinner ? (
            <CircularProgress />
          ) : (
            <>
              <div className='flex flex-col gap-1'>
                <Typography variant='h4'>Login</Typography>
              </div>
              <form
                noValidate
                autoComplete='off'
                onSubmit={e => {
                  e.preventDefault()
                  handleLogin()
                }}
                className='flex flex-col gap-5'
              >
                <TextField
                  fullWidth
                  id='email'
                  label='E-mail'
                  name='e-mail'
                  variant='standard'
                  color='secondary'
                  value={email}
                  onKeyDown={handleKeyDown}
                  onChange={handleEmailChange}
                  inputRef={emailRef}
                  onBlur={e => {
                    if (e.target.validity.valid) {
                      setEmailError(false)
                    } else {
                      setEmailError(true)
                    }
                  }}
                  error={emailError}
                  helperText={emailError ? 'Por favor, insira um e-mail válido' : ''}
                  inputProps={{
                    type: 'email'
                  }}
                />
                <TextField
                  fullWidth
                  label='Senha'
                  name='password'
                  id='password'
                  value={password}
                  type={isPasswordShown ? 'text' : 'password'}
                  variant='standard'
                  color='secondary'
                  inputRef={passwordRef}
                  onChange={e => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <div className='flex justify-between items-center gap-x-3 gap-y- flex-wrap'>
                  <FormControlLabel control={<Checkbox />} label='Lembrar-me' />
                  <Typography
                    className='text-end'
                    color='secondary'
                    component={Link}
                    onClick={e => {
                      e.preventDefault()
                      router.push('/forgot-password')
                    }}
                  >
                    Esqueci minha senha
                  </Typography>
                </div>
                <Button fullWidth variant='contained' type='submit' id='submit-button'>
                  Entrar
                </Button>
                <div className='flex justify-center items-center flex-wrap gap-2'>
                  <Typography
                    component={Link}
                    onClick={e => {
                      e.preventDefault()
                      router.push('/cadastro')
                    }}
                    color='secondary'
                  >
                    Criar conta
                  </Typography>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>)
}

export default LoginV2
