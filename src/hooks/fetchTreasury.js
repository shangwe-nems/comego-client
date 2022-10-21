import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findTreasurys } from '../redux/slices/treasurys';

export const LoadTreasuries = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const treasurysFetch = async function(){
            
            const res = await dispatch(findTreasurys())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        treasurysFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}