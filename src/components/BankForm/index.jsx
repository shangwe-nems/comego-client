/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { ActionIcon, Button, Divider, Modal, NumberInput, Select, Text, TextInput, Title } from '@mantine/core';
import { FaRegSave } from 'react-icons/fa';
import { BsCheck2, BsExclamationLg, BsPlus, BsQuestionOctagonFill } from 'react-icons/bs';
import MotifForm from '../MotifForm';
import { useForm, yupResolver } from '@mantine/form';
import { useDispatch } from 'react-redux';
import * as yup from "yup";
import { showNotification } from '@mantine/notifications';
import { IoHandRight } from 'react-icons/io5';
import { createBank, updateBank } from '../../redux/slices/banks';
import { useSelector } from 'react-redux';

// const motives = [
//     { description : "Transport", _id: 'transport', code: 80.1},
//     { description : 'Paiement taxes', _id: 'taxes', code: 87.1},
//     { description : 'Paiement salaires', _id: 'salaires', code: 60.2},
//     { description : 'Paiement impots', _id: 'impots', code: 61.01},
//     { description : 'Remboursement dettes', _id: 'dettes', code: 80.2},
//     { description : 'Reparations maison', _id: 'maison', code: 40.4},
//     { description : 'Charge voyage', _id: 'voyage', code: 120.1},
//     { description : 'Paiement loyer', _id: 'loyer', code: 60.7},
//     { description : 'Investissement externes', _id: 'investissement', code: 80.6},
//     { description : 'Paiement creances', _id: 'creances', code: 80.4},
//     { description : 'Paiement REGIDESO', _id: 'regideso', code: 37.1},
//     { description : 'Paiement SNEL', _id: 'snel', code: 20.1},
//     { description : 'Paiement SOCODEE', _id: 'socodee', code: 23.1},
// ]

const createTransactionSchema = yup.object().shape({
    category: yup.string().required('required'),
    designation_id: yup.string().required('required'),
    motive: yup.string().required('required'),
    amount: yup.number().required('required'),
})

function BankForm({ status, data, handleClose }) {
    const dispatch = useDispatch()
    const motives = useSelector(state => state.motives)
    const [loading, setloading] = useState(false);
    const [provider, setprovider] = useState(false);
    const [selectedTrans, setselectedTrans] = useState()

    const form = useForm({
        validate: yupResolver(createTransactionSchema),
        initialValues: {
          category: '',
          designation_id: '',
          motive: '',
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
        form.setFieldValue('category', selected?.move === 'in' ? 'deposit' : 'withdraw')
    }

    function handleSubmit(values, e){
        e.preventDefault()
        setloading(true);

        const dataToSubmit = { 
            ...values, 
            source: 'bank',
            code: selectedTrans?.code, 
            designation: selectedTrans?.libelle,
            move: selectedTrans?.move
        }
  
        if(status === 'create') {            
  
            setTimeout(() => {
                dispatch(createBank({ dataToSubmit }))
                    .then(res => {
                        if(res?.payload) {
                            handleClose()
                            showNotification({
                                color: 'green',
                                title: 'Success',
                                message: 'Purchase created successfully',
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
            dispatch(updateBank({ _id: data?._id, dataToSubmit: { ...values }}))
            .then(res => {
                if(res.payload) {
                    handleClose()
                    showNotification({
                        color: 'green',
                        title: 'Success',
                        message: 'Purchase created successfully',
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
                <div className='dates' style={{marginTop:14}}>
                    <Select 
                        rightSection={<span style={{fontSize:16}}>{selectedTrans?.code}</span>}
                        rightSectionWidth={60}
                        data={optionsMotives}
                        onSelect={handleSelect}
                        size='sm' 
                        searchable
                        variant="filled" 
                        disabled={status === 'edit' ? true : false}
                        placeholder='< selectionner >'
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
                        data={[{label: "Dépot d'argent", value: 'deposit'}, {label: "Rétrait des fonds", value: 'withdraw'}]}
                        size='sm' 
                        variant="filled" 
                        placeholder='< selectionner >'
                        label='Type de transaction :'
                        description="Spécifier si c'est un dépot ou un rétrait d'argent." 
                        style={{width:'100%'}}
                        disabled={status === 'edit' ? true : false}
                        {...form.getInputProps('category')}
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
                <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
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

export default BankForm