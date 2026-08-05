import { Routes, Route } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/landing/Home';
import Sale from '../pages/sales/Sales';
import Stocks from '../pages/stock/Stock';
import Login from '../pages/auth/Login';
import PrivateRoute from '../utils/PrivateRoute';

export default function PublicRoutes() {
	return (
		<Routes>
			{/* Login page (no layout) */}
			<Route path="/login" element={<Login />} />

			{/* Protected pages with layout */}
			<Route element={<PublicLayout />}>
				<Route
					path="/"
					element={
						<PrivateRoute>
							<Home />
						</PrivateRoute>
					}
				/>
				<Route
					path="/sales"
					element={
						<PrivateRoute>
							<Sale />
						</PrivateRoute>
					}
				/>
				<Route
					path="/stock"
					element={
						<PrivateRoute>
							<Stocks />
						</PrivateRoute>
					}
				/>
			</Route>
		</Routes>
	);
}
