import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findSales } from '../redux/slices/sales';

export const LoadSales = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const salesFetch = async function(){
            
            const res = await dispatch(findSales())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        salesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}