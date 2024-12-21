import axiosClient from "@/axiosClient";
import { toast } from "sonner";
import { create } from "zustand";
import { UserType } from "./useAuthStore";
import { useSocket } from "@/contexts/SocketContext";
import { Socket } from "socket.io-client";


interface Payload {
  receiverId: string;
  isTyping: boolean;
  senderId : string
  

}

interface ChatStoreType {
  messages: any;
  users: any[];
  selectedUser: UserType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isUserTyping : Payload | null
  onlineUsers: any[];
  isMessageSending : boolean;
  setIsUserTyping:  (data : Payload)=> void
  setOnlineUsers: (userIds: any[]) => void;
  subscribeToMessages : (socket :Socket)=> void,
  unsubscribeFromMessages :(socket :Socket) => void
  getUsers: () => Promise<any>;
  getMessages: (userId: string) => Promise<any>;
  setSelectedUser: (selectedId: UserType) => void;
  sendMessages: (messageData: any) => Promise<any>;
}

export const useChatStore = create<ChatStoreType>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending : false,
  isUserTyping : null,
  onlineUsers: [],

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosClient.get("/messages/users");

      set({ users: res.data.filteredUsers });
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosClient.get(`/messages/${userId}`);
      set({ messages: res.data.messages });
      return res
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),
  sendMessages: async (messageData: any) => {
    set({isMessageSending: true})
    let toast_id;
    console.log("message data",messageData)
    for(let [key , value] of messageData.entries()){
      if(get().isMessageSending && (value instanceof File || value instanceof FileList)) { toast_id = toast.loading("Sending Message")}

    }
    const { messages, selectedUser } = get();
    try {
      const res = await axiosClient.post(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.data] });
      console.log( "messages" , messages)
      if(res.status===200){
        set({isMessageSending:false})
        for(let [key , value] of messageData.entries()){
          if(value instanceof File || value instanceof FileList){

            toast.success("Message Sent")
            toast.dismiss(toast_id)
          }
        }
      }
      return res;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  },
  setOnlineUsers: (userIds) => set({ onlineUsers: userIds }),
  subscribeToMessages: (socket) => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    socket?.on("newMessage", (newMessage) => {
      console.log("new message" , newMessage)
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages : (socket)=>{
    socket?.off("newMessage")
  },

  setIsUserTyping  : (value : Payload)=>{
    set({isUserTyping : value})
  }
})); 
