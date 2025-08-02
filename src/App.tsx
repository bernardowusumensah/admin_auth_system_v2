import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@app/store';
// Screens
import LoginScreen from '@core/auth/screens/Login';
import SignupScreen from '@core/auth/screens/Signup';
import DashboardScreen from '@modules/dashboard/screens/Dashboard';
// Layout
import AppLayout from '@app/AppLayout';

const router = createBrowserRouter([
	{
		path: '/',
		element: <AppLayout />,
		children: [
			{ path: 'login', element: <LoginScreen /> },
			{ path: 'signup', element: <SignupScreen /> },
			{ path: 'dashboard', element: <DashboardScreen /> },
		],
	},
]);

function App() {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />
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
		</Provider>
	);
}

export default App;
