import axiosClient from '@/axiosClient'
import { toast } from 'sonner'
import { create } from 'zustand'

interface ChatStoreType {
    messages: any[],
    users: any[],
    selectedUser: any,
    isUsersLoading: boolean,
    isMessagesLoading: boolean


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
            set({ users: res.data.users })

        } catch (error: any) {
            toast.error(error.response.data.message)
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
    }

}
)
)
