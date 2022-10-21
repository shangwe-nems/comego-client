import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findPurchases } from '../redux/slices/purchases';

export const LoadPurchases = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const clientsFetch = async function(){
            
            const res = await dispatch(findPurchases())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        clientsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}