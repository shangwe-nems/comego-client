import { Button, Divider } from '@mantine/core'
import React, { useRef } from 'react'
import { useState } from 'react'
import { BsPrinter } from 'react-icons/bs'
import ReactToPrint from 'react-to-print'
import './invoice.style.scss'

function InvoiceDisplay({ data, handleClose }) {
    const [printing, setPrinting] = useState(false)

    const componentRef = useRef();

    const parseNumber = (value) => {
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    console.log('From invoice Display: ', data)

    const selectedItems = data?.products?.map(data => (
        <tr key={data.product} noWrap style={{borderBlock:'0.5px solid #eaeaea', marginBlock:2}}>
            <td style={{width: '10%', border:'1px solid #eaeaea', padding: '.2rem', textAlign:'right', fontSize:12}}>
                <p>{data?.qty}</p>
            </td>
            <td style={{width: '50%', border:'1px solid #eaeaea', padding: '.2rem', fontSize:12}}>
                <p>{data?.designation}</p>
            </td>
            <td style={{width: '20%', border:'1px solid #eaeaea', padding: '.2rem', fontSize:14, textAlign:'right'}}>
                <p>${parseNumber((data?.pv_unit)?.toFixed(2))}</p>
            </td>
            <td style={{width: '20%', border:'1px solid #eaeaea', padding: '.2rem', fontSize:14, textAlign:'right'}}>
                <p>${parseNumber((data?.pv_tot)?.toFixed(2))}</p>
            </td>
        </tr>
    ))

    const blankItems = [1, 2, 3, 4, 5, 6].map(data => (
        <tr key={data.product} noWrap style={{borderBlock:'0.5px solid #eaeaea', marginBlock:2}}>
            <td style={{width: '10%', border:'1px solid #eaeaea', padding: '.2rem', textAlign:'right', fontSize:12}}>
                <p style={{opacity: 0}}>{data?.qty}</p>
            </td>
            <td style={{width: '50%', border:'1px solid #eaeaea', padding: '.2rem', fontSize:12}}>
                <p style={{opacity: 0}}>{data?.designation}</p>
            </td>
            <td style={{width: '20%', border:'1px solid #eaeaea', padding: '.2rem', textAlign:'right'}}>
                <p style={{opacity: 0}}>${parseNumber((data?.pv_unit)?.toFixed(2))}</p>
            </td>
            <td style={{width: '20%', border:'1px solid #eaeaea', padding: '.2rem', textAlign:'right'}}>
                <p style={{opacity: 0}}>${parseNumber((data?.pv_tot)?.toFixed(2))}</p>
            </td>
        </tr>
    ))
    

    return (
        <div>
            <div style={{width: '100%', minHeight:150, padding: '24px', border: '1px solid #dfdfdf', borderRadius:8}} ref={componentRef}>
                {/* Here goes the headings */}
                <div className='invoice-title'>
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
                <div className='invoice-no'>
                    {/* <h3>FACTURE N° {(data.invoice_no)?.toString()?.padStart(7 + '', "0")}</h3> */}
                    <p>Goma, le {new Date(data?.createdAt).toLocaleString('vh').substring(0, 10)}</p>
                    {/* <h3>PROFORMA</h3> */}
                    <h3>FACTURE</h3>
                    {/* <h3>BON DE COMMANDE</h3>
                    <h3>BON DE LIVRAISON</h3> */}
                    <p style={{fontSize:18}}>#{(data.invoice_no)?.toString()?.padStart(7 + '', "0")}</p>
                </div>
                <Divider size="md" style={{marginBlock:32}} />
                <div className='invoice-recipient'>
                    <p style={{marginBlock:4}}>Le client; Mr, Mme <b>{data.buyer?.toUpperCase()}</b> doit pour :</p>
                </div>

                <table style={{width: '100%', borderCollapse: 'collapse'}} className="table-receipt"> 
                    <thead style={{backgroundColor:'#e10600', color: '#fff'}}> 
                        <tr> 
                            <th style={{width: '10%', border:'1px solid #eaeaea', padding: '.4rem', textAlign:'right', fontSize:14, fontWeight:600}}>
                                <h3>Qté </h3>
                            </th> 
                            <th style={{width: '50%', border:'1px solid #eaeaea', padding: '.4rem', fontWeight:600, fontSize:14}}>
                                <h3>Désignation</h3>
                            </th> 
                            <th style={{width: '20%', border:'1px solid #eaeaea', padding: '.4rem', textAlign:'right', fontSize:14, fontWeight:600}}>
                                <h3>P.U.</h3>
                            </th> 
                            <th style={{width: '20%', border:'1px solid #eaeaea', padding: '.4rem', textAlign:'right', fontSize:14, fontWeight:600}}>
                                <h3>P.T.</h3>
                            </th> 
                        </tr> 
                    </thead> 
                    <tbody>
                       {selectedItems} 
                       {blankItems}
                    </tbody>
                    <tfoot>
                        <tr key={'foot'} noWrap style={{ marginBottom: 4, marginTop:8}}>
                            {/* <th  style={{width: '12%', textAlign:'right', fontWeight:400, fontSize:14}}></th>
                            <th style={{width: '48%', textAlign:'right', fontWeight:400, fontSize:14}}></th> */}
                            <th colspan="3" style={{width: '20%', border:'1px solid #eaeaea', padding: '.6rem', textAlign:'right', fontWeight:400, fontSize:14}}>Grand Total :</th>
                            <th style={{width: '20%', backgroundColor:'yellow', border:'1px solid #eaeaea', padding: '.6rem', paddingBlock:2, textAlign:'right', fontSize:18, fontWeight:600}}>${parseNumber(data?.total_amount?.toFixed(2))}</th>
                        </tr>
                    </tfoot>
                </table>

                <div className='note'>
                    <div className='terms'>
                        <h5>Termes et conditions</h5>
                        <div>
                            <ol>
                                <li><p> Le client sera facture après avoir indiqué son acceptation du présent devis.</p></li>
                                <li><p> Le paiement sera effectué avant la livraison du service et des biens.</p></li>
                                {data?.observation ? <li><p>{data?.observation}</p></li> : null}
                            </ol>

                            <p style={{marginLeft: 14}}><br />Acceptation du client (signer ci-dessous) : <br/> <br/> <br/></p>

                        </div>
                    </div>
                    <div className='ids'>
                        <p>ID. NAT: 19-G4701-N96624D</p>
                        <p>RCCM: CD/GOM/RCCM/19-A-03920</p>
                        <p>No Impot : A1203558G</p>
                    </div>
                </div>


                
                {/* Here goes the footer */}
                <p className='invoice-footer'>Des questions ? Envoyez-nous un e-mail à l’adresse comego.sarl@gmail.com ou appelez-nous au (+243) 973 659 779; (+243) 994 230 259</p>
                
                {data.isValid ? 
                    (data.isCredit ? <span className="watermark" style={{color:"rgba(255, 154, 2, 0.282)", border: "4px solid rgba(255, 154, 2, 0.28)"}}>à payer</span> : 
                    <span className="watermark" style={{color:"rgba(0, 128, 0, .28)", border: "4px solid rgba(0, 128, 0, .28)"}}>PAYé CASH</span>) :
                <span className="watermark" style={{color:"rgba(244, 37, 0, 0.28)", border: "4px solid rgba(244, 37, 0, 0.28)"}}>ANNULée</span>}

            </div>
            <Divider />

            <div style={{float: 'right', display: 'inline-flex', alignItems: 'center', marginTop: 14}}>
                <ReactToPrint
                    trigger={() => <Button size='sm' loading={printing} leftIcon={<BsPrinter />}  type='submit' color='red'>Imprimer</Button>}
                    content={() => componentRef.current}
                />
            </div>
        </div>
    )
}

export default InvoiceDisplay