/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import * as yup from "yup"
import { useDispatch } from 'react-redux';
import { Button, TextInput } from '@mantine/core';
import { BsTelephone, BsEnvelope, BsCheck2, BsExclamationLg } from 'react-icons/bs'
import { FaSave } from 'react-icons/fa'
import './clientform.scss'
import { useForm, yupResolver } from '@mantine/form';
import { IoHandRight } from 'react-icons/io5';
import { createClient, updateClient } from '../../redux/slices/clients';
import { showNotification } from '@mantine/notifications';

const createClientSchema = yup.object().shape({
  names: yup.string().required('noms exigés'),
  reference: yup.string().required('reference exigé'),
  phone: yup.string().required('telephone exigé'),
  email: yup.string().optional(),
})

function ClientForm({ status, data, handleClose }) {
  const dispatch = useDispatch()

  const [loading, setloading] = useState(false);

  const form = useForm({
    validate: yupResolver(createClientSchema),
    initialValues: {
      names: '',
      reference: '',
      phone: '',
      email: '',
    },
    validateInputOnChange: ['names', 'phone']
})

  useEffect(() => {
    if(data !== null && status === 'edit') {
      form.setValues({
          names: data?.names || '',
          reference: data?.reference || '',
          phone: data?.phone || '',
          email: data?.email || '',
      })
  }
  }, [status, data])

  function handleSubmit(values, e){
    e.preventDefault()
    setloading(true);
    

    if(status === 'create') {
        const dataToSubmit = { 
            ...values
        }

        setTimeout(() => {
            dispatch(createClient({ dataToSubmit }))
                .then(res => {
                    if(res?.payload) {
                        handleClose()
                        showNotification({
                            color: 'green',
                            title: 'Success',
                            message: 'creation successful',
                            icon: <BsCheck2 size={20} />
                        })
                        setloading(false)
                    }

                    if(res?.error?.message === "Forbidden") {
                        setloading(false)
                        showNotification({
                            color: 'orange',
                            title: 'Forbidden',
                            message: 'You are not authorized to perfom this action!!',
                            icon: <IoHandRight size={20} />
                        })
                    }
              
                    if(res?.error?.message === "Unauthorized") {
                        setloading(false)
                        showNotification({
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
      dispatch(updateClient({ _id: data?._id, dataToSubmit: { ...values }}))
          .then(res => {
              if(res.payload) {
                  handleClose()
                  showNotification({
                      color: 'green',
                      title: 'Success',
                      message: 'update successful',
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
            variant='filled' size='sm' style={{width:'100%'}} 
            label="Identité Client :" data-autofocus className='textinput' 
            description="Noms :" 
            {...form.getInputProps('names')}
          />
        </div>
        <div className='dates'>
          <TextInput 
            variant='filled' size='sm' style={{width:'100%'}} 
            className='textinput' description="Reference" 
            {...form.getInputProps('reference')}
          />
        </div>
        <div className='dates'>
          <TextInput 
            type="tel" variant="filled" icon={<BsTelephone />} 
            label="Contacts" description='Telephone :' style={{width:'100%'}}
            {...form.getInputProps('phone')}
          />
        </div>
        <div className='dates'>
          <TextInput 
            type='email' variant="filled" icon={<BsEnvelope />} 
            description="Email :" style={{width:'100%'}}
            {...form.getInputProps('email')}
          />
        </div>
        <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 18}}>
            <Button loading={loading} leftIcon={<FaSave />}  type='submit' color='gray' size='sm'>Save</Button>
        </div>
      </form>
    </div>
  )
}

export default ClientForm