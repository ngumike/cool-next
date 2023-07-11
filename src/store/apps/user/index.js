import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userApi } from 'src/services/api/user';

// ** Fetch Users
export const fetchUsers = createAsyncThunk('appUsers/fetchUsers', async (params, { rejectWithValue }) => {
  const { data, ok } = await userApi.getAll(params);

  return ok ? data : rejectWithValue(data);
});

// ** Add User
export const inviteUser = createAsyncThunk('appUsers/inviteUser', async (payload, { rejectWithValue }) => {
  const { data, ok } = await userApi.invite(payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Update User
export const updateUser = createAsyncThunk('appUsers/updateUser', async (payload, { rejectWithValue }) => {
  const { data, ok } = await userApi.update(payload.id, payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Delete User
export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, { rejectWithValue }) => {
  const { data, ok } = await userApi.delete(id);

  return ok ? id : rejectWithValue(data);
});

// ** Get Current User
export const getCurrentUser = createAsyncThunk('appUsers/getUser', async (id, { rejectWithValue }) => {
  const { data, ok } = await userApi.getById(id);

  return ok ? data.data : rejectWithValue(data);
});

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    currentUser: null,
    users: [],
    total: 1,
    params: {}
  },
  reducers: {
    handleSelectUser: (state, action) => {
      state.currentUser = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload.data?.items || [];
      state.total = action.payload.data?.meta.totalItems;
      state.params = action.payload.params;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
    });
    builder.addCase(inviteUser.fulfilled, (state, action) => {
      const newUser = action.payload;
      state.currentUser = newUser;
      state.users.push(newUser);
      state.total += 1;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      state.currentUser = updatedUser;
      state.users = state.users.map(user => (user.id === updatedUser.id ? updatedUser : user));
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.total -= 1;
    });
  }
});

export default appUsersSlice.reducer;
