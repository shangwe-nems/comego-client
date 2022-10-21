import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findResults } from '../redux/slices/results';

export const LoadResults = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const resultsFetch = async function(){
            
            const res = await dispatch(findResults())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        resultsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}