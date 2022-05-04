import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import globalReducer from './global.slice';
import counterReducer from '@pages/counter/counter.slice';

export const store = configureStore({
  reducer: {
    global: globalReducer,
    counter: counterReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = unknown> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
