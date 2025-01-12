import axios from 'axios'

const axiosClient= axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL as string,
    withCredentials:true
})


export default axiosClient