import axiosClient from '@/axiosClient'
import { AxiosResponse } from 'axios'
import {create} from 'zustand'
import { UserType } from './useAuthStore';
import { toast } from 'sonner';


export interface PendingFriend {
    _id: string;           
    senderId: string;      
    receiverId: string;    
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' 
    createdAt: string;  
    cooldown : string,  
    senderInfo : UserType
    receiverInfo: UserType
}


interface FriendStoreType{
    friendRequestReceiver: string,
    notificationCount : number,
    pendingFriendList : PendingFriend[]
    setFriendRequestReceiver : (receiverId: string)=> void
    setPendingList : (list : PendingFriend[])=> void
    getPendingFriendList : ()=> Promise<void>
    setNotificationCount : (notificationCount : number) => void
    sendFriendRequest : ()=> Promise<AxiosResponse >
    acceptFriendRequest : (id : string , receiverId: string)=> Promise<void>
    rejectFriendRequest : (receiverId : string,  id:string)=> Promise<void>

}

const useFriendStore= create<FriendStoreType>((set , get)=> ({

    friendRequestReceiver : "",
    notificationCount : 0,
    pendingFriendList: [],
    setNotificationCount : (notificationCount : number)=>{
        set({notificationCount : notificationCount})
    },

    setPendingList : (list)=>{
        set({pendingFriendList : list})


    },

    getPendingFriendList :async()=>{
        const res = await axiosClient.get("/friends/pending-list")
        set({pendingFriendList : res.data.pendingList})

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

    acceptFriendRequest: async(id , senderId)=>{
        try {
            const res = await axiosClient.put("/friends/accept-request",{
                senderId ,
                id
            })
            if(res.status===200){
                toast.success("Friend Request Accepted")
            }
            
        } catch (error) {
            console.log(error)
        }
    },

    rejectFriendRequest: async(senderId , id)=>{
        try {
            const res = await axiosClient.put("/friends/reject-request",{
                senderId,
                id
            })
            if(res.status===200){
                toast.success("Request Rejected")
            }
            return res.data
        } catch (error) {
            console.log(error)
            
        }
    }


})
)

export default useFriendStore