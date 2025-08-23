import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  AccountDto, 
  AccountsResponse, 
  AccountDetailsResponse,
  AccountSearchParams,
  CreateSubscriptionRequest,
  CancelSubscriptionRequest
} from '@core/types';
import { AccountsService } from '@core/services';

// Async thunks
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (params: AccountSearchParams) => {
    return await AccountsService.getAccounts(params);
  }
);

export const fetchAccountDetails = createAsyncThunk(
  'accounts/fetchAccountDetails',
  async (accountId: string) => {
    return await AccountsService.getAccountDetails(accountId);
  }
);

export const banAccount = createAsyncThunk(
  'accounts/banAccount',
  async (accountId: string) => {
    await AccountsService.banAccount(accountId);
    return accountId;
  }
);

export const unbanAccount = createAsyncThunk(
  'accounts/unbanAccount',
  async (accountId: string) => {
    await AccountsService.unbanAccount(accountId);
    return accountId;
  }
);

export const disconnectPlayer = createAsyncThunk(
  'accounts/disconnectPlayer',
  async (accountId: string) => {
    await AccountsService.disconnectPlayer(accountId);
    return accountId;
  }
);

export const createSubscription = createAsyncThunk(
  'accounts/createSubscription',
  async (request: CreateSubscriptionRequest) => {
    await AccountsService.createSubscription(request);
    return request;
  }
);

export const cancelSubscription = createAsyncThunk(
  'accounts/cancelSubscription',
  async (request: CancelSubscriptionRequest) => {
    await AccountsService.cancelSubscription(request);
    return request;
  }
);

// State interface
interface AccountsState {
  accounts: AccountDto[];
  selectedAccount: AccountDetailsResponse | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchParams: AccountSearchParams;
}

// Initial state
const initialState: AccountsState = {
  accounts: [],
  selectedAccount: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
  searchParams: {
    page: 1,
    pageSize: 10,
    sortBy: 'createdOn',
    sortOrder: 'desc'
  }
};

// Slice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<AccountSearchParams>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    clearSelectedAccount: (state) => {
      state.selectedAccount = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<AccountsResponse>) => {
        state.loading = false;
        state.accounts = action.payload.accounts;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      });

    // Fetch account details
    builder
      .addCase(fetchAccountDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action: PayloadAction<AccountDetailsResponse>) => {
        state.loading = false;
        state.selectedAccount = action.payload;
      })
      .addCase(fetchAccountDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch account details';
      });

    // Ban account
    builder
      .addCase(banAccount.fulfilled, (state, action: PayloadAction<string>) => {
        const accountId = action.payload;
        const account = state.accounts.find(acc => acc.id === accountId);
        if (account) {
          account.lockedOut = new Date().toISOString();
        }
      })
      .addCase(banAccount.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to ban account';
      });

    // Unban account
    builder
      .addCase(unbanAccount.fulfilled, (state, action: PayloadAction<string>) => {
        const accountId = action.payload;
        const account = state.accounts.find(acc => acc.id === accountId);
        if (account) {
          account.lockedOut = undefined;
        }
      })
      .addCase(unbanAccount.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to unban account';
      });

    // Other actions
    builder
      .addCase(disconnectPlayer.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to disconnect player';
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create subscription';
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to cancel subscription';
      });
  }
});

export const { setSearchParams, clearSelectedAccount, clearError } = accountsSlice.actions;
export default accountsSlice.reducer;
