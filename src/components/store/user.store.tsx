import { create } from "zustand";

interface UserStoreState {
  name: string;
  email: string;
  role: string;
userId: string;
  setUserProfile: (name:string,email:string,role:string,userId:string) => void;
}

const userProfileStore = create<UserStoreState>((set) => ({
  name: "",
  email: "",
  role: "",
  userId: "",
  setUserProfile: (name: string,email:string,role:string,userId:string) => set({ name, email,role,userId }),
}));

export default userProfileStore;