import axiosClient from '@/axiosClient'
import { toast } from 'sonner'
import {create} from 'zustand'

export type Login = {
    email: string,
    password:string
}
export type SignUp = {
    email: string,
    password:string,
    fullName: string,
    avatar: File
}

export type UserType ={
    fullName: string ,
    email: string,
    password:string,
    profilePic: string,
}



interface AuthStore{
    isAuthenticated : boolean
    isLoggingIn:boolean
    isLoggedIn: boolean
    isSigningUp: boolean
    isSignedUp : boolean
    authUser : UserType | null
    authenticateUser:  () => void
    loginUser: (data:Login) => Promise<any>
    signUpUser : (data : FormData) => Promise<any >
}

const useAuthStore= create<AuthStore>((set)=>({
    isAuthenticated : false,
    authUser: null,
    isLoggedIn:false,
    isSignedUp:false,
    isSigningUp: false,
    isLoggingIn : false,
    authenticateUser  : async()=>{
        const res = await axiosClient.get('/auth/me')
        if(res.status!==200){
            toast.error("Invlaid Login")
            set({isAuthenticated: false})

        }
        set({isAuthenticated: true})
        return res

    },
    loginUser : async(data) =>{
        set({isLoggingIn: true})
        const res = await axiosClient.post("/auth/login", data)
        if(res.status!==200){
            toast.error("Invalid Login or Credentials")
            set({isLoggingIn: false})
        }

        set({authUser : res.data.user})

        set({isLoggedIn:true})
        set({isLoggingIn: false})
        return res

    },
    signUpUser: async (data: FormData) => {
        set({ isSigningUp: true });
        try {
          const res = await axiosClient.post("/auth/signup", data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log(res)
      
          if (res.status !== 200) {
            toast.error("Signup failed");
            set({ isSigningUp: false });
            return;
          }
      
          set({ authUser: res.data.user, isSignedUp: true });
          return res
        } catch (error) {
          toast.error("An error occurred during signup");
        } finally {
          set({ isSigningUp: false });
        }
      }
      
}
)
)

export {
    useAuthStore
}