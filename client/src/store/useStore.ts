import axiosClient from '@/axiosClient'
import { toast } from 'sonner'
import { create } from 'zustand'
import { UserType } from './useAuthStore'

interface ChatStoreType {
    messages: any[],
    users: any[],
    selectedUser: UserType | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean
    getUsers :()=> Promise<any>
    getMessages: (userId: string)=> Promise<any>
    setSelectedUser : (selectedId :UserType) => void
}

export const useChatStore = create<ChatStoreType>((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axiosClient.get('/messages/users')

            set({ users: res.data.filteredUsers })

        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
        finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axiosClient.get(`/messages/${userId}`)
            set({ messages: res.data.messages })

        } catch (error: any) {
            toast.error(error.response.data.message)

        }
        finally {
            set({ isMessagesLoading: false })
        }
    },
    setSelectedUser: (selectedUser)=> set({selectedUser : selectedUser}) 

}
)
)
