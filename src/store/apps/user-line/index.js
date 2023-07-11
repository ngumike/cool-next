import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userLineApi } from 'src/services/api/user-line';

// ** Fetch UserLine Messages
export const fetchUserLineMessages = createAsyncThunk(
  'appUserLine/fetchUserLineMessages',
  async (params, { rejectWithValue }) => {
    const { data, ok } = await userLineApi.getAllMessages(params);

    return ok ? data : rejectWithValue(data);
  }
);

// ** Fetch UserLines
export const fetchUserLines = createAsyncThunk('appUserLine/fetchUserLines', async (params, { rejectWithValue }) => {
  const { data, ok } = await userLineApi.getAll(params);

  return ok ? data : rejectWithValue(data);
});

// ** Fetch  my UserLines
export const fetchMyUserLines = createAsyncThunk(
  'appUserLine/fetchMyUserLines',
  async (params, { rejectWithValue }) => {
    const { data, ok } = await userLineApi.getAll(params);

    return ok ? data : rejectWithValue(data);
  }
);

// ** Create UserLine
export const createUserLine = createAsyncThunk('appUserLine/createUserLine', async (payload, { rejectWithValue }) => {
  const { data, ok } = await userLineApi.create(payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Create Bulk UserLines
export const createBulkUserLines = createAsyncThunk(
  'appUserLine/createBulkUserLines',
  async (payload, { rejectWithValue }) => {
    const { data, ok } = await userLineApi.createBulk(payload);

    return ok ? data.data : rejectWithValue(data);
  }
);

// ** Update UserLine
export const updateUserLine = createAsyncThunk('appUserLine/updateUserLine', async (payload, { rejectWithValue }) => {
  const { data, ok } = await userLineApi.update(payload.id, payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Delete UserLine
export const deleteUserLine = createAsyncThunk('appUserLine/deleteUserLine', async (id, { rejectWithValue }) => {
  const { data, ok } = await userLineApi.delete(id);

  return ok ? id : rejectWithValue(data);
});

// ** Get Current UserLine
export const getCurrentUserLine = createAsyncThunk('appUserLine/getUserLine', async (id, { rejectWithValue }) => {
  const { data, ok } = await userLineApi.getById(id);

  return ok ? data.data : rejectWithValue(data);
});

export const appUserLinesSlice = createSlice({
  name: 'appUserLine',
  initialState: {
    currentUserLine: null,
    myUserLines: [],
    userLines: [],
    total: 1,
    lineMessages: [],
    totalMessages: 1,
    params: {}
  },
  reducers: {
    handleSelectUserLine: (state, action) => {
      state.currentUserLine = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchUserLines.fulfilled, (state, action) => {
      state.userLines = action.payload.data?.items || [];
      state.total = action.payload.data?.meta.totalItems;
      state.params = action.payload.params;
    });

    builder.addCase(fetchMyUserLines.fulfilled, (state, action) => {
      state.myUserLines = action.payload.data?.items || [];
      state.total = action.payload.data?.meta.totalItems;
      state.params = action.payload.params;
    });

    builder.addCase(getCurrentUserLine.fulfilled, (state, action) => {
      state.currentUserLine = action.payload;
    });

    builder.addCase(createUserLine.fulfilled, (state, action) => {
      const newUserLine = action.payload;
      state.currentUserLine = newUserLine;
      state.userLines.push(newUserLine);
      state.total += 1;
    });

    builder.addCase(createBulkUserLines.fulfilled, (state, action) => {
      const newUserLines = action.payload;
      newUserLines.forEach(userLine => state.userLines.push(userLine));
      state.total += newUserLines.length;
    });

    builder.addCase(updateUserLine.fulfilled, (state, action) => {
      const updatedUserLine = action.payload;
      state.currentUserLine = updatedUserLine;
      state.userLines = state.userLines.map(userLine =>
        userLine.id === updatedUserLine.id ? updatedUserLine : userLine
      );

      state.myUserLines = state.myUserLines.map(userLine =>
        userLine.id === updatedUserLine.id ? updatedUserLine : userLine
      );
    });

    builder.addCase(deleteUserLine.fulfilled, (state, action) => {
      state.userLines = state.userLines.filter(userLine => userLine.id !== action.payload);
      state.total -= 1;
    });

    builder.addCase(fetchUserLineMessages.fulfilled, (state, action) => {
      state.lineMessages = action.payload.data?.items || [];
      state.totalMessages = action.payload.data?.meta.totalItems;
      state.params = action.payload.params;
    });
  }
});

export default appUserLinesSlice.reducer;
