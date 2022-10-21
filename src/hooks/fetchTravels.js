import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findTravels } from '../redux/slices/travels';

export const LoadTravels = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const travelsFetch = async function(){
            
            const res = await dispatch(findTravels())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        travelsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}