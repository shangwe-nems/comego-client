import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const apiClient = axios.create({
    // baseURL: 'http://192.168.2.100:1337/api',
    baseURL: 'http://localhost:1337/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: false
})

apiClient.interceptors.request.use(request => {
    const accessToken = sessionStorage.getItem('accessToken')
    const refreshToken = sessionStorage.getItem('refreshToken')

    if(accessToken) {
        request.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    request.Cookie = `refreshToken=${refreshToken}`

    return request
})

apiClient.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        // const navigate = useNavigate()
        let res = error.response;
        if(res.status === 401 || res.status === 403) {
            sessionStorage.clear()
            localStorage.clear()
            // window.location.href = 'http://192.168.2.100:3000/#/login?expired=true'
            // navigate('/login?expired=true', { replace: true })
            // useNavigate('/login?expired=true', { repla})
            window.location.href = 'http://localhost:3000/#/login?expired=true'
        }
        return Promise.reject(error.response.data)
    }
)


export default apiClient