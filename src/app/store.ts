import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@app/authSlice';
import accountsReducer from '@modules/accounts/store/accounts.slice';
import serviceHealthReducer from '@modules/service-health/store/service-health.slice';
import supportTicketsReducer from '@modules/support/store/support-tickets.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    serviceHealth: serviceHealthReducer,
    supportTickets: supportTicketsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
