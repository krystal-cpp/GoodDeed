import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "@/services/api";
import { AuthState } from "@/types";
import axios from "axios";

const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
const user = userStr ? JSON.parse(userStr) : null;

const initialState: AuthState = {
    user,
    token,
    isAuthenticated: !!token,
    loading: false,
    error: null,
    initialized: false,
    validationErrors: null
};

export const register = createAsyncThunk(
    'auth/register',
    async (data: { username: string; email: string; name: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(data);
            return response.data;
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data;

                if(Array.isArray(errorData.message)) {
                    return rejectWithValue({
                        type: 'validation',
                        errors: errorData.message
                    });
                }

                return rejectWithValue({
                    type: 'general',
                    message: errorData.message || 'Ошибка регистрации'
                });
            }
            return rejectWithValue({
                type: 'general',
                message: 'Ошибка сети'
            });
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (data: { username: string, password: string }, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(data);
            return response.data;
        }
        catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                if (err.response.status === 401) {
                    return rejectWithValue({
                        type: 'general',
                        message: 'Неверное имя пользователя или пароль'
                    });
                }
                return rejectWithValue({
                    type: 'general',
                    message: err.response.data.message || 'Ошибка входа'
                });
            }
            return rejectWithValue({
                type: 'general',
                message: 'Ошибка сети'
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        initializeAuth: (state) => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (token && userStr) {
                    state.token = token;
                    state.user = JSON.parse(userStr);
                    state.isAuthenticated = true;
                }
            }
            state.initialized = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        clearError: (state) => {
            state.error = null;
            state.validationErrors = null;
        },
        updateUserData: (state, action) => {
            state.user = {
                ...state.user,
                ...action.payload
            };
            if(typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(state.user));
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.validationErrors = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.initialized = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        });
        builder.addCase(register.rejected, (state, action: any) => {
            state.loading = false;
            if(action.payload?.type === 'validation') {
                state.validationErrors = action.payload.errors;
            }
            else {
                state.error = action.payload?.message || 'Ошибка регистрации';
            }
        });

        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.validationErrors = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.initialized = true;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        });
        builder.addCase(login.rejected, (state, action: any) => {
            state.loading = false;
            state.error = action.payload?.message || 'Ошибка входа';
        });
    }
});

export const { initializeAuth, logout, clearError, updateUserData } = authSlice.actions;
export default authSlice.reducer; 