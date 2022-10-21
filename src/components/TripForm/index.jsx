/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { useNotifications } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { TextInput, NumberInput, Text, Button } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { FaSave } from 'react-icons/fa';
import { createTravel, updateTravel } from '../../redux/slices/travels';
import { BsCheck2, BsExclamationLg } from 'react-icons/bs';
import { IoHandRight } from 'react-icons/io5';

const createTravelSchema = yup.object().shape({
    departure: yup.string().optional(),
    arrival: yup.string().optional(),
    city: yup.string().optional(),
    reference: yup.string().optional(),
    total_fees: yup.number().optional(),
    purchase_global_fees: yup.number().optional(),
    currency: yup.string().optional(),
    exchange_rate: yup.number().optional(),
    coefficient : yup.number().optional(),
    margin : yup.number().optional()
})

function TripForm({ status, travel, handleClose }) {
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false);
    const [coeff, setcoeff] = useState(0.00)
    const notifications = useNotifications()

    const form = useForm({
        validate: yupResolver(createTravelSchema),
        initialValues: {
            departure: '',
            arrival: '',
            city: '',
            reference: '',
            total_fees: 0,
            purchase_global_fees: 0,
            currency: '',
            exchange_rate: 0,
            coefficient : 0,
            margin : 0.2
        }
    })

    useEffect(() => {
        if(travel !== null && status === 'edit') {
            form.setValues({
                departure: new Date(travel?.departure.slice(0,10)) || '',
                arrival: new Date(travel?.arrival.slice(0,10)) || '',
                city: travel?.city || '',
                reference: travel?.reference || '',
                total_fees: travel?.total_fees || 0,
                purchase_global_fees: travel?.purchase_global_fees || 0,
                currency: travel?.currency || '',
                exchange_rate: travel?.exchange_rate || 0,
                coefficient : travel?.coefficient || 0,
                margin : travel?.margin || 0.2
            })
        }
    }, [travel, status])

    const handleCoeff = (e) => {
        const tot_frais = parseFloat(document.getElementsByName('tot_frais')[0].value);
        const tot_achat = parseFloat(document.getElementsByName('tot_achat')[0].value);

        let coeff = parseFloat(tot_frais / tot_achat)
        
        // setcoeff(coeff);
        form.setFieldValue("coefficient", coeff)

    }

    const normalizeDate = (date) => {
        const myDate = new Date(date);
        myDate.setDate(myDate.getDate() + parseInt(1));
        return myDate.toISOString()
    }

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        const departure = normalizeDate(values.departure)
        const arrival = normalizeDate(values.arrival)

        if(status === 'create') {
            const dataToSubmit = { 
                ...values, 
                departure,
                arrival
            }
  
            setTimeout(() => {
                dispatch(createTravel({ dataToSubmit }))
                    .then(res => {
                        if(res.payload) {
                            handleClose()
                            notifications.showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'Purchase created successfully',
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
            }, 1000);
            
        }
  
        if(status === 'edit') {
            dispatch(updateTravel({ 
                _id: travel?._id, 
                dataToSubmit: { 
                    ...values,
                    departure,
                    arrival
                }}))
            .then(res => {
                if(res.payload) {
                    handleClose()
                    notifications.showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'Purchase created successfully',
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
                    <DatePicker 
                        size='sm' variant="filled" 
                        description="Date de départ : "  style={{width:'49%'}}
                        {...form.getInputProps('departure')}
                    />
                    <DatePicker 
                        size='sm' variant="filled" 
                        description="Date d'arrivée : " style={{width:'49%'}} 
                        {...form.getInputProps('arrival')}
                    />
                </div>

                <div className='dates'>
                    <TextInput 
                        size='sm' variant="filled" 
                        description="Ville : " style={{width:'49%'}}
                        {...form.getInputProps('city')}
                    />
                    <TextInput 
                        size='sm' variant="filled" 
                        description="Personne de reference : " 
                        style={{width:'49%'}} 
                        {...form.getInputProps('reference')}
                    />
                </div>

                <div className='dates'>
                    <NumberInput 
                        defaultValue={0}
                        precision={2}
                        name='tot_frais'
                        onSelect={handleCoeff}
                        size='sm' variant="filled" description="Total frais : " 
                        rightSection={<Text size='xs' color="dimmed">$</Text>} style={{width:'49%'}}
                        {...form.getInputProps('total_fees')}
                    />
                    <NumberInput
                        precision={2}
                        defaultValue={0}
                        name='tot_achat'
                        onSelect={handleCoeff}
                        size='sm' variant="filled" description="Achat global (frais) : " 
                        rightSection={<Text size='xs' color="dimmed">$</Text>} style={{width:'49%'}} 
                        {...form.getInputProps('purchase_global_fees')}
                    />
                </div>

                <div className='dates'>
                    <TextInput 
                        size='sm' variant="filled" 
                        description="Devise : " style={{width:'49%'}}
                        {...form.getInputProps('currency')}
                    />
                    <NumberInput 
                        precision={2} min={0} size='sm' variant="filled" 
                        description="Taux : " style={{width:'49%'}} 
                        {...form.getInputProps('exchange_rate')}
                    />
                </div>

                <div className='dates'>
                    <NumberInput 
                        defaultValue={0} precision={3} min={0} value={coeff} 
                        size='sm' variant="filled" description="Coefficient : " style={{width:'49%'}}
                        {...form.getInputProps('coefficient')}
                    />
                    <NumberInput 
                        precision={2} value={0.2} min={0} size='sm' variant="filled" 
                        description="Marge : " style={{width:'49%'}} 
                        {...form.getInputProps('margin')}
                    />
                </div>

                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
                    <Button size='sm' loading={loading} leftIcon={<FaSave />}  type='submit' color='gray'>Enregistrer</Button>
                </div>
            </form>
        </div>
    )
}

export default TripForm