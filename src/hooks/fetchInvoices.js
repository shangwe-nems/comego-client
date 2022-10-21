import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findInvoices } from '../redux/slices/invoices';

export const LoadInvoices = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const invoicesFetch = async function(){
            
            const res = await dispatch(findInvoices())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        invoicesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}