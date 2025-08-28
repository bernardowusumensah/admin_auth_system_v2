import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ServiceHealthResponse, ServiceHealthDto } from '@core/types';
import { ServiceHealthService } from '@core/services';

// Async thunks
export const fetchServicesHealth = createAsyncThunk(
  'serviceHealth/fetchServicesHealth',
  async () => {
    // Use mock function for now - replace with real API when ready
    return await ServiceHealthService.getServicesHealth();
  }
);

export const fetchServiceHealth = createAsyncThunk(
  'serviceHealth/fetchServiceHealth',
  async (serviceName: string) => {
    return await ServiceHealthService.getServiceHealth(serviceName);
  }
);

// State interface
interface ServiceHealthState {
  services: ServiceHealthDto[];
  lastUpdated: string | null;
  loading: boolean;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
}

// Initial state
const initialState: ServiceHealthState = {
  services: [],
  lastUpdated: null,
  loading: false,
  error: null,
  autoRefresh: true,
  refreshInterval: 30 // 30 seconds
};

// Slice
const serviceHealthSlice = createSlice({
  name: 'serviceHealth',
  initialState,
  reducers: {
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateServiceStatus: (state, action: PayloadAction<ServiceHealthDto>) => {
      const updatedService = action.payload;
      const existingIndex = state.services.findIndex(
        service => service.service === updatedService.service
      );
      
      if (existingIndex !== -1) {
        state.services[existingIndex] = updatedService;
      } else {
        state.services.push(updatedService);
      }
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    // Fetch all services health
    builder
      .addCase(fetchServicesHealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesHealth.fulfilled, (state, action: PayloadAction<ServiceHealthResponse>) => {
        state.loading = false;
        state.services = action.payload.services;
        state.lastUpdated = action.payload.lastUpdated;
      })
      .addCase(fetchServicesHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services health';
      });

    // Fetch single service health
    builder
      .addCase(fetchServiceHealth.fulfilled, (state, action: PayloadAction<ServiceHealthDto>) => {
        const updatedService = action.payload;
        const existingIndex = state.services.findIndex(
          service => service.service === updatedService.service
        );
        
        if (existingIndex !== -1) {
          state.services[existingIndex] = updatedService;
        } else {
          state.services.push(updatedService);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchServiceHealth.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch service health';
      });
  }
});

export const { 
  setAutoRefresh, 
  setRefreshInterval, 
  clearError, 
  updateServiceStatus 
} = serviceHealthSlice.actions;

export default serviceHealthSlice.reducer;
