import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import deedsReducer from './slices/deedsSlice';
import friendsReducer from './slices/friendsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        goodDeeds: deedsReducer,
        friends: friendsReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;