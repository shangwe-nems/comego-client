import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findMotives } from '../redux/slices/motives';

export const LoadMotives = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const motivesFetch = async function(){
            
            const res = await dispatch(findMotives())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        motivesFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}