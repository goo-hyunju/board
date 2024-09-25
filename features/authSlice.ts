// C:\Users\구현주\Desktop\weeds\project\login-app2\features\authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = true;
      state.token = action.payload; // 토큰 저장
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null; // 로그아웃 시 토큰 삭제
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
