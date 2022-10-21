/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Select, TextInput } from '@mantine/core';
import React, { useState } from 'react'
import { FaRegSave } from 'react-icons/fa'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { useNotifications } from '@mantine/notifications';
import './userform.scss'
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../redux/slices/users';
import { BsCheck2, BsExclamationLg } from 'react-icons/bs';
import { useEffect } from 'react';
import { IoHandRightSharp } from 'react-icons/io5';

const createUserSchema = yup.object().shape({
    first_name: yup.string().min(2).max(120),
    last_name: yup.string().min(2).max(120),
    user_role: yup.string().max(44),
    email: yup.string().email('not a valid email').max(50),
    phone: yup.string().min(10).max(18)
})

function UserForm({status, user, handleClose}) {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const [data, setData] = useState(['Super User','Administrator', 'Finance', 'Logisitic', 'Agent', 'Delivery']);
    const notifications = useNotifications()

    const form = useForm({
        validate: yupResolver(createUserSchema),
        initialValues: {
            first_name :  '', 
            last_name :  '', 
            phone : '', 
            email: '', 
            user_role: '',
        },
        
    })

    useEffect(() => {
        if(user !== null && status === 'edit') {
            form.setValues({
                first_name :  user?.first_name || '', 
                last_name :  user?.last_name || '', 
                phone : user?.phone || '', 
                email: user?.email || '', 
                user_role: user?.user_role || '',
            })
        }
    }, [user, status])
    

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        if(status === 'create') {
            const dataToSubmit = { 
                ...values, 
                password: (values.email).charAt(0).toUpperCase() + (values.email).slice(1),
                passwordConfirmation: (values.email).charAt(0).toUpperCase() + (values.email).slice(1),
                isActive: true,
                isAvailable: false
            }

            setTimeout(() => {
                dispatch(createUser({ dataToSubmit }))
                    .then(res => {
                        if(res.payload) {
                            handleClose()
                            notifications.showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'User created successfully',
                                icon: <BsCheck2 size={24}/>
                            })
                            setloading(false)
                        }

                        if(res.error.message === "Forbidden") {
                            setloading(false)
                            notifications.showNotification({
                                color: 'red',
                                title: 'Forbidden',
                                message: 'You are not authorized to perfom this action!!',
                                icon: <IoHandRightSharp size={26} />
                            })
                        }
                  
                        if(res.error.message !== "Forbidden") {
                            setloading(false)
                            notifications.showNotification({
                                color: 'red',
                                title: 'Error',
                                message: 'Something happened',
                                icon: <BsExclamationLg />
                            })
                        }
                    })
            }, 1000);
            
        }

        if(status === 'edit') {
            dispatch(updateUser({ _id: user?._id, dataToSubmit: { ...values }}))
            .then(res => {
                if(res.payload) {
                    handleClose()
                    notifications.showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'User created successfully',
                        icon: <BsCheck2 size={24}/>
                    })
                    setloading(false)
                }

                if(res.error.message === "Forbidden") {
                    setloading(false)
                    notifications.showNotification({
                        color: 'red',
                        title: 'Forbidden',
                        message: 'You are not authorized to perfom this action!!',
                        icon: <IoHandRightSharp size={26} />
                    })
                }
          
                if(res.error.message !== "Forbidden") {
                    setloading(false)
                    notifications.showNotification({
                        color: 'red',
                        title: 'Error',
                        message: 'Something happened',
                        icon: <BsExclamationLg />
                    })
                }
            })
        }
        
    }
    
    return (
        <div style={{borderTop:'1px solid #eaeaea', marginTop: -8}}> 
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className='dates'>
                    <TextInput 
                        variant="filled" size="sm"   label="User Names :" className='textinput' description="First Name" 
                        style={{width: '49%'}} 
                        key='first_name' 
                        {...form.getInputProps('first_name')}
                    />
                    <TextInput 
                        variant="filled" size="sm"   className='textinput' description="Last Name" 
                        style={{width: '49%'}} 
                        key='last_name' 
                        {...form.getInputProps('last_name')}
                    />
                </div>
                <div className='dates'>
                    <Select 
                        data={data}
                        size="sm" 
                        label='Role' 
                        className='textinput' 
                        nothingFound="Nothing found"
                        searchable
                        creatable
                        getCreateLabel={(query) => `+ Create ${query}`}
                        onCreate={(query) => setData((current) => [...current, query])}
                        style={{width: '100%'}}
                        key='user_role' 
                        {...form.getInputProps('user_role')}
                    />
                </div>
                <div className='dates'>
                    <TextInput 
                        variant="filled" size="sm"   label="Contacts :" className='textinput' description="Phone :" 
                        style={{width: '49%'}} 
                        key='phone' 
                        {...form.getInputProps('phone')}
                    />
                    <TextInput 
                        variant="filled" size="sm"   className='textinput' description="Email :" 
                        style={{width: '49%'}} 
                        key='email' 
                        {...form.getInputProps('email')}
                    />
                </div>
                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
                    <Button loading={loading} leftIcon={<FaRegSave size={18} />}  type='submit' color='gray' size='sm'>{status === 'create' ? 'Save' : 'Save updates'}</Button>
                </div>
            </form>
        </div>
    )
}

export default UserForm