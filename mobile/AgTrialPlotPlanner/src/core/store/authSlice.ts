import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthService } from '../auth/AuthService';
import { AuthState, User } from '../models/Types';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    const isAuthenticated = await AuthService.isAuthenticated();
    
    if (isAuthenticated) {
      const user = await AuthService.getCurrentUser();
      const token = await AuthService.getToken();
      return { user, token };
    }
    
    return { user: null, token: null };
  }
);

export const loginWithDemo = createAsyncThunk(
  'auth/loginWithDemo',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.loginWithDemo();
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to login with demo account');
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.loginWithGoogle();
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to login with Google');
    }
  }
);

export const loginWithMicrosoft = createAsyncThunk(
  'auth/loginWithMicrosoft',
  async (_, { rejectWithValue }) => {
    try {
      const result = await AuthService.loginWithMicrosoft();
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to login with Microsoft');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to logout');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = !!action.payload.token;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Failed to check authentication status';
      })
      
      // Login with demo
      .addCase(loginWithDemo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithDemo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithDemo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to login with demo account';
      })
      
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to login with Google';
      })
      
      // Login with Microsoft
      .addCase(loginWithMicrosoft.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithMicrosoft.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithMicrosoft.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to login with Microsoft';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to logout';
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;