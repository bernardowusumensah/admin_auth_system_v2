import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@app/authSlice';
import accountsReducer from '@modules/accounts/store/accounts.slice';
import serviceHealthReducer from '@modules/service-health/store/service-health.slice';
import { adminAccountsApi } from '@modules/admin/services/admin-accounts.service';
import { supportTicketsApi } from '@modules/support/services/support-tickets.service';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountsReducer,
    serviceHealth: serviceHealthReducer,
    [supportTicketsApi.reducerPath]: supportTicketsApi.reducer,
    [adminAccountsApi.reducerPath]: adminAccountsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(supportTicketsApi.middleware)
      .concat(adminAccountsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
