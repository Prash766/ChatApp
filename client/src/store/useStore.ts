import axiosClient from "@/axiosClient";
import { toast } from "sonner";
import { create } from "zustand";
import { FriendsType, UserType } from "./useAuthStore";
import { Socket } from "socket.io-client";
import { Message } from "@/components/ChatWindow";

interface UserChatState {
  messages: Message[];
  cursor: string | null;
  hasMoreMessages: boolean;
  isLoadingMessages: boolean;
}

interface Payload {
  receiverId: string;
  isTyping: boolean;
  senderId: string;
}



interface ChatStoreType {
  messages: any[],
  users: any[];
  selectedUser: UserType | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isUserTyping: Payload | null;
  nextCursor: string | null;
  nextMessageCursor: string ,
  hasMore: boolean;
  onlineUsers: any[];
  isMessageSending: boolean;
  isUsersSidebarLoading: boolean;
  userChatStates: Record<string, UserChatState>;
  userSidebar: FriendsType;
  lastMessage: Message | null;

  fetchedMessageOnce: (chatId: string) => Promise<void>;
  setLastMessage: (message: Message) => void;
  setUserSidebar: (sidebarUsers: FriendsType) => void;
  setUsers: (newUsers: any[]) => void;
  setIsUserTyping: (data: Payload) => void;
  setOnlineUsers: (userIds: any[]) => void;
  subscribeToMessages: (socket: Socket) => void;
  unsubscribeFromMessages: (socket: Socket) => void;
  getUserSideBar: () => Promise<void>;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessages: (messageData: any) => Promise<any>;
  setSelectedUser: (selectedUser: UserType) => void;
}

export const useChatStore = create<ChatStoreType>((set, get) => ({
  messages:[],
  nextMessageCursor :"",
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isUserTyping: null,
  nextCursor: "",
  hasMore: true,
  onlineUsers: [],
  isMessageSending: false,
  isUsersSidebarLoading: false,
  userChatStates: {},
  userSidebar: {} as FriendsType,
  hasMoreMessages : true,
  lastMessage: null,


  setUserSidebar: (sidebarUsers) => {
    set({ userSidebar: sidebarUsers });
  },
  setLastMessage: (message) => {
    set({ lastMessage: message });
  },
  setUsers: (newUsers) => {
    set({ users: newUsers });
  },
  getUsers: async () => {
    if (!get().hasMore) return;
    set({ isUsersLoading: true });
    try {
      const res = await axiosClient.get(`/messages/users?cursor=${get().nextCursor}`);
      const newUsers = res.data.allUsers.users;
      const map = new Map<string, any>();
      [...get().users, ...newUsers].forEach((user) => map.set(user._id, user));
      set({
        users: Array.from(map.values()),
        nextCursor: res.data.allUsers.nextCursor || null,
        hasMore: !!res.data.allUsers.nextCursor,
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getUserSideBar: async () => {
    set({ isUsersSidebarLoading: true });
    try {
      const res = await axiosClient.get("/messages/sidebar_users");
      set({ userSidebar: res.data.user });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isUsersSidebarLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    const userState = get().userChatStates[userId] || {
      messages: [],
      cursor: null,
      hasMoreMessages: true,
      isLoadingMessages: false,
    };

    if (!userState.hasMoreMessages || userState.isLoadingMessages) return;

    set((state) => ({
      userChatStates: {
        ...state.userChatStates,
        [userId]: { ...userState, isLoadingMessages: true },
      },
    }));

    try {
      const res = await axiosClient.get(`/messages/${userId}?cursor=${userState.cursor || ""}`);
      const fetchedMessages = res.data.messages;
      const newCursor = res.data.cursor;

      set((state) => ({
        userChatStates: {
          ...state.userChatStates,
          [userId]: {
            messages: [...fetchedMessages, ...userState.messages],
            cursor: newCursor,
            hasMoreMessages: !!newCursor,
            isLoadingMessages: false,
          },
        },
      }));
      console.log("user chat states in Get Messages function",get().userChatStates[userId])
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to fetch messages.");
      set((state) => ({
        userChatStates: {
          ...state.userChatStates,
          [userId]: { ...userState, isLoadingMessages: false },
        },
      }));
    }
  },
  fetchedMessageOnce: async (userId) => {
    try {
      const res = await axiosClient.get(`/messages/${userId}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  },
  // setSelectedUser: (selectedUser) => {
  //   // Reset message state when switching users
  //   set((state) => ({
  //     selectedUser,
  //     userChatStates: {
  //     ...state.userChatStates,
  //     [selectedUser._id]: {
  //       messages: [],
  //       cursor: null,
  //       hasMoreMessages: true,
  //       isLoadingMessages: false,
  //     },
  //     },
  //   }));
  //   },
  setSelectedUser: (selectedUser) => {
    set((state) => {
      // Only initialize the chat state if it doesn't exist
      const existingChatState = state.userChatStates[selectedUser._id];
      
      return {
        selectedUser,
        userChatStates: {
          ...state.userChatStates,
          [selectedUser._id]: existingChatState || {
            messages: [],
            cursor: null,
            hasMoreMessages: true,
            isLoadingMessages: false,
          },
        },
      };
    });
  },

    sendMessages: async (messageData: any) => {
    set({isMessageSending: true})
    let toast_id;
    
    for(let [_ , value] of messageData.entries()){
      if(get().isMessageSending && (value instanceof File || value instanceof FileList)) { 
      toast_id = toast.loading("Sending Message")
      break;
      }
    }
    
    const { selectedUser, userChatStates } = get();
    if (!selectedUser?._id) return;
    
    try {
      const res = await axiosClient.post(
      `/messages/send/${selectedUser._id}`,
      messageData
      );
      
      const currentUserState = userChatStates[selectedUser._id] || {
      messages: [],
      cursor: null,
      hasMoreMessages: true,
      isLoadingMessages: false,
      };
      
      set((state) => ({
      userChatStates: {
        ...state.userChatStates,
        [selectedUser._id]: {
        ...currentUserState,
        messages: [...currentUserState.messages, res.data.data],
        },
      },
      isMessageSending: false
      }));

      if(res.status === 200){
      for(let [_ , value] of messageData.entries()){
        if(value instanceof File || value instanceof FileList){
        toast.success("Message Sent");
        toast.dismiss(toast_id);
        break;
        }
      }
      }
      return res;
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
      toast.dismiss(toast_id)
      set({ isMessageSending: false });
    }
    },
    setOnlineUsers: (userIds) => {
    set({ onlineUsers: userIds });
  },
  subscribeToMessages: (socket) => {
    const { selectedUser } = get();
    if (!selectedUser?._id) return;

    socket.on("newMessage", (newMessage) => {
      set((state) => {
        const currentUserState = state.userChatStates[selectedUser._id];
                if (!currentUserState) {
          return state;
        }

        return {
          userChatStates: {
            ...state.userChatStates,
            [selectedUser._id]: {
              ...currentUserState,
              messages: [...currentUserState.messages, newMessage],
            },
          },
        };
      });
    });
  },
  
  unsubscribeFromMessages: (socket) => {
    socket.off("newMessage");
  },
  setIsUserTyping: (value) => {
    set({ isUserTyping: value });
  },
  
}));
