import axiosClient from '@/axiosClient'
import { AxiosResponse } from 'axios'
import {create} from 'zustand'

interface FriendStoreType{
    friendRequestReceiver: string,
    notificationCount : number
    setFriendRequestReceiver : (receiverId: string)=> void
    setNotificationCount : (notificationCount : number) => void
    sendFriendRequest : ()=> Promise<AxiosResponse >
    acceptFriendRequest : ()=> Promise<void>
    rejectFriendRequest : ()=> Promise<void>

}

const useFriendStore= create<FriendStoreType>((set , get)=> ({

    friendRequestReceiver : "",
    notificationCount : 0,
    setNotificationCount : (notificationCount : number)=>{
        set({notificationCount : notificationCount})
    },

    setFriendRequestReceiver: (receiverId)=> {
        set({friendRequestReceiver : receiverId})
        
    },

    sendFriendRequest: async()=>{
        try {
            const res = await axiosClient.post('/friends/send-request', {
                receiverId : get().friendRequestReceiver
                
            })
            console.log(res)
            return res
            
        } catch (error) {
            throw error
        }
    },

    acceptFriendRequest: async()=>{
        try {
            
        } catch (error) {
            
        }
    },

    rejectFriendRequest: async()=>{
        try {
            
        } catch (error) {
            
        }
    }


})
)

export default useFriendStore