import { createSlice } from "@reduxjs/toolkit";

// 🧠 Load user từ localStorage nếu có
const userFromStorage = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: userFromStorage || null, // ✅ giữ đăng nhập sau reload
      isFetching: false,
      error: false,
    },
    register: {
      success: false,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    // ===== LOGIN =====
    loginStart: (state) => {
      state.login.isFetching = true;
    },

    loginSuccess: (state, action) => {
      const user = action.payload;
      const normalizedUser = {
        ...user,
        _id: user._id || user.id,
      };

      state.login.isFetching = false;
      state.login.currentUser = normalizedUser;
      state.login.error = false;
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    loginFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },

    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.success = true;
      state.register.error = false;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    logout: (state) => {
      state.login.currentUser = null;
      state.login.isFetching = false;
      state.login.error = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    // ===== UPDATE USER =====
    updateUserStart: (state) => {
      state.login.isFetching = true;
    },

    updateUserSuccess: (state, action) => {
      const user = action.payload;

      const normalizedUser = {
        ...user,
        _id: user._id || user.id,
      };

      state.login.isFetching = false;
      state.login.currentUser = normalizedUser;
      state.login.error = false;

      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    updateFailed: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailed,
  registerStart,
  registerSuccess,
  registerFailed,
  logout,
  updateUserStart,
  updateUserSuccess,
  updateFailed,
} = authSlice.actions;

export default authSlice.reducer;
