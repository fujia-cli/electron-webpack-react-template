import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@store/index';

export interface GlobalState {
  appName: string;
}

const initialState: GlobalState = {
  appName: 'Marathon',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
});

export const selectAppName = (state: RootState) => state.global.appName;

export default globalSlice.reducer;
