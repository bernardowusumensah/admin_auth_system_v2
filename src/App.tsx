import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { store } from '@app/store';
import { theme } from '@app/theme';
import { initializeAuth } from '@app/authSlice';
import type { AppDispatch } from '@app/store';
// Screens
import LoginScreen from '@core/auth/screens/Login';
import SignupScreen from '@core/auth/screens/Signup';
import DashboardScreen from '@modules/dashboard/screens/Dashboard';
import AccountsScreen from '@modules/accounts/screens/Accounts';
import ServiceHealthScreen from '@modules/service-health/screens/ServiceHealth';
import SupportTicketsScreen from '@modules/support/screens/SupportTickets/support-tickets.screen';
// Layout
import AppLayout from '@app/AppLayout';

// Auth initializer component
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
}

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ index: true, element: <Navigate to="/login" replace /> },
			{ path: 'login', element: <LoginScreen /> },
			{ path: 'signup', element: <SignupScreen /> },
			{ path: 'dashboard', element: <DashboardScreen /> },
			{ path: 'accounts', element: <AccountsScreen /> },
			{ path: 'service-health', element: <ServiceHealthScreen /> },
			{ path: 'support-tickets', element: <SupportTicketsScreen /> },
		],
	},
]);

function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<AuthInitializer>
					<RouterProvider router={router} />
				</AuthInitializer>
				<Toaster
					position="top-right"
					toastOptions={{
						duration: 4000,
						style: {
							background: '#363636',
							color: '#fff',
						},
						success: {
							duration: 3000,
							iconTheme: {
								primary: '#4caf50',
								secondary: '#fff',
							},
						},
						error: {
							duration: 4000,
							iconTheme: {
								primary: '#f44336',
								secondary: '#fff',
							},
						},
					}}
				/>
			</ThemeProvider>
		</Provider>
	);
}

export default App;
