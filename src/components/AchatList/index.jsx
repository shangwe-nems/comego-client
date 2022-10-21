import React, { forwardRef, useState } from 'react';
import { ActionIcon, Avatar, Button, Group, NumberInput, Select, Text, TextInput } from '@mantine/core';
import { BsBackspace, BsPlus, BsQuestionCircle, BsTagFill } from 'react-icons/bs';
import { FaRegSave } from 'react-icons/fa';
import { useForm } from '@mantine/form';
import { useSelector } from 'react-redux';
import { useModals } from '@mantine/modals';


const SelectItem = forwardRef(
    ({ label, pv_unit, value, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div style={{width: '100%', display: 'inline-flex', alignItems:'center', justifyContent: 'space-between'}}>
                    <Text size='sm'>{label}</Text>
                    <h3 style={{color:'dodgerblue', fontSize:16, fontWeight: '400'}}>$ {pv_unit?.toFixed(2)}</h3>
                </div>
            </Group>
        </div>
    )
);

function AchatList({ handleValidate }) {
    const modals = useModals()
    const [loading, setloading] = useState(false);
    const stocks = useSelector(state => state.stocks);
    const [list, setList] = useState([])

    const [selectedProduct, setSelectedProduct] = useState()
    const [sum, setSum] = useState(0)

    
    const form = useForm({
        initialValues: {
            product: '',
            qty: 1,
            pv_unit: parseInt(0).toFixed(2),
            pv_tot: parseInt(0).toFixed(2)
        },
        validate: {
            product: (value) => (value === null ? 'produit exigé' : null),
            qty: (value) => parseInt(value) > 0 ? null : 'qté invalid',
            pv_unit: (value) => (value <= 0 ? 'pv invalid' : null),
        },
        validateInputOnChange: ['product', 'qty']
    })

    const productProvider = !stocks ? [] : stocks?.map(product => {
        return {
          label: product?.designation,
          pv_unit: product?.pv_gen,
          value: product?._id
        }
    })

    const handleChangeProduct = () => {
        let product_id = form.values?.product
        const selected = stocks.find(product => product._id === product_id)

        setSelectedProduct(selected)
        form.setFieldValue('pv_unit', selected?.pv_gen?.toFixed(2))
        form.setFieldValue('pv_tot', (parseFloat(selected?.pv_gen) * parseFloat(form.values.qty))?.toFixed(2))
    }

    const handleChangeNumber = () => {
        const pv_unit = form.values.pv_unit
        const qty = form.values.qty

        const pv_tot = parseFloat(pv_unit) * parseFloat(qty)
        form.setFieldValue('pv_tot', pv_tot.toFixed(2))

        if(pv_unit < selectedProduct.pv_min) {
            form.setFieldError('pv_unit', `must be >= ${selectedProduct.pv_min}`)
        }

        if(qty > selectedProduct.qty) {
            form.setFieldError('qty', `must be <= ${selectedProduct.qty}`)
        }
    }

    const handleAddProduct = (e) => {
        if(form.values.product === '' || form.values.pv_unit === 0) return 

        if(list.find(o => o.product === form.values.product)) {
            form.setFieldError('product', 'ce produit a déjà été selectionné')
            return
        }

        const newItem = {
            product: form.values?.product,
            category: selectedProduct?.category,
            unit: selectedProduct?.unit,
            designation: selectedProduct?.designation,
            qty: parseFloat(form.values?.qty),
            pv_unit: parseFloat(form.values?.pv_unit),
            pv_tot: parseFloat(form.values.qty) * parseFloat(form.values.pv_unit)
        }
        setList([...list, newItem])

        const summation = [...list, newItem].reduce((a, b) => a + (b['pv_tot'] || 0), 0)
        
        setSum(summation)
        form.reset()
    }

    const handleRemoveProduct = (e, data) => {
       
        let newList = list.filter(function( obj ) {
            return obj.product !== data.product;
          });
        setList(newList)

        const summation = newList.reduce((a, b) => a + (b['pv_tot'] || 0), 0)
        
        setSum(summation)
    }

    const rows = list?.map(data => (
        <Group key={data.product} noWrap style={{borderBlock:'0.5px solid #eaeaea', marginBlock:2}}>
            <h3 style={{width: '55%', padding: '4px 12px', borderInline:'1px solid #eaeaea', fontWeight:400, fontSize:14}}>{data?.designation}</h3>
            <h3 style={{width: '15%', padding: '4px 14px', borderInline:'1px solid #eaeaea', textAlign:'left', fontSize:14, fontWeight:400}}>{data?.qty} {data?.unit}</h3>
            <h3 style={{width: '15%', padding: '4px 14px',  borderInline:'1px solid #eaeaea', textAlign:'left', fontWeight:400}}>${(data?.pv_unit)?.toFixed(2)}</h3>
            <h3 style={{width: '15%', padding: '4px 14px', borderInline:'1px solid #eaeaea', textAlign:'left', color: 'red'}}>${(data?.pv_tot)?.toFixed(2)}</h3>
            <ActionIcon variant='light' color='red' onClick={e => handleRemoveProduct(e, data)}><BsBackspace /></ActionIcon>
        </Group>
    ))

    const handleSubmit = () => {
        modals.openConfirmModal({
            title: <Text size='md' weight={700} style={{display:'inline-flex', alignItems:'center'}}><BsQuestionCircle size={18} style={{marginRight: 8}} />Valider ?</Text>,
            children: (
                <Text size='xs'>
                    Etes-vous sure de valider cet achat ?
                </Text>
            ),
            zIndex:201,
            labels: { confirm: 'confirmer', cancel: 'annuler' },
            confirmProps: {color: 'green', size: 'xs'},
            cancelProps : {size: 'xs'},
            onCancel: () => console.log('Cancel'),
            onConfirm: () => {
                setloading(true)
                setTimeout(() => {
                    handleValidate(list, sum)
                    setloading(false)
                }, 100);
            },
        })
    }


    return (
        <div  style={{borderTop: '1px solid #eaeaea', marginTop: -8}}>
            <form onSubmit={form.onSubmit(handleAddProduct)}>
                <div className='dates' style={{justifyContent: 'space-between'}}>
                    <Select 
                        itemComponent={SelectItem}
                        data={productProvider}
                        variant='filled' 
                        size='sm' 
                        style={{width:'48%'}} 
                        label="Produit :" 
                        required
                        onSelect={handleChangeProduct}
                        {...form.getInputProps('product')}
                        searchable
                        clearable
                        className='textinput' 
                        description="Désignation" 
                    />
                    <TextInput 
                        variant='filled' size='sm' 
                        style={{width:'14%'}} 
                        className='textinput' 
                        required
                        onSelect={handleChangeNumber}
                        {...form.getInputProps('qty')}
                        description="Qté" 
                    />
                    <TextInput 
                        variant='filled' size='sm' 
                        style={{width:'14%'}} 
                        className='textinput' 
                        description="P.U." 
                        required
                        onSelect={handleChangeNumber}
                        {...form.getInputProps('pv_unit')}
                    />
                    <TextInput 
                        variant='filled' size='sm' 
                        style={{width:'14%'}} 
                        className='textinput' 
                        required
                        {...form.getInputProps('pv_tot')}
                        description="P.T." 
                    />
                    <ActionIcon 
                        size='lg' variant='filled' 
                        color='red' style={{marginBottom: 1}} 
                        onClick={() => handleAddProduct()} 
                    >
                        <BsPlus size={28} />
                    </ActionIcon>
                </div>
            </form>

            <div style={{marginTop: 14, minHeight: 150, border: '1px solid #eaeaea'}}>
                {list.length === 0 ? 
                    <div style={{width: '100%', height:150, display:'grid', placeContent:'center'}}>
                        <span>Nothing Selected</span>
                    </div> : 
                    rows
                }
            </div>

            <div style={{float:'right', width: '35%', backgroundColor: 'yellow', marginTop: 14, borderBlock: '1px solid #eaeaea', paddingBlock: 4}}>
                <Group noWrap style={{paddingLeft:'30%'}}>
                    <Text size='sm' >Total : </Text>
                    <h4 style={{fontSize: 18}}>$ {sum.toFixed(2)}</h4>
                </Group>
            </div>

            <div style={{ marginTop: 14}}>
                <Button size='sm' loading={loading} leftIcon={<FaRegSave />} onClick={handleSubmit} color='gray'>Enregistrer</Button>
            </div>
            
        </div>
    )
}

export default AchatList