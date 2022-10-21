import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { findPermissions } from '../redux/slices/permissions';

export const LoadPermissions = () => {
    const dispatch = useDispatch();
    const [isLoading, setisLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisLoading(true);
        const permissionsFetch = async function(){
            
            const res = await dispatch(findPermissions())
            if(res?.payload) {
                setData(res?.payload)
            }
            setisLoading(false);
        }
        permissionsFetch()
        
    }, [dispatch]);

    return [isLoading, data];
}