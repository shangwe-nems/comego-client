import React from 'react'
import Footer from '../../layouts/Footer'
import './mainpage.scss'
import SideBar from '../../layouts/SideBar';
import { Route, Routes } from 'react-router-dom';
import Reports from '../Reports';
import Error from '../Error';
import Settings from '../Settings';
import Dashboard from '../Dashboard';
import Sales from '../Sales'
import Clients from '../Clients'
import Inventory from '../Inventory'
import Achats from '../Achats';
import Finances from '../Finance';
import Travels from '../Travels';
import Providers from '../Providers';

function MainPage() {
    return (
        <div className='app'>
            <div className='mainContent'>
                <SideBar />
                <div className='sectionData'> 
                    <Routes>
                        <Route path='dashboard' element={<Dashboard path='dashboard'/>} />
                        <Route path='achats' element={<Achats path='achats' />} />
                        <Route path='inventory' element={<Inventory path='inventory' />} />
                        <Route path='finances' element={<Finances path='finances' />} />
                        <Route path='clients' element={<Clients path='clients' />} />
                        <Route path='sales' element={<Sales path='sales' />} />
                        <Route path='travels' element={<Travels path='travels' />} />
                        <Route path='providers' element={<Providers path='providers' />} />
                        <Route path='reports' element={<Reports path='reports' />} />
                        <Route path='settings' element={<Settings path='settings' />} />
                        <Route path="*" element={<Error error_type={404} />}/> 
                    </Routes>
                </div>
                <Footer />
            </div>            
        </div>
    )
}

export default MainPage