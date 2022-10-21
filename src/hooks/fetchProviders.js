import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findProviders } from '../redux/slices/providers';

export const LoadProviders = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const providersFetch = async function(){
            
            const res = await dispatch(findProviders())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        providersFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}