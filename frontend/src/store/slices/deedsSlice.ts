import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deedsAPI } from "@/services/api";
import { GoodDeed } from "@/types";
import axios from "axios";

interface DeedsState {
    deeds: GoodDeed[];
    currentDeed: GoodDeed | null;
    loading: boolean;
    error: string | null;
}

const initialState: DeedsState = {
    deeds: [],
    currentDeed: null,
    loading: false,
    error: null,
}

export const fetchMyDeeds = createAsyncThunk(
    'deeds/fetchMyDeeds', async () => {
        const response = await deedsAPI.getMyDeeds();
        return response.data;
    });

export const fetchDeedById = createAsyncThunk(
    'deeds/fetchDeedById', async (id: number) => {
        const response = await deedsAPI.fetchDeedById(id);
        return response.data;
    });

export const createDeed = createAsyncThunk(
    'deeds/createDeed', async (data: { title: string, description?: string }, { rejectWithValue }) => {
        try {
            const response = await deedsAPI.createDeed(data);
            return response.data;
        }
        catch(err) {
            if(axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data;

                if(Array.isArray(errorData.message)) {
                    return rejectWithValue({
                        type: 'validation',
                        errors: errorData.message
                    });
                }

                return rejectWithValue({
                    type: 'general',
                    message: errorData.message || 'Ошибка создания дела'
                });
            }
            return rejectWithValue({
                type: 'general',
                message: 'Ошибка сети'
            });
        }
    });

export const updateDeed = createAsyncThunk(
    'deeds/updateDeed', async ({ id, data }: { id: number, data: { title?: string, description?: string, status?: boolean } }, { rejectWithValue }) => {
        try {
            const response = await deedsAPI.updateDeed(id, data);
            return response.data;
        }
        catch(err) {
            if(axios.isAxiosError(err) && err.response) {
                const errorData = err.response.data;

                if(Array.isArray(errorData.message)) {
                    return rejectWithValue({
                        type: 'validation',
                        errors: errorData.message
                    });
                }

                return rejectWithValue({
                    type: 'general',
                    message: errorData.message || 'Ошибка обновления дела'
                });
            }
            return rejectWithValue({
                type: 'general',
                message: 'Ошибка сети'
            });
        }
        
    });

export const deleteDeed = createAsyncThunk(
    'deeds/deleteDeed', async (id: number) => {
        await deedsAPI.deleteDeed(id);
        return id;
    });

const deedsSlice = createSlice({
    name: 'goodDeeds',
    initialState,
    reducers: {
        clearCurrentDeed: (state) => {
            state.currentDeed = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMyDeeds.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchMyDeeds.fulfilled, (state, action) => {
            state.loading = false;
            state.deeds = action.payload;
        });
        builder.addCase(fetchMyDeeds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Ошибка загрузки дел';
        });

        builder.addCase(fetchDeedById.fulfilled, (state, action) => {
            state.currentDeed = action.payload;
        });

        builder.addCase(createDeed.pending, (state) => {
            state.error = null;
        });
        builder.addCase(createDeed.fulfilled, (state, action) => {
            state.deeds.unshift(action.payload);
        });
        builder.addCase(createDeed.rejected, (state, action: any) => {
            if(action.payload?.type === 'validation') {
                //state.validationErrors = action.payload.errors;
            }
            else {
                state.error = action.payload?.message || 'Ошибка создания дела';
            }
        });

        builder.addCase(updateDeed.pending, (state) => {
            state.error = null;
        });
        builder.addCase(updateDeed.fulfilled, (state, action) => {
            const index = state.deeds.findIndex((d) => d.id === action.payload.id);
            if(index !== -1) state.deeds[index] = action.payload;

            state.currentDeed = action.payload;
        });
        builder.addCase(updateDeed.rejected, (state, action: any) => {
            if(action.payload?.type === 'validation') {
                //state.validationErrors = action.payload.errors;
            }
            else {
                state.error = action.payload?.message || 'Ошибка обновления дела';
            }
        });

        builder.addCase(deleteDeed.fulfilled, (state, action) => {
            state.deeds = state.deeds.filter((d) => d.id !== action.payload);
        });
    }
});

export const { clearCurrentDeed, clearError } = deedsSlice.actions;
export default deedsSlice.reducer;