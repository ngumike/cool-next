import { createSlice } from '@reduxjs/toolkit';

export const appMainSlice = createSlice({
  name: 'appMain',
  initialState: {
    loading: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const { setLoading } = appMainSlice.actions;

export default appMainSlice.reducer;
