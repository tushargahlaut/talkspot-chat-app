import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isLogin : false,
    isFetching: false,
    error: false,
    allChats: [],
    selectedChat: null,
    notifications:[]
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.isLogin = true;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isLogin = false;
      state.allChats = [];
      state.selectedChat = null;
      state.notifications = [];
    },
    addAllChats: (state, action) => {
      state.allChats = action.payload;
    },
    addGroupChat:(state,action) => {
      state.allChats = [...state.allChats, action.payload];
    },
    renameGroupChat:(state,action)=>{
        const index = state.allChats.findIndex((item)=>item._id === action.payload._id);
        state.allChats[index].chatName = action.payload.chatName; 
        state.selectedChat.chatName = action.payload.chatName;
    },
    removeMemberFromGroupChat:(state,action)=>{
        const index = state.selectedChat.users.findIndex((item)=>item._id === action.payload.e._id);
        const newArr = [...state.selectedChat.users];
        newArr.splice(index,1);
        state.selectedChat.users = newArr;
        const index2 = state.allChats.findIndex((item)=>item._id === state.selectedChat._id);
        state.allChats[index2].users = newArr;
    },
    addMemberToGroupChat:(state,action)=>{
         const newMember = action.payload.e;
         state.selectedChat.users = [...state.selectedChat.users,newMember];
        const index2 = state.allChats.findIndex(
          (item) => item._id === state.selectedChat._id
        );
        state.allChats[index2].users = state.selectedChat.users;

    },

    leaveGroupChat:(state,action)=>{
        const index = state.allChats.findIndex((item)=>item._id === state.selectedChat._id);
        const newArr = [...state.allChats];
        newArr.splice(index,1);
        state.allChats = newArr;  
        state.selectedChat = null;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    addNotifications:(state,action)=>{
      state.notifications = [action.payload,...state.notifications];
      const uniqueMap = {};
      state.notifications.forEach(obj=>{
        uniqueMap[obj._id] = obj;
      });
      state.notifications = Object.values(uniqueMap);
      console.log("Notif",action.payload);
    },
    removeNotification: (state,action)=>{
      const index = state.notifications.findIndex((item)=>item._id === action.payload._id);
      const newArr = [...state.notifications];
      newArr.splice(index,1);
      state.notifications = newArr;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setSelectedChat,
  addGroupChat, 
  addAllChats,
  renameGroupChat,
  removeMemberFromGroupChat,
  addMemberToGroupChat,
  leaveGroupChat,
  addNotifications,
  removeNotification
} = userSlice.actions;
export default userSlice.reducer;
