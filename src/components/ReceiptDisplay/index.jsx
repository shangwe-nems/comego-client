import { Button, Divider, Input } from '@mantine/core'
import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { BsPrinter } from 'react-icons/bs'
import { NumberToLetter } from 'convertir-nombre-lettre';
import ReactToPrint from 'react-to-print'
import './receipt.style.scss'

function ReceiptDisplay({data }) {
    const [printing, setPrinting] = useState(false)
    const [loadedData, setloadedData] = useState()
    const [recipient, setrecipient] = useState('')

    const componentRef = useRef();

    useEffect(() => {
        setloadedData(data)
        return () => {
            setloadedData([])
        }
    }, [data])

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    

    return (
        <div>
            <Divider />
            <div style={{width: '100%', minHeight:150, padding: '24px 32px', border:'1px solid #cacaca', marginBlock:8}} ref={componentRef}>
                {/* Here goes the headings */}
                <div className='receipt-title'>
                    <img src="/logo-print.svg" alt="logo" />

                    <div>
                        <h3>Complexe Mécanique de Goma</h3>
                        <span>
                            <p>Province du Nord-Kivu</p>
                            <p>Goma, Av Mutongo  N°68</p>
                            <p>Tél : +243 973 659 779, +243 994 230 259</p> 
                        </span>  
                    </div>
                    
                </div>
                <div className='receipt-no'>
                    <h3>REÇU N° {(loadedData?.receipt_no)?.toString()?.padStart(7 + '', "0")}</h3>
                </div>

                <div className='receipt-amount'>
                    <p>Montant <em>(en chiffres)</em> :</p>
                    <span>${parseNumber(loadedData?.amount?.toFixed(2))}</span>
                </div>

                <div className='receipt-content'>
                    <p style={{marginBottom:14}}><b>Reçu de :</b> {recipient?.toUpperCase()}</p>
                    <p><b>La somme de </b><em>(en toutes lettres)</em> : {NumberToLetter(parseInt(loadedData?.amount))} dollars americains</p>
                    <p><b>Motif :</b> {loadedData?.motive?.split('-')[0]}</p>
                </div>
                
                <div className='receipt-foot'>
                    <p>Fait à Goma, le {new Date(loadedData?.createdAt).toLocaleString('vh').substring(0,10)}</p>
                    <p style={{marginRight:42}}>Signature</p>
                </div>

            </div>
            <Divider />

            <div style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent:'space-between', marginTop: 14}}>
                <Input variant='filled' placeholder='Source de paiement...' style={{width: 280}} onChange={e => setrecipient(e.currentTarget.value)} />
                <ReactToPrint
                    trigger={() => <Button size='sm' loading={printing} onClick={() => setPrinting(true)} leftIcon={<BsPrinter />}  type='submit' color='red'>Imprimer</Button>}
                    content={() => componentRef.current}
                />
            </div>
        </div>
    )
}

export default ReceiptDisplay