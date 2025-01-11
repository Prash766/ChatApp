import axiosClient from "@/axiosClient";
import { toast } from "sonner";
import { create } from "zustand";
import { FriendsType, UserType } from "./useAuthStore";
import { Socket } from "socket.io-client";
import { Message } from "@/components/ChatWindow";


interface Payload {
  receiverId: string;
  isTyping: boolean;
  senderId : string
}

interface ChatStoreType {
  messages: Message[];
  users: any[];
  selectedUser: UserType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isUserTyping : Payload | null
  nextCursor : string
  hasMore : boolean
  hasMoreMessages : boolean
  onlineUsers: any[];
  isMessageSending : boolean;
  isUsersSidebarLoading : boolean
  getMessagesNextCursor : string,
  userSidebar : FriendsType ,
  lastMessage : Message,
  setLastMessage: (message : Message) => void,
  setUserSidebar : (sidebarUsers: FriendsType )=> void
  setUsers: (newUsers: any[]) => void
  setIsUserTyping:  (data : Payload)=> void
  setOnlineUsers: (userIds: any[]) => void;
  subscribeToMessages : (socket :Socket)=> void,
  unsubscribeFromMessages :(socket :Socket) => void
  getUserSideBar: ()=> Promise<any>
  getUsers: () => Promise<any>;
  getMessages: (userId: string) => Promise<any>;
  setSelectedUser: (selectedId: UserType) => void;
  sendMessages: (messageData: any) => Promise<any>;
}

export const useChatStore = create<ChatStoreType>((set, get) => ({
  messages: [],
  users: [],
  hasMore: true,
  hasMoreMessages : true,
 lastMessage :{}  as Message,
  nextCursor : "",
  getMessagesNextCursor : "",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending : false,
  isUserTyping : null,
  onlineUsers: [],
  isUsersSidebarLoading:false,
  userSidebar: {} as FriendsType,

  setUserSidebar: (sidebarUsers)=>{
    set({userSidebar : sidebarUsers})

  },
  setLastMessage: (message)=> {
    set({lastMessage:  message})
    
  },

  setUsers: (newUsers)=>{
    set({users : newUsers})
  },


  getUsers: async () => {
    if (!get().hasMore) return;
    set({ isUsersLoading: true });
    try {
      
      const res = await axiosClient.get(
        `/messages/users?cursor=${get().nextCursor}`
      );
      console.log("respons ", res.data.allUsers.users)
      const newUsers = res.data.allUsers.users;
      const map = new Map<string, any>();
      [...get().users, ...newUsers].forEach(user => map.set(user._id, user));
      const users = Array.from(map.values());
      set({
        users,
        nextCursor: res.data.allUsers.nextCursor,
        hasMore: !!res.data.allUsers.nextCursor, 
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getUserSideBar :async()=> {
    set({isUsersSidebarLoading: true})
    try {
      const res = await axiosClient.get('/messages/sidebar_users')
      
      set({userSidebar : res.data.user})

    } catch (error) {
      console.log(error)
    }finally{
      set({isUsersSidebarLoading: false})
    }
    
  },


  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosClient.get(`/messages/${userId}?cursor=${get().getMessagesNextCursor}`);
      console.log("HAS MORE",res.data.hasMore)
      set({ messages: [...res.data.messages ,...get().messages] });
      set({getMessagesNextCursor : res.data.cursor})
      set({hasMoreMessages : res.data.hasMore})
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
    for(let [_ , value] of messageData.entries()){
      if(get().isMessageSending && (value instanceof File || value instanceof FileList)) { 
        toast_id = toast.loading("Sending Message")
        break;

      }

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
        for(let [_ , value] of messageData.entries()){
          if(value instanceof File || value instanceof FileList){

            toast.success("Message Sent")
            toast.dismiss(toast_id)
            break;
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
