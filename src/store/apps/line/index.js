import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { lineApi } from 'src/services/api/line';

// ** Fetch Lines
export const fetchLines = createAsyncThunk('appLine/fetchLines', async (params, { rejectWithValue }) => {
  const { data, ok } = await lineApi.getAll(params);

  return ok ? data : rejectWithValue(data);
});

// ** Create Line
export const createLine = createAsyncThunk('appLine/createLine', async (payload, { rejectWithValue }) => {
  const { data, ok } = await lineApi.create(payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Import Line
export const importLine = createAsyncThunk('appLine/importLine', async (payload, { rejectWithValue }) => {
  const { data, ok } = await lineApi.import(payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Update Line
export const updateLine = createAsyncThunk('appLine/updateLine', async (payload, { rejectWithValue }) => {
  const { data, ok } = await lineApi.update(payload.id, payload);

  return ok ? data.data : rejectWithValue(data);
});

// ** Delete Line
export const deleteLine = createAsyncThunk('appLine/deleteLine', async (id, { rejectWithValue }) => {
  const { data, ok } = await lineApi.delete(id);

  return ok ? id : rejectWithValue(data);
});

// ** Get Current Line
export const getCurrentLine = createAsyncThunk('appLine/getLine', async (id, { rejectWithValue }) => {
  const { data, ok } = await lineApi.getById(id);

  return ok ? data.data : rejectWithValue(data);
});

export const appLinesSlice = createSlice({
  name: 'appLine',
  initialState: {
    currentLine: null,
    lines: [],
    total: 1,
    params: {}
  },
  reducers: {
    handleSelectLine: (state, action) => {
      state.currentLine = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchLines.fulfilled, (state, action) => {
      state.lines = action.payload.data?.items || [];
      state.total = action.payload.data?.meta.totalItems;
      state.params = action.payload.params;
    });
    builder.addCase(getCurrentLine.fulfilled, (state, action) => {
      state.currentLine = action.payload;
    });
    builder.addCase(createLine.fulfilled, (state, action) => {
      const newLine = action.payload;
      state.currentLine = newLine;
      state.lines.push(newLine);
      state.total += 1;
    });
    builder.addCase(importLine.fulfilled, (state, action) => {
      const newLines = action.payload;
      newLines.forEach(line => state.lines.push(line));
      state.total += newLines.length;
    });
    builder.addCase(updateLine.fulfilled, (state, action) => {
      const updatedLine = action.payload;
      state.currentLine = updatedLine;
      state.lines = state.lines.map(line => (line.id === updatedLine.id ? updatedLine : line));
    });
    builder.addCase(deleteLine.fulfilled, (state, action) => {
      state.lines = state.lines.filter(line => line.id !== action.payload);
      state.total -= 1;
    });
  }
});

export default appLinesSlice.reducer;
