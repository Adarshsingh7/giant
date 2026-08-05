/** @format */
import { Routes, Route } from 'react-router-dom';
import PublicRoutes from './routes/PublicRoutes';

export default function App() {
  return (
    <Routes>
      {/* ✅ Public pages like /, /about, /login etc. */}
      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}
