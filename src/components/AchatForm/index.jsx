/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useEffect, useState } from 'react'
import { Button, TextInput, Select, Text, Group, Avatar, ActionIcon, Modal, Title, Checkbox } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form';
import * as yup from "yup"
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { FaSave } from 'react-icons/fa'
import { MdTravelExplore } from 'react-icons/md'
import './achatform.scss'
import { BsCheck2, BsExclamationLg, BsPlus, BsShop } from 'react-icons/bs'
import TripForm from '../TripForm'
import ProviderForm from '../ProviderForm'
import { createPurchase, updatePurchase } from '../../redux/slices/purchases';
import { IoHandRight } from 'react-icons/io5';


const optionsOutsourcing = [
  {label: "Approvisionnement Local", value : "local"},
  {label: "Approvisionnement Exterieur", value : "foreign"},
]


const createPurchaseSchema = yup.object().shape({
  category: yup.string().required('category is required'),
  designation: yup.string().required(),
  foreign_pa_unit: yup.number().optional(),
  local_pa_unit: yup.number().optional(),
  exchange_rate: yup.number().optional(),
  currency: yup.string().optional(),
  qty: yup.number().optional(),
  revient_price: yup.number().optional(),
  provider : yup.string().optional(),
  travel:  yup.string().optional(),
})


