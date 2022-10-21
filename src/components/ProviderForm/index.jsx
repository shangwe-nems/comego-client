/* eslint-disable react-hooks/exhaustive-deps */
import { Button, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { useNotifications } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { FaSave } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { BsCheck2, BsExclamationLg } from 'react-icons/bs';
import { IoHandRight } from 'react-icons/io5';
import { createProvider, updateProvider } from '../../redux/slices/providers';

const createProviderSchema = yup.object().shape({
    shop_name: yup.string().optional(),
    category: yup.string().optional(),
    city: yup.string().optional(),
    address: yup.string().optional(),
    contact: yup.string().optional(),
    ref_name: yup.string().optional(),
    ref_phone: yup.string().optional(),
})


function ProviderForm({ status, provider, handleClose }) {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const notifications = useNotifications()

    const form = useForm({
        validate: yupResolver(createProviderSchema),
        initialValues: {
            shop_name: '',
            category: '',
            city: '',
            address: '',
            contact: '',
            ref_name: '',
            ref_phone: '',
        },
        
    })

    useEffect(() => {
        if(provider !== null && status === 'edit') {
            form.setValues({
                shop_name: provider?.shop_name || '',
                category: provider?.category || '',
                city: provider?.city || '',
                address: provider?.address || '',
                contact: provider?.contact || '',
                ref_name: provider?.ref_name || '',
                ref_phone: provider?.ref_phone || '',
            })
        }
    }, [provider, status])

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        if(status === 'create') {
            const dataToSubmit = { 
                ...values, 
            }
  
            setTimeout(() => {
                dispatch(createProvider({ dataToSubmit }))
                    .then(res => {
                        if(res.payload) {
                            handleClose()
                            notifications.showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'Provider created successfully',
                                icon: <BsCheck2 size={20} />
                            })
                            setloading(false)
                        }
  
                        if(res.error.message === "Forbidden") {
                            setloading(false)
                            notifications.showNotification({
                                color: 'orange',
                                title: 'Forbidden',
                                message: 'You are not authorized to perfom this action!!',
                                icon: <IoHandRight size={20} />
                            })
                        }
                  
                        if(res.error.message !== "Forbidden") {
                            setloading(false)
                            notifications.showNotification({
                                color: 'red',
                                title: 'Error',
                                message: 'Something happened...',
                                icon: <BsExclamationLg size={20} />
                            })
                        }
                    })
            }, 1000);
            
        }
  
        if(status === 'edit') {
            dispatch(updateProvider({ 
                _id: provider?._id, 
                dataToSubmit: { 
                    ...values,
                }}))
            .then(res => {
                if(res.payload) {
                    handleClose()
                    notifications.showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'Provider created successfully',
                        icon: <BsCheck2 size={24} />
                    })
                    setloading(false)
                }
  
                if(res.error.message === "Forbidden") {
                    setloading(false)
                    notifications.showNotification({
                        color: 'orange',
                        title: 'Forbidden',
                        message: 'You are not authorized to perfom this action!!',
                        icon: <IoHandRight size={26} />
                    })
                }
          
                if(res.error.message !== "Forbidden") {
                    setloading(false)
                    notifications.showNotification({
                        color: 'red',
                        title: 'Error',
                        message: 'Something happened...',
                        icon: <BsExclamationLg size={24} />
                    })
                }
            })
        }
    }


    return (
        <div style={{borderTop: '1px solid #eaeaea', marginTop: -8}}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className='dates'>
                    <TextInput 
                        data-autofocus size='sm' variant="filled" 
                        label='Information du shop' description="Nom de la boutique :" 
                        style={{width:'49%'}}
                        {...form.getInputProps('shop_name')}
                    />
                    <TextInput 
                        size='sm' variant="filled" 
                        description="Categorie" style={{width:'49%'}}
                        {...form.getInputProps('category')}
                    />
                </div>

                <div className='dates'>
                    <TextInput 
                        variant="filled" description="Ville :" 
                        style={{width:'49%'}}
                        {...form.getInputProps('city')}
                    />
                    <TextInput 
                        variant="filled" description="Contact :" 
                        style={{width:'49%'}}
                        {...form.getInputProps('contact')}
                    />
                </div>
                <div className='dates'>
                    <TextInput 
                        variant="filled" icon={<GoLocation />} 
                        description="Adresse de la boutique :" style={{width:'100%'}}
                        {...form.getInputProps('address')}
                    />
                </div>

                <div className='dates'>
                    <TextInput 
                        variant="filled" label='Personne de réference' 
                        description="Nom complet :" style={{width:'49%'}}
                        {...form.getInputProps('ref_name')}
                    />
                    <TextInput 
                        variant="filled" description="Contact :" 
                        style={{width:'49%'}}
                        {...form.getInputProps('ref_phone')}
                    />
                </div>

                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
                    <Button size='sm' loading={loading} leftIcon={<FaSave />}  type='submit' color='gray'>Enregistrer</Button>
                </div>
            </form>
        </div>
    )
}

export default ProviderForm