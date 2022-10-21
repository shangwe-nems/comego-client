/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Text, NumberInput, TextInput } from '@mantine/core';
import React, { useEffect, useState } from 'react'
import { FaRegSave } from 'react-icons/fa';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { useNotifications } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { BsCheck2, BsExclamationLg } from 'react-icons/bs';
import { updateStock } from '../../redux/slices/stocks';
import { IoHandRight } from 'react-icons/io5';

function PVForm({ status, stock, handleClose }) {
  const dispatch = useDispatch()
  const notifications = useNotifications()
  const [loading, setloading] = useState(false);

  const form = useForm({
      validate: {
        designation: (value) => (value.length < 1 ? 'designation is required' : null),
        pv_medium: (value) => (value > stock?.pv_min ? null : `must be > ${stock?.pv_min} `),
        pv_gen: (value, values) => (value < values.pv_medium ? `must > ${values?.pv_medium}` : null),
      },
      validateInputOnChange: true
  })

  useEffect(() => {
      if(stock !== null && status === 'edit') {
          form.setValues({
              designation: stock?.designation || '',
              pv_medium: stock?.pv_medium || 0,
              pv_gen: stock?.pv_gen || 0,
          })
      }
  }, [stock, status])

  function handleSubmit(values, e){
      e.preventDefault()
      setloading(true);

      if(status === 'edit') {
          dispatch(updateStock({ _id: stock?._id, dataToSubmit: { ...values }}))
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
                      icon: <IoHandRight size={18} />
                  })
              }
        
              if(res.error.message !== "Forbidden") {
                  setloading(false)
                  notifications.showNotification({
                      color: 'red',
                      title: 'Error',
                      message: 'Something happened...',
                      icon: <BsExclamationLg size={18} />
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
            size='sm' variant="filled" style={{width:'100%'}} 
            label="Designation du produit :" required withAsterisk
            description="Inserez le nom du produit de maniere concise."
            disabled
            {...form.getInputProps('designation')}
          />
        </div>
        <div className='dates'>
          <TextInput
            size='sm' variant="filled" label='Prix de vente :' 
            description="Prix de vente moyen" 
            icon={<Text size='xs' color="dimmed" style={{marginLeft:2}}>USD</Text>} 
            style={{width:'49%'}} {...form.getInputProps('pv_medium')}
          />
          <TextInput
            size='sm' variant="filled" description="Prix de vente gen :"
            icon={<Text size='xs' color="dimmed" style={{marginLeft:2}}>USD</Text>} 
            style={{width:'49%'}} {...form.getInputProps('pv_gen')}
          />
        </div>
        <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
            <Button size='sm' loading={loading} leftIcon={<FaRegSave />}  type='submit' color='gray'>Enregistrer</Button>
        </div>
      </form>
    </div>
  )
}

export default PVForm