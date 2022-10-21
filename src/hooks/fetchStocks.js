import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findStocks } from '../redux/slices/stocks';

export const LoadStocks = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const stocksFetch = async function(){
            
            const res = await dispatch(findStocks())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        stocksFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}