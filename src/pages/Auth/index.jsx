/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Button, Checkbox, PasswordInput, TextInput } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { MdOutlineMailOutline, MdLockOutline } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { FiLogIn } from "react-icons/fi";
import { yupResolver } from  '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from "yup"
import './auth.scss'
import { showNotification } from '@mantine/notifications';
import { login } from '../../redux/slices/sessions';
import { BsAlarmFill, BsExclamationTriangle, BsX } from 'react-icons/bs';

const createSessionSchema = yup.object().shape({
    email: yup.string().required('email is required').email('not a valid email'),
    password: yup.string().required('password is required').min(6, 'password should be 6 chars minimum').max(24),
    remember: yup.boolean().optional()
})

function LoginPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [signInError, setSignInError] = useState(null)
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const {
        register,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        mode: "onChange",
        resolver: yupResolver(createSessionSchema)
    })

    useEffect(() => {
      const expired = searchParams.get('expired');
      const data = localStorage.getItem('rememberMe')

      if(data) {
        setValue('email', data)
        setValue('remember', true)
      }

      if(expired) {
        showNotification({
            color: "cyan",
            icon: <BsAlarmFill />,
            title: 'Oops!',
            message: 'Votre session a expiré...',
        })
      }


    },[])
    

    function onSubmit(values) {
        setLoading(true);

        const checked = values?.remember;

        if(checked) {
            localStorage.setItem('rememberMe', values?.email)
        } else {
            localStorage.removeItem('rememberMe')
        }

        setTimeout(() => {            
            dispatch(login(values))
                .then(async res => {
                    if(res?.payload) {
                        sessionStorage.setItem('accessToken', res?.payload?.accessToken)
                        sessionStorage.setItem('refreshToken', res?.payload?.refreshToken)
                        navigate(`/auth/dashboard`, {replace: true})
                    }

                    if(res?.error) {
                        setSignInError('Wrong id or password');
                        showNotification({
                            color: "red",
                            title: 'Wrong id or password!',
                            message: 'Please check your credentials...',
                            icon: <BsX size={24} />
                        })
                        setTimeout(() => {
                            setSignInError('')
                        }, 5000);
                    }
                })
            setLoading(false)
        }, 500);
        
    }

    return (
    <div className='signin-in' style={{margin:0, padding: 0}}>
        <div className='loginthing' style={{margin:0, padding: 0}}>
            <div className='cmp-info'>
                <div className="context">
                    <img src='./logo-print.svg' alt='Logo'/>
                </div>
                <div className='area'>
                    <ul className='circles'>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
            </div>
            <div className='login-in-sec' style={{margin:0, padding: 0}}>
                
            </div>
            <div className='login-sec'>
                <h3 id='signin-sec'>Se connecter</h3>
                <p className='error'>{signInError ? <span id="error" style={{color: 'red'}}><BsExclamationTriangle  />{signInError}</span> : ''}</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='formField'>
                        <TextInput 
                            size='xs'
                            key='email'
                            id='email'
                            label='Identifiant :'
                            {...register('email')}
                            icon={<MdOutlineMailOutline />}
                            type='email'
                            placeholder='Votre identifiant'
                            onChange={(e) => setValue('email', e.target.value, { shouldValidate: true})}
                            error={errors.email ? <span id="error"><IoWarningOutline  />{errors.email?.message}</span> : null}
                        />
                    </div>
                    <div className='formField'>
                        <PasswordInput 
                            size='xs'
                            key='password'
                            label='Mot de passe :'
                            {...register('password')}
                            icon={<MdLockOutline />}
                            placeholder='Votre mot de passe'
                            onChange={(e) => setValue('password', e.target.value, { shouldValidate: true})}
                            error={errors.password ? <span id="error"><IoWarningOutline  />{errors.password?.message}</span> : null}
                        />
                    </div>
                    
                    <div className="fgtpwd">
                        <Checkbox 
                            label='Se souvenir de moi' size='xs' color='green' 
                            onChange={(e) => setValue('remember', e.target.checked)} 
                        />
                        <a href='/reset-password' style={{fontSize:12}}>Mot de passe oublié?</a>
                    </div>
                    <Button compact loading={loading} leftIcon={<FiLogIn />} type='submit' color='red' fullWidth size='md'>Se connecter</Button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default LoginPage