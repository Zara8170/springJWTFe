import { createSlice, configureStore } from "@reduxjs/toolkit";
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    jwtToken: null,
    loginFlag: false,
  },
  reducers: {
    saveJwtToken: (state, action) => {
      state.jwtToken = action.payload;
    },
    login: (state) => {
      state.loginFlag = true;
    },
    logout: (state) => {
      state.loginFlag = false;
      state.jwtToken = null;
    },
  },
});
const store = configureStore({
  reducer: {
    userInfo: userInfoSlice.reducer,
  },
});
export const { saveJwtToken, login, logout } = userInfoSlice.actions;
export default store;
