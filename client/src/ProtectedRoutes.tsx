import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoutes = () => {
    const {isAuthenticated  , authenticateUser} = useAuthStore()

    useEffect(()=>{
     authenticateUser
    },[])
    return isAuthenticated ?<Outlet/> : <Navigate to= '/login' replace={true}/>
}

export default ProtectedRoutes