/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Select, TextInput } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form';
import { useNotifications } from '@mantine/notifications';
import React, { useEffect, useState } from 'react'
import { BsCheck2, BsExclamationLg } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import * as yup from "yup"
import { createMotive, updateMotive } from '../../redux/slices/motives';

const createPurchaseSchema = yup.object().shape({
    libelle: yup.string().required('libelle is required'),
    code: yup.string().required('code is required'),
    
})

function MotifForm({ status, data, handleClose }) {
    const [loading, setloading] = useState(false);

    const dispatch = useDispatch()
    const notifications = useNotifications()
    
    const form = useForm({
        validate: yupResolver(createPurchaseSchema),
        initialValues: {
          libelle: '',
          code: '',
        },
        validateInputOnChange: true
    })

    useEffect(() => {
        if(data !== null && status === 'edit') {
            form.setValues({
                libelle: data?.libelle || '',
                code: data?.code || '',
            })
        }
    }, [data, status])

    function handleSubmit(values, e) {
        e.preventDefault()
        setloading(true);
      
        if(status === 'create') {
            const dataToSubmit = { 
                ...values
            }
              
            setTimeout(() => {
                dispatch(createMotive({ dataToSubmit }))
                    .then(res => {
                        if(res?.payload) {
                            handleClose()
                            notifications.showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'Purchase created successfully',
                                icon: <BsCheck2 size={20} />
                            })
                            setloading(false)
                        }
  
                  
                        if(res?.error?.message === "Unauthorized") {
                            setloading(false)
                            notifications.showNotification({
                                color: 'red',
                                title: 'Error',
                                message: 'Something happened...',
                                icon: <BsExclamationLg size={20} />
                            })
                        }
                    })
                setloading(false)
            }, 1000);
            
        }
  
        if(status === 'edit') {
            dispatch(updateMotive({ _id: data?._id, dataToSubmit: { ...values }}))
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
                        label="Libellé de transaction :"
                        size="sm" variant="filled" 
                        style={{width:'100%'}} 
                        multiline
                        description="Description du libellé :" 
                        {...form.getInputProps('libelle')}
                    />
                </div>
                
                <div className='dates'>
                    <TextInput 
                        size="sm"
                        variant="filled" 
                        description="Code :" 
                        style={{width:'49%'}}
                        {...form.getInputProps('code')}
                    />

                    <Select
                        data={[{label:"Mouvement d'entrée", value:"in"}, {label:"Mouvement de sortie", value: "out"}]} 
                        size="sm" variant="filled" 
                        style={{width:'49%'}} 
                        multiline
                        description="Type de mouvement :" 
                        {...form.getInputProps('move')}
                    />
                </div>
                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
                    <Button size='sm' loading={loading} leftIcon={<FaSave />}  type='submit' color='gray'>Enregistrer</Button>
                </div>
            </form>
        </div>
    )
}

export default MotifForm