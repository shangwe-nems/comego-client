/* eslint-disable react-hooks/exhaustive-deps */
import { Button, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { showNotification, useNotifications } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { FaSave } from 'react-icons/fa';
import { BsCheck2, BsExclamationLg } from 'react-icons/bs';
import { IoHandRight } from 'react-icons/io5';
import { createStock, updateStock } from '../../redux/slices/stocks';

const createProviderSchema = yup.object().shape({
    designation: yup.string().optional(),
    revient_price: yup.string().optional(),
})


function ServiceForm({ status, provider, handleClose }) {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const notifications = useNotifications()

    const form = useForm({
        validate: yupResolver(createProviderSchema),
        initialValues: {
            designation: '',
            revient_price: '',
        },
        
    })

    useEffect(() => {
        if(provider !== null && status === 'edit') {
            form.setValues({
                designation: provider?.designation || '',
                revient_price: provider?.revient_price || ''
            })
        }
    }, [provider, status])

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        if(status === 'create') {
            const dataToSubmit = { 
                ...values, 
                category: 'service',
                unit: 'unit',
                pv_min: (parseFloat(values?.revient_price * 0.2) + parseFloat(values?.revient_price)),
                qty: 1,
                qty_min: 1
            }
  
            setTimeout(() => {
                dispatch(createStock({ dataToSubmit }))
                    .then(res => {
                        if(res.payload) {
                            handleClose()
                            notifications.showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'Service created successfully',
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
            dispatch(updateStock({ 
                _id: provider?._id, 
                dataToSubmit: { 
                    ...values,
                }}))
            .then(res => {
                if(res.payload) {
                    handleClose()
                    showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'Provider created successfully',
                        icon: <BsCheck2 size={24} />
                    })
                    setloading(false)
                }
  
                if(res.error.message === "Forbidden") {
                    setloading(false)
                    showNotification({
                        color: 'orange',
                        title: 'Forbidden',
                        message: 'You are not authorized to perfom this action!!',
                        icon: <IoHandRight size={26} />
                    })
                }
          
                if(res.error.message !== "Forbidden") {
                    setloading(false)
                    showNotification({
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
                        label='Information du service a éffectuer' description="Nom du service :" 
                        style={{width:'100%'}}
                        {...form.getInputProps('designation')}
                    />
                </div>

                <div className='dates'>
                    <TextInput 
                        variant="filled" description="Prix de revient :" 
                        style={{width:'100%'}}
                        {...form.getInputProps('revient_price')}
                    />
                </div>

                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
                    <Button size='sm' loading={loading} leftIcon={<FaSave />}  type='submit' color='gray'>Enregistrer</Button>
                </div>
            </form>
        </div>
    )
}

export default ServiceForm