const SelectItem = forwardRef(
  ({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar><BsShop size={24} color='red' /></Avatar>

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

const SelectItem2 = forwardRef(
  ({ reference, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar><MdTravelExplore size={24} color='red' /></Avatar>

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" color="dimmed">
            par {reference} le {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

function AchatForm({ status, purchase, handleClose }) {
  const dispatch = useDispatch()

  const travels = useSelector(state => state.travels)
  const providers = useSelector(state => state.providers)
  const stocks = useSelector(state => state.stocks)

  const [loading, setloading] = useState(false);
  const [trip, settrip] = useState(false);
  const [provider, setprovider] = useState(false);
  const [outsourcing, setOutsourcing] = useState('local')
  const [selectedTravel, setselectedTravel] = useState()
  const [qtyMin, setQtyMin] = useState(false)
  const [unit, setunit] = useState('')

  const [data, setData] = useState([
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
  ]);

  useEffect(() => {
    const stockProvider = !stocks ? [] : stocks?.map(stock => {
      return {
        value : stock?._id,
        label: stock?.designation
      }
    })

    setData(stockProvider)
  }, [stocks])
  

  const providerProvider = !providers ? [] : providers?.map(provider => {
      return {
          label: provider?.shop_name,
          value: provider?._id,
          description: provider?.category 
      }
  })

  const travelsProvider = !travels ? [] : travels?.map(travel => {
      return {
        label: travel?.city,
        reference: travel?.reference,
        value: travel?._id,
        description: new Date(travel?.arrival).toLocaleString('us-En').substring(0,10),
      }
  })



  const form = useForm({
      validate: yupResolver(createPurchaseSchema),
      initialValues: {
        category: 'local',
        designation: '',
        foreign_pa_unit: 0,
        local_pa_unit: 0,
        exchange_rate: 0,
        currency: '',
        unit: '',
        qty: 0,
        revient_price: 0,
        provider : '',
        travel:  '',
        invoice_no: '',
        isCredit: false
      },
      validateInputOnChange: ['designation', 'travel']
  })

  useEffect(() => {
      if(purchase !== null && status === 'edit') {
          form.setValues({
              category: purchase?.category || 'local',
              designation: purchase?._id || '',
              foreign_pa_unit: purchase?.foreign_pa_unit || 0,
              local_pa_unit: purchase?.local_pa_unit || 0,
              exchange_rate: purchase?.exchange_rate || 0,
              currency: purchase?.currency || '',
              qty: purchase?.qty || 0,
              unit: purchase?.unit || '',
              revient_price: purchase?.revient_price || 0,
              provider : purchase?.provider?._id || '',
              travel: purchase?.travel?._id || '',
              invoice_no: purchase?.invoice_no || '',
              isCredit: purchase?.isCredit || false
          })
      }
  }, [purchase, status])
  


  function handleSubmit(values, e){
      e.preventDefault()
      setloading(true);
      const foundItem = stocks.find(obj => obj._id === values?.designation)

      console.log('Values: ', values)

      if(status === 'create') {

          const dataToSubmit = { 
              ...values, 
              unit: foundItem.unit || values?.unit,
              currency: selectedTravel?.currency, 
              exchange_rate: selectedTravel?.exchange_rate,
              revient_price: values?.category === 'local' ? values?.local_pa_unit : values?.revient_price
          }
          
          setTimeout(() => {
              dispatch(createPurchase({ dataToSubmit }))
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
          dispatch(updatePurchase({ _id: purchase?._id, dataToSubmit: { ...values }}))
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

  const handleChangeTravel = () => {
      let travel_id = form.values?.travel;

      const selected = travels.find(travel => travel._id === travel_id)
                        
      setselectedTravel({
        _id: selected?._id,
        currency: selected?.currency,
        exchange_rate :  selected?.exchange_rate,
        total_fees : selected?.total_fees, 
        purchase_global_fees : selected?.purchase_global_fees,
        coefficient : selected?.coefficient,
        margin: selected?.margin,
    })
  }

  const handleRevientPrice = () => {
      const foreign_pa_unit = parseFloat(document.getElementsByName('foreign_pa')[0].value);
      const local_pa_unit = parseFloat(document.getElementsByName('local_pa')[0].value);

      const pau_ml = parseFloat(foreign_pa_unit / selectedTravel?.exchange_rate).toFixed(4)
      const pr = (selectedTravel?.coefficient + parseInt(1)) 

      const category = form?.values?.category

      
      form.setFieldValue("local_pa_unit", pau_ml)
      form.setFieldValue("revient_price", category === 'local' ? local_pa_unit : parseFloat(pr * pau_ml).toFixed(4))
  }

  const handleForeignPrice = () => {
      const local_pa_unit = parseFloat(document.getElementsByName('local_pa')[0].value);

      const foreign_pa_unit = parseFloat(selectedTravel?.exchange_rate * local_pa_unit).toFixed(4);

      const pr = (selectedTravel?.coefficient + parseInt(1)) 

      const category = form?.values?.category

      form.setFieldValue("revient_price", category === 'local' ? local_pa_unit : parseFloat(pr * local_pa_unit).toFixed(4))
      form.setFieldValue("foreign_pa_unit", foreign_pa_unit)
  }

  return (
    <div style={{borderTop: '1px solid #eaeaea', marginTop: -8}}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className='dates'>
          <Select 
              data-autofocus
              size='sm'
              data={optionsOutsourcing} 
              value={outsourcing}
              variant="filled" 
              style={{width:'100%'}} 
              onSelect={e => setOutsourcing(e.target.value)}
              description="Type d'approvisionnement :" 
              {...form.getInputProps('category')}
          />
        </div>

        {outsourcing === 'Approvisionnement Exterieur' ? 
        <div className='dates'>
          <Select 
            data={travelsProvider} 
            itemComponent={SelectItem2} 
            size='sm' 
            variant="filled" 
            description="Selectionner le voyage concerné : " 
            placeholder='Selectionner voyage' 
            style={{width:'89%'}}
            searchable
            maxDropdownHeight={400}
            nothingFound="Nobody here"
            onSelect={handleChangeTravel}
            {...form.getInputProps('travel')}
            filter={(value, item) =>
              item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.reference.toLowerCase().includes(value.toLowerCase().trim()) ||
              item.description.toLowerCase().includes(value.toLowerCase().trim())
            }
          />
          <ActionIcon size='lg' variant='filled' color='red' style={{marginBottom: 1}} onClick={() => settrip(true)}><BsPlus size={28} /></ActionIcon>
        </div> : null }

        <div className='dates' style={{marginBottom: 12}}>
          <Select
              size='sm' variant="filled" style={{width:'100%'}} 
              label="Designation du produit :" required withAsterisk
              description="Inserez le nom du produit de maniere concise."
              data={data}
              placeholder="Designation du produit"
              nothingFound="Nothing found"
              searchable
              creatable
              getCreateLabel={(query) => `+ Créer ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query };
                setData((current) => [...current, item]);
                setQtyMin(true)
                return item;
              }}
              {...form.getInputProps('designation')}
          />
          {/* <TextInput 
            size='sm' variant="filled" style={{width:'100%'}} 
            label="Designation du produit :" required withAsterisk
            description="Inserez le nom du produit de maniere concise."
            {...form.getInputProps('designation')}
          /> */}
        </div>
        {qtyMin ? 
        (<div className='dates' style={{marginBottom: 8, marginTop: -5}}>
          <TextInput 
            size='sm' variant="filled" style={{width:'49%'}} 
            required
            description="Qté minimum du produit:"
            {...form.getInputProps('qty_min')}
          />
          <Select 
            data={['ltr', 'pcs', 'kgs']}
            size='sm' variant="filled" style={{width:'49%'}} 
            required
            description="Unité de mesure"
            onSelect={e => setunit(e.target.value)}
            {...form.getInputProps('unit')}
          />
        </div>) : null}

        <div className='dates'>
        {outsourcing === 'Approvisionnement Exterieur' ?
          <TextInput 
              size='sm' variant="filled" description="P.A Unitaire en M.E : " 
              rightSection={<Text size='xs' color="dimmed">{selectedTravel && selectedTravel ? selectedTravel?.currency : null}</Text>} 
              style={{width:'49%'}} name='foreign_pa'
              onSelect={handleRevientPrice}
              {...form.getInputProps('foreign_pa_unit')}
          /> : 
          <TextInput 
            size='sm' variant="filled" description="P.A. Unitaire en USD :" 
            rightSection={<Text size='xs' color="dimmed">USD</Text>} 
            style={{width:'49%'}} required name='local_pa'
            onSelect={handleRevientPrice}
            {...form.getInputProps('local_pa_unit')}
          />}
          <TextInput 
            size='sm' variant="filled" 
            description="Quantité : " name='qty'
            rightSection={<Text size='xs' color="dimmed">{unit}</Text>} 
            style={{width:'49%'}} required
            {...form.getInputProps('qty')}
          />
        </div>

        {outsourcing === 'Approvisionnement Exterieur' ? <>
          <div className='dates' style={{marginTop: 14}}>
            <TextInput 
                size='sm' variant="filled" description="P.A. Unitaire en USD :" 
                rightSection={<Text size='xs' color="dimmed">USD</Text>} 
                style={{width:'49%'}} required name='local_pa'
                onSelect={handleForeignPrice}
                {...form.getInputProps('local_pa_unit')}
            />
            <TextInput
              size='sm' variant="filled" 
              description="Prix de revient :"
              rightSection={<Text size='xs' color="dimmed">USD</Text>} 
              style={{width:'49%'}}
              {...form.getInputProps('revient_price')}
            />
          </div>
        </>
        : null }

        <div className='dates' style={{marginTop: 14}}>
          <Select 
              data={providerProvider} 
              itemComponent={SelectItem} 
              size='sm' 
              variant="filled" 
              description="Fournisseur : " 
              placeholder='Selectionner fournisseur' 
              style={{width:'89%'}}
              searchable
              clearable
              maxDropdownHeight={400}
              nothingFound="Nobody here"
              {...form.getInputProps('provider')}
              filter={(value, item) =>
                item.label.toLowerCase().includes(value.toLowerCase().trim()) ||
                item.description.toLowerCase().includes(value.toLowerCase().trim())
              }
          />
          <ActionIcon size='lg' variant='filled' color='red' style={{marginBottom: 1}} onClick={() => setprovider(true)}><BsPlus size={28} /></ActionIcon>
        </div>

        <div className='dates' style={{marginTop: 14, justifyContent:'flex-start'}}>
          <TextInput 
              size='sm' variant="filled" description="Nº facture :" 
              style={{width:'60%', marginRight: 14}} 
              {...form.getInputProps('invoice_no')}
            />
          <Checkbox color='red' label='Acheté à credit' style={{marginBottom: 8}}
            {...form.getInputProps("isCredit", { type: 'checkbox' })}
          />
        </div>

        <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 28}}>
            <Button size='sm' loading={loading} leftIcon={<FaSave />}  type='submit' color='gray'>Enregistrer</Button>
        </div>
      </form>
      <Modal
        opened={trip}
        onClose={() => settrip(false)}
        title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><MdTravelExplore size={18} style={{marginRight:8}} /> Nouveau voyage</Title>}
      >
        <TripForm
          status='create' 
          handleClose={() => {
              settrip(false)
          }}
        />
      </Modal>
      <Modal
        opened={provider}
        onClose={() => setprovider(false)}
        title={<Title order={4} style={{ display: 'inline-flex', alignItems: 'center', fontWeight:'600', color:'#fa5252'}}><BsShop size={18} style={{marginRight:8}} /> Nouveau fournisseur</Title>}
      >
        <ProviderForm
          status='create' 
          handleClose={() => {
              setprovider(false)
          }}
        />
      </Modal>
    </div>
  )
}

export default AchatForm