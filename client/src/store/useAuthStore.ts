import axiosClient from '@/axiosClient'
import { toast } from 'sonner'
import {create} from 'zustand'

interface AuthStore{
    isAuthenticated : boolean,
    authenticateUser:  () => void
}

const useAuthStore= create<AuthStore>((set)=>({
    isAuthenticated : false,
    authenticateUser  : async()=>{
        const res = await axiosClient.get('/auth/me')
        if(res.status!==200){
            toast.error("Invlaid Login")
        
        }
        set({isAuthenticated: true})
    }
}
)
)

export {
    useAuthStore
}