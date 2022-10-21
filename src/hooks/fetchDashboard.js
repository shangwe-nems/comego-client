import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { _getDashboardResult } from '../services/lib/result';

export const LoadDashboardData = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const resultsFetch = async function(){
            
            const res = await _getDashboardResult()
            
            if(res?.data) {
                setData(res?.data)
            }
            setisLoading(false);
        }
        
        resultsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}