import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@app/authSlice';
import accountsReducer from '@modules/accounts/store/accounts.slice';
import serviceHealthReducer from '@modules/service-health/store/service-health.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    serviceHealth: serviceHealthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
