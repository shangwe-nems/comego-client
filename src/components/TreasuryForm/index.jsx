/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { ActionIcon, Button, Divider, Modal, NumberInput, Select, Text, TextInput, Title } from '@mantine/core';
import { FaRegSave } from 'react-icons/fa';
import { BsCheck2, BsExclamationLg, BsPlus, BsQuestionOctagonFill } from 'react-icons/bs';
import MotifForm from '../MotifForm';
import { useForm, yupResolver } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from "yup";
import { useNotifications } from '@mantine/notifications';
import { IoHandRight } from 'react-icons/io5';
import { createTreasury, updateTreasury } from '../../redux/slices/treasurys';
import { updateClient } from '../../redux/slices/clients';
import { updateProvider } from '../../redux/slices/providers';
import { _getTodayCash } from '../../services/lib/invoice';


function TreasuryForm({ status, data, handleClose, client, prov }) {
    const dispatch = useDispatch()
    const notifications = useNotifications()
    const lastTrans = useSelector(state => state.treasurys)
    const motives = useSelector(state => state.motives)
    const [loading, setloading] = useState(false);
    const [provider, setprovider] = useState(false);
    const [selectedTrans, setselectedTrans] = useState()

    const form = useForm({
        validate: {
            category: (value) => (
                value === 'expense' && lastTrans.length === 0 ? 
                'Invalid transaction' : null
            ),
            designation_id: (value) => (value.length < 1 ? 'libelle required' : null),
            motive: (value) => (value.length < 5 ? 'motive required' : null),
            amount: (value, data) => (
                (lastTrans.length === 0 && data?.category === 'expense') ? 
                'invalid'
                : (value > lastTrans[lastTrans.length - 1]?.balance && data?.category === 'expense' ? 
                `must be <= ${lastTrans[lastTrans.length - 1].balance}` 
                : (prov && value > prov.dette) ? `must be <= ${prov.dette}` : 
                (client && value > client.dette) ? `must be <= ${client.dette}` : null)
            )
        },
        initialValues: {
          category: client ? 'income' : prov ? 'expense' : '',
          designation_id: '',
          motive: client ? client?.names : prov ? prov?.shop_name : '',
          amount: 0,
        },
        validateInputOnChange: true
    })
  
    useEffect(() => {
        if(data !== null && status === 'edit') {
            form.setValues({
                category: data?.category || '',
                designation_id: data?.designation_id || '',
                motive: data?.motive || '',
                amount: data?.amount || 0,
            })
        }

        if(status === 'cloture') {
            const todayCash = async () =>  {
                return await _getTodayCash()
                    .then(res => {
                        if(res.data) {
                            form.setValues({
                                category: 'income',
                                designation_id: '',
                                motive: `Cloture de la journée du ${new Date().toLocaleString('vh').substring(0,10)}`,
                                amount: res.data[0].count,
                            })
                        }
                    })
                    .catch(err => console.log(err))
            }
            todayCash()
        }
    }, [data, status])

    const optionsMotives = !motives ? [] : motives.map(mot => {
        return {
            label: mot.libelle,
            value: mot._id,
        }
    })

    const handleSelect = () => {
        let mot_id = form.values?.designation_id;
        const selected = motives.find(mot => mot._id === mot_id)
        setselectedTrans(selected)
        form.setFieldValue('category', selected?.move === 'in' ? 'income' : 'expense')
    }

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        const dataToSubmit = { 
            ...values, 
            source: 'treasury',
            code: selectedTrans?.code, 
            designation: selectedTrans?.libelle,
            move: selectedTrans?.move
        }
  
        if(status === 'create' || status === 'cloture') {
              
            setTimeout(() => {
                dispatch(createTreasury({ dataToSubmit }))
                    .then(res => {
                        if(res?.payload) {
                            notifications.showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'Enregistrement reussi..!',
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

                if(client) {
                    dispatch(updateClient({ 
                        _id: client?._id , 
                        dataToSubmit: { 
                            amount : values.amount,
                            action: 'payment'
                        }}))
                    .then(res => {
                        if(res?.payload) console.log('It works...')
                    })
                }
                
                if(prov) {
                    dispatch(updateProvider({ 
                        _id: prov?._id , 
                        dataToSubmit: { 
                            amount : values.amount,
                            action: 'payment'
                        }}))
                    .then(res => {
                        if(res?.payload) console.log('It works...')
                    })
                }
                handleClose()
                setloading(false)
            }, 500);
            
        }
  
        if(status === 'edit') {
            dispatch(updateTreasury({ _id: data?._id, dataToSubmit: { ...values }}))
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
                <div className='dates' style={{marginTop:14}}>
                    <Select 
                        rightSection={<span style={{fontSize:16}}>{selectedTrans?.code}</span>}
                        rightSectionWidth={60}
                        data={optionsMotives}
                        onSelect={handleSelect}
                        size='sm' 
                        searchable
                        variant="filled"
                        label="Libelle de la transaction :" 
                        disabled={status === 'edit' ? true : false}
                        placeholder='< sélectionner >'
                        description="Specifier la rubrique de la transaction :" 
                        style={{width:'89%'}}
                        {...form.getInputProps('designation_id')}
                    />
                    <ActionIcon color='red' onClick={() => setprovider(true)} size='lg' variant="filled" mb={1} >
                        <BsPlus size={24} />
                    </ActionIcon>
                </div>
                <div className='dates'>
                    <Select 
                        data={[{label: "Produit ou entrée", value: 'income'}, {label: "Charge ou dépense", value: 'expense'}]}
                        size='sm'
                        variant="filled" 
                        placeholder='< selectionner >'
                        label='Type de transaction :'
                        description="Type de mouvement" 
                        style={{width:'100%'}}
                        {...form.getInputProps('category')}
                        disabled={true}
                    />
                </div>
                <div className='dates' style={{justifyContent: "space-between", marginTop:14}}>
                    <TextInput 
                        size="sm" variant="filled" 
                        style={{width:'100%'}} 
                        multiline
                        description="Libellé de la transaction :" 
                        placeholder='Déscription du motif de la transaction...'
                        {...form.getInputProps('motive')}
                    />
                    
                </div>
                <Divider style={{marginTop: 14}}/>
                <div className='dates' style={{justifyContent:"center", marginBlock: 14}}>
                    <TextInput 
                        size="lg"
                        variant="filled" 
                        placeholder="Montant" 
                        description="Montant" 
                        disabled={status === 'edit' ? true : false}
                        icon={<Text color="dimmed" size="lg">USD</Text>}
                        style={{width:'50%', textAlign:"center"}}
                        defaultValue={1000}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        {...form.getInputProps('amount')}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                            ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : '' 
                        }
                        />
                </div>
                <Divider />
                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 14}}>
                    <Button size='sm' loading={loading} leftIcon={<FaRegSave size={18} />}  type='submit' color='gray'>Enregistrer</Button>
                </div>
            </form>

            <Modal
                opened={provider}
                onClose={() => setprovider(false)}
                title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsQuestionOctagonFill size={18} style={{marginRight:8}} /> Nouveau justificatif</Title>}
            >
                <MotifForm
                status='create' 
                handleClose={() => {
                    setprovider(false)
                }}
                />
            </Modal>
        </div>
    )
}

export default TreasuryForm