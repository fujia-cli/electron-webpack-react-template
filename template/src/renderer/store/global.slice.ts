import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@store/index';

export interface GlobalState {
  appName: string;
  user: null;
}

const initialState: GlobalState = {
  appName: '<%= packageName %>',
  user: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUserInfo: (state: GlobalState, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUserInfo } = globalSlice.actions;

export const selectAppName = (state: RootState) => state.global.appName;

export const selectUser = (state: RootState) => state.global.user;

export default globalSlice.reducer;
