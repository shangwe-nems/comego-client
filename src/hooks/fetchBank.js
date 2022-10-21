import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findBanks } from '../redux/slices/banks';

export const LoadBanks = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const banksFetch = async function(){
            
            const res = await dispatch(findBanks())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        banksFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}