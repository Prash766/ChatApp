import axiosClient from '@/axiosClient'
import {create} from 'zustand'

interface FriendStoreType{
    sendFriendRequest : ()=> Promise<void>
    acceptFriendRequest : ()=> Promise<void>
    rejectFriendRequest : ()=> Promise<void>

}

const useFriendStore= create<FriendStoreType>((set)=> ({

    sendFriendRequest: async()=>{
        try {
            const res = await axiosClient.post('/friends/send-request', {
                
            })
            
        } catch (error) {
            
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