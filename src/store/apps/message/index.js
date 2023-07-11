import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { messageApi } from 'src/services/api/message';

// ** Fetch Messages
export const fetchMessages = createAsyncThunk(
  'appMessage/fetchMessages',
  async (params, { rejectWithValue, dispatch }) => {
    dispatch(clearMessages());
    const { data, ok } = await messageApi.getAll(params);

    return ok ? data : rejectWithValue(data);
  }
);

// ** Create Message
export const createMessage = createAsyncThunk('appMessage/createMessage', async (payload, { rejectWithValue }) => {
  const { data, ok } = await messageApi.create(payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Update Message
export const updateMessage = createAsyncThunk('appMessage/updateMessage', async (payload, { rejectWithValue }) => {
  const { data, ok } = await messageApi.update(payload.id, payload, payload.level);

  return ok ? data.data : rejectWithValue(data);
});

// ** Delete Message
export const deleteMessage = createAsyncThunk('appMessage/deleteMessage', async (id, { rejectWithValue }) => {
  const { data, ok } = await messageApi.delete(id);

  return ok ? id : rejectWithValue(data);
});

// ** Get Current Message
export const getCurrentMessage = createAsyncThunk('appMessage/getMessage', async (id, { rejectWithValue }) => {
  const { data, ok } = await messageApi.getById(id);

  return ok ? data.data : rejectWithValue(data);
});

export const appMessagesSlice = createSlice({
  name: 'appMessage',
  initialState: {
    currentMessage: null,
    messages: [],
    total: 1,
    params: {}
  },
  reducers: {
    clearMessages(state, action) {
      state.messages = [];
      state.total = 1;
      state.params = {};
    },
    selectMessage: (state, action) => {
      state.currentMessage = action.payload;
    },
    pushMessage: (state, action) => {
      const message = action.payload;
      const idx = state.messages.findIndex(m => m.id === message.id);
      if (idx === -1) {
        state.messages = [action.payload, ...state.messages];
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload.data?.items || [];
      state.total = action.payload.data?.meta.totalItems;
      state.params = action.payload.params;
    });
    builder.addCase(getCurrentMessage.fulfilled, (state, action) => {
      state.currentMessage = action.payload;
    });
    builder.addCase(createMessage.fulfilled, (state, action) => {
      const newMessage = action.payload;
      state.currentMessage = newMessage;
      state.messages.push(newMessage);
    });
    builder.addCase(updateMessage.fulfilled, (state, action) => {
      const updatedMessage = action.payload;
      state.currentMessage = updatedMessage;
      state.messages = state.messages.map(message => (message.id === updatedMessage.id ? updatedMessage : message));
    });
    builder.addCase(deleteMessage.fulfilled, (state, action) => {
      state.messages = state.messages.filter(message => message.id !== action.payload);
      state.total -= 1;
    });
  }
});

export const { clearMessages, pushMessage } = appMessagesSlice.actions;

export default appMessagesSlice.reducer;
