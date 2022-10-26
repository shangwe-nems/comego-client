import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findCommandes } from '../redux/slices/commandes';

export const LoadCommandes = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const commandesFetch = async function(){
            
            const res = await dispatch(findCommandes())
            console.log('Fetching commandes: ', res)
            if(res?.payload) {
                
                setData(res?.payload)
            }
            setisLoading(false);
        }
        commandesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}