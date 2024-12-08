import axiosClient from "@/axiosClient";
import { toast } from "sonner";
import { create } from "zustand";

export type Login = {
  email: string;
  password: string;
};

export type SignUp = {
  email: string;
  password: string;
  fullName: string;
  avatar: File;
};

export type UserType = {
    _id: string;
    fullName: string;
    email: string;
    profilePic: string;
    createdAt: string;
};

interface AuthStore {
  isAuthenticated: boolean;
  isLoggingIn: boolean;
  isLoggedIn: boolean;
  isSigningUp: boolean;
  isLoading: boolean;
  isSignedUp: boolean;
  isUploading : boolean
  authUser: UserType | null;
  authenticateUser: () => Promise<any>;
  loginUser: (data: Login) => Promise<any>;
  signUpUser: (data: FormData) => Promise<any>;
  logOut: () => Promise<any>;
  updateProfile: (avatar: File) => Promise<any>;
  getUserInfo : ()=> Promise<any>
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  authUser: {
    _id: "",
    fullName: "",
    email: "",
    profilePic: "",
    createdAt: "",
  },
  isUploading: false,
  isLoggedIn: false,
  isSignedUp: false,
  isLoading: true,
  isSigningUp: false,
  isLoggingIn: false,
  authenticateUser: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosClient.get("/auth/me");
      if (res.status !== 200) {
        set({ isAuthenticated: false });
        return;
      }
      set({ isAuthenticated: true, authUser: res.data.user });
    } catch (error) {
      console.error("Authentication failed:", error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  loginUser: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosClient.post("/auth/login", data);
      toast.success("Login Successfull");
      set({ authUser: res.data.user });
      set({ isAuthenticated: true });
      set({ isLoggedIn: true });
      set({ isLoggingIn: false });
      return res;
    } catch (error) {
      console.log(error);
      toast.error("Invalid Login Credentials");
      set({ isLoggedIn: false });

      set({ isLoggingIn: false });
    }
  },
  signUpUser: async (data: FormData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosClient.post("/auth/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);

      if (res.status !== 200) {
        toast.error("Signup failed");
        set({ isSigningUp: false });
        return;
      }

      set({ authUser: res.data.user, isSignedUp: true });
      return res;
    } catch (error) {
      toast.error("An error occurred during signup");
    } finally {
      set({ isSigningUp: false });
    }
  },
  logOut: async () => {
    const res = await axiosClient.get("/auth/logout");
    if (res.status !== 200) {
      toast.error(res.data.message);
    }
    set({ isAuthenticated: false });
    return res;
  },
  updateProfile: async (avatar: File) => {
    set({ isUploading: true }); 
 try {
       const formData = new FormData();
       formData.append("profileImage", avatar);
       const res = await axiosClient.put("/auth/update-profile", formData, {
         headers: {
           "Content-type": "multipart/form-data",
         },
       });
    
       set({isUploading : false})
       return res;
 } catch (error:any) {
    set({isUploading : false})
    toast.error(`${error.message || "Profile Update Failed"}`);
}
  },
  getUserInfo :async()=>{
try {
        const res =  await axiosClient.get('/auth/user')
        console.log( res)
        set({authUser :res.data.user})
        return res
} catch (error:any) {
    console.log(error)
    toast.error(`${error.message|| "Profile Upload Failed"}`)
    
}
    
}
}));

export { useAuthStore };
