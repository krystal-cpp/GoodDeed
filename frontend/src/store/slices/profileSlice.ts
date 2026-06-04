import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersAPI } from '@/services/api';
import { User } from '@/types';
import axios from 'axios';
import { logout } from './authSlice';

interface ProfileState {
    profile: User | null;
    loading: boolean;
    error: string | null;
    validationErrors: string[] | null;
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
    validationErrors: null,
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
    const response = await usersAPI.getProfile();
    return response.data;
});

export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (data: { username?: string, email?: string, name?: string, password?: string }, { rejectWithValue }) => {
        try {
            const response = await usersAPI.updateProfile(data);
            return response.data;
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data;
                if (Array.isArray(errorData.message)) {
                    return rejectWithValue({ type: 'validation', errors: errorData.message });
                }
                return rejectWithValue({ type: 'general', message: errorData.message || 'Ошибка обновления' });
            }
            return rejectWithValue({ type: 'general', message: 'Ошибка сети' });
        }
    }
);

export const deleteProfile = createAsyncThunk(
    'profile/deleteProfile',
    async (_, { dispatch }) => {
        await usersAPI.deleteProfile();
        dispatch(logout());
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
        });
        builder.addCase(fetchProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Ошибка загрузки профиля';
        });

        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.validationErrors = null;
        });
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;

            if(typeof window !== 'undefined') {
                const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                const updatedUser = { ...currentUser, ...action.payload };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('userUpdated'));
            }
        });
        builder.addCase(updateProfile.rejected, (state, action: any) => {
            state.loading = false;
            if(action.payload?.type === 'validation') {
                state.validationErrors = action.payload.errors;
            }
            else {
                const message = action.payload?.message || 'Ошибка обновления профиля';
                if(message.toLowerCase().includes('username')) {
                    state.validationErrors = ['username ' + message];
                }
                else if (message.toLowerCase().includes('email')) {
                    state.validationErrors = ['email ' + message];
                }
                else {
                    state.error = message;
                }
            }
        });
    }
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;