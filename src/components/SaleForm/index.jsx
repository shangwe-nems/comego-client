import React, { forwardRef, useState } from 'react'
import { ActionIcon, Avatar, Button, Divider, Group, Modal, Select, Text, Textarea, TextInput, Title } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

import * as yup from "yup"
import { useNotifications } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, yupResolver } from '@mantine/form';
import { BsCash, BsCheck2, BsCreditCard, BsExclamationLg, BsPerson, BsPlus, BsTags } from 'react-icons/bs';
import { FaRegSave } from 'react-icons/fa';
import AchatList from '../AchatList';
import ClientForm from '../ClientForm';
import { createInvoice } from '../../redux/slices/invoices';

const optionsPayment = [
    {
        label: 'Cash',
        value: 'cash'
    },
    {
        label: 'Credit',
        value: 'credit'
    }
]

const SelectItem2 = forwardRef(
    ({ reference, phone, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <Avatar><BsPerson size={24} color='red' /></Avatar>
  
          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" color="dimmed">
              {phone}
            </Text>
          </div>
        </Group>
      </div>
    )
);

const SelectItem3 = forwardRef(
    ({ label, value, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                {value === 'cash' ? <BsCash /> : <BsCreditCard /> }
                <div>
                    <Text size='sm'>{label}</Text>
                </div>
            </Group>
        </div>
    )
);

const createInvoiceSchema = yup.object().shape({
    sale_date: yup.string().required(),
    buyer_category: yup.string().required(),
    client: yup.string().optional(),
    isCredit: yup.string().required(),
    echeance: yup.string(),
    buyer_name: yup.string(),
    observation: yup.string().optional(),
})

function SaleForm({ handleClose }) {
    const dispatch = useDispatch()
    const notifications = useNotifications()
    const [loading, setloading] = useState(false);
    const [clientType, setclientType] = useState('Occasionnel')
    const [clientCreate, setclientCreate] = useState(false);
    const [paymentType, setpaymentType] = useState('cash');
    const [productSelect, setproductSelect] = useState(false)
    const [itemList, setItemList] = useState([])
    const [total, setTotal] = useState(0)

    const clients = useSelector(state => state.clients)

    const form = useForm({
        validate: yupResolver(createInvoiceSchema),
        initialValues: {
            sale_date: new Date(),
            buyer_category: 'casual',
            client: '',
            isCredit: 'cash',
            echeance: '',
            buyer_name: '',
            observation: '',
        },
    })


    const clientProvider = !clients ? [] : clients?.map(client => {
        return {
            label: client?.names,
            phone: client?.phone,
            value: client?._id,
        }
    })

    function findClientName(id) {
        return clients?.find(client => client._id === id)
    }

    function handleSubmit(values, e) {
        setloading(true)
        const dataToSubmit = { 
            ...values, 
            buyer_name: values?.buyer_category === 'casual' ? values?.buyer_name : findClientName(values?.client).names,
            client: values?.buyer_category === 'regular' ? values?.client : undefined,
            echeance : values?.isCredit === 'cash' ? undefined : values?.echeance,
            isCredit: values?.isCredit === 'cash' ? false : true,
            products: itemList,
            total_amount: total.toFixed(2),
            isValid: true,
        }
        
        setTimeout(() => {
            dispatch(createInvoice({ dataToSubmit }))
                .then(res => {
                    if(res?.payload) {
                        handleClose()
                        notifications.showNotification({
                            color: 'green',
                            title: 'Success',
                            message: 'Saved successfully!',
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
        }, 800);

       
    }

    const selectedItems = itemList.map(data => (
        <Group key={data.product} noWrap style={{borderBlock:'0.5px solid #eaeaea', marginBlock:2}}>
            <h3 style={{width: '8%', borderInline:'1px solid #eaeaea', textAlign:'right', fontSize:14, fontWeight:400}}>({data?.qty}) </h3>
            <h3 style={{width: '56%', borderInline:'1px solid #eaeaea', fontWeight:400, fontSize:14}}>{data?.designation}</h3>
            <h3 style={{width: '18%', borderInline:'1px solid #eaeaea', textAlign:'right', fontWeight:400}}>${(data?.pv_unit)?.toFixed(2)}</h3>
            <h3 style={{width: '18%', borderInline:'1px solid #eaeaea', textAlign:'right', fontWeight:400, color: 'green'}}>${(data?.pv_tot)?.toFixed(2)}</h3>
        </Group>
    ))

  return (
    <div style={{borderTop: '1px solid #eaeaea', marginTop: -8}}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <div className='dates' style={{paddingTop: 8}}>
                <DatePicker
                    defaultValue={new Date()}
                    variant="filled" 
                    style={{width:'49%'}} 
                    description="Date de vente :"
                    {...form.getInputProps("sale_date")}
                />
                <Select 
                    size='sm'
                    defaultValue='Occasionnel'
                    data={[{label: 'Occasionnel', value: 'casual'}, {label: 'Régulier', value:'regular'}]}
                    variant="filled" 
                    style={{width:'49%'}} 
                    onSelect={e => setclientType(e.target.value)}
                    {...form.getInputProps("buyer_category")}
                    description="Type d'acheteur :" 
                />
            </div>

            {clientType === 'Régulier' ? <>
            <div className='dates' style={{paddingTop: 8}}>
                <Select 
                    data={clientProvider} 
                    itemComponent={SelectItem2} 
                    size='sm' 
                    variant="filled" 
                    description="Selectionner le client concerné : " 
                    placeholder='Selectionner client' 
                    style={{width:'89%'}}
                    searchable
                    clearable
                    maxDropdownHeight={400}
                    {...form.getInputProps("client")}
                    nothingFound="Nobody here"
                    filter={(value, item) =>
                        item?.label?.toLowerCase().includes(value?.toLowerCase().trim()) ||
                        item?.email?.toLowerCase().includes(value?.toLowerCase().trim())
                    }
                />
                <ActionIcon size='lg' variant='filled' color='red' style={{marginBottom: 1}} onClick={() => setclientCreate(true)} ><BsPlus size={28} /></ActionIcon>
            </div>
            <div className='dates' style={{paddingTop: 8}}>
                <Select 
                    size='sm'
                    defaultValue='cash'
                    itemComponent={SelectItem3}
                    data={optionsPayment}
                    variant="filled" 
                    style={{width:'49%'}} 
                    onSelect={e => setpaymentType(e.target.value)}
                    description="Type de paiement :" 
                    {...form.getInputProps("isCredit")}
                />
                <DatePicker
                    defaultValue={Date.now()}
                    variant="filled" 
                    style={{width:'49%'}} 
                    description="Echéance"
                    minDate={new Date()}
                    {...form.getInputProps("echeance")}
                    disabled={paymentType === 'Cash' ? true : false}
                />
            </div>
            </> : 
            <div className='dates' style={{paddingTop: 8}}>
                <TextInput  variant="filled" style={{width:'100%'}} size='sm' description="Nom de l'acheteur :"
                {...form.getInputProps("buyer_name")}
                />
            </div>
            }

            <div className='description'>
                <Textarea 
                    variant="filled" size='sm' label="Observation :" 
                    description="Decrivez un details particulier sur la vente : " 
                    {...form.getInputProps("observation")}
                />
            </div>

            <div className='dates' style={{paddingTop: 14}}>
                <Button variant="light" color="red" fullWidth onClick={() => setproductSelect(true)}>Selectionner produits</Button>
            </div>

            <Divider label={`Produits selectionnés (${itemList.length})`} labelPosition='center' />
            {itemList.length === 0 ? 
            <div style={{width: '100%', minHeight:100, display: 'grid', placeContent: 'center'}}>
                <Text size='xs' color='dimmed'>Aucun produit selectionné</Text>
            </div> : 
            <div style={{width: '100%', minHeight:150}}>
                <Group key={'head'} noWrap style={{borderBlock:'0.5px solid #eaeaea', marginBottom: 4, paddingBlock:4}}>
                    <h3 style={{width: '8%', borderInline:'1px solid #eaeaea', textAlign:'right', fontSize:14, fontWeight:600}}>Qté </h3>
                    <h3 style={{width: '56%', borderInline:'1px solid #eaeaea', fontWeight:600, fontSize:14}}>Désignation</h3>
                    <h3 style={{width: '18%', borderInline:'1px solid #eaeaea', textAlign:'right', fontWeight:600}}>P.U.</h3>
                    <h3 style={{width: '18%', borderInline:'1px solid #eaeaea', textAlign:'right', fontWeight:600, color: 'green'}}>P.T.</h3>
                </Group>
                {selectedItems}
                <Group key={'foot'} noWrap style={{ marginBottom: 4, marginTop:8}}>
                    <h3 style={{width: '82%', textAlign:'right', fontWeight:400, fontSize:14}}>Total :</h3>
                    <h3 style={{width: '18%', backgroundColor:'yellow', paddingBlock:2, textAlign:'right', fontWeight:600}}>${total.toFixed(2)}</h3>
                </Group>
                {/* <span style={{backgroundColor:'yellow', width:'18%', fontSize:16, fontWeight:600, padding:'2px 0', textAlign:'right', borderRadius:4, float:'right'}}>Total : <h3>${total}</h3> </span> */}
            </div>}
            <Divider />
            
            <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 14}}>
                <Button size='sm' loading={loading} leftIcon={<FaRegSave />}  type='submit' color='gray'>Enregistrer</Button>
            </div>
        </form>  
        <Modal
            opened={clientCreate}
            onClose={() => setclientCreate(false)}
            title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsPerson size={18} style={{marginRight:8}} /> Nouveau client</Title>}
        >
            <ClientForm
                status='create' 
                handleClose={() => {
                    setclientCreate(false)
                }} 
            />
        </Modal>  

        <Modal
            opened={productSelect}
            onClose={() => setproductSelect(false)}
            closeOnClickOutside={false}
            closeOnEscape={false}
            size="xl"
            title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsTags size={18} style={{marginRight:8}} /> Liste d'achats</Title>}
        >
            <AchatList
                handleValidate={(list, sum) => {
                    setItemList(list)
                    setTotal(sum)
                    setproductSelect(false)
                }} 
            />
        </Modal>  
    </div>
  )
}

export default SaleForm