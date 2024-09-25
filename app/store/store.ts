// C:\Users\구현주\Desktop\weeds\project\login-app2\app\store\store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
