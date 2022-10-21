// /* eslint-disable react-hooks/exhaustive-deps */
// import { useCallback, useEffect, useState } from "react"
// import { Navigate, useNavigate } from "react-router-dom"
// import { useDispatch } from "react-redux";
// import { authUser, logout } from '../redux/slices/sessions'

import { useDispatch } from "react-redux"
import { Navigate } from "react-router-dom"
import { authUser } from "../redux/slices/sessions"

// const withProtect = (SpecificComponent, option) => {
//     return function ChechAuth(props) {
//         const dispatch = useDispatch()
          
//         const [user, setUser] = useState()
//         const navigate = useNavigate()
        
//         useCallback(async () => {
//             const auth = await dispatch(authUser())
            
//             if(auth?.payload) {
//                 setUser(auth?.payload)
//                 if(option) {
//                     navigate(`/auth/${props.path ? props.path : 'dashboard'}`, {replace: true})
//                 }
//             } else {
//                 dispatch(logout())
//                 sessionStorage.clear()
//                 localStorage.clear()
//                 navigate(`/login?expired=true`)
//             }
//         }, [])

//         return <SpecificComponent {...props} user={user} />
//     }
// }

// export default withProtect


export const PrivateRoute = ({ children }) => {
    
    const dispatch = useDispatch()

    const isAuthenticated = async () => {
        const auth = await dispatch(authUser())
        if(auth?.payload) {
            return true
        } 
        return false
    }
        
    if (isAuthenticated()) {
      return children
    }
      
    return <Navigate to="/login?expired=true" />
}

