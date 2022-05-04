import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import globalReducer from './global.slice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = unknown> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
