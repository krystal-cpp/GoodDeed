import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { User, GoodDeed } from "@/types";
import { friendsAPI } from "@/services/api";
interface FriendsState {
    friends: User[];
    friendDeeds: GoodDeed[];
    loading: boolean;
    error: string | null;
}

const initialState: FriendsState = {
    friends: [],
    friendDeeds: [],
    loading: false,
    error: null
}

export const fetchFriends = createAsyncThunk(
    'friends/fetchFriends', async () => {
        const response = await friendsAPI.fetchFriends();
        return response.data;
});

export const addFriend = createAsyncThunk(
    'friends/addFriend', async (username: string) => {
        const response = await friendsAPI.addFriend(username);
        return response.data;
});

export const removeFriend = createAsyncThunk(
    'friends/removeFriend', async (friendId: number) => {
        const response = await friendsAPI.removeFriend(friendId);
        return response.data;
});

export const fetchFriendDeeds = createAsyncThunk(
    'friends/fetchFriendDeeds', async (friendId: number) => {
        const response = await friendsAPI.fetchFriendDeeds(friendId);
        return response.data;
    }
);

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearFriendDeeds: (state) => {
            state.friendDeeds = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchFriends.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchFriends.fulfilled, (state, action) => {
            state.loading = false;
            state.friends = action.payload;
        });
        builder.addCase(fetchFriends.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch friends';
        });

        builder.addCase(addFriend.fulfilled, (state) => {

        });
        builder.addCase(addFriend.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to add friend';
        });

        builder.addCase(removeFriend.fulfilled, (state, action) => {
            state.friends = state.friends.filter((f) => f.id !== action.payload);
        });

        builder.addCase(fetchFriendDeeds.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchFriendDeeds.fulfilled, (state, action) => {
            state.loading = false;
            state.friendDeeds = action.payload;
        });
        builder.addCase(fetchFriendDeeds.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch friend deeds';
        });
    }
});

export const { clearError, clearFriendDeeds } = friendsSlice.actions;
export default friendsSlice.reducer;