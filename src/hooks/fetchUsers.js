import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findUsers } from '../redux/slices/users';

export const LoadUsers = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const usersFetch = async function(){
            
            const res = await dispatch(findUsers())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        usersFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}