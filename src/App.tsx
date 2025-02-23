import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './providers/AuthProvider';
import PublicRoute from './routes/PublicRoute';
import Profile from './pages/Profile';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* public routes (only if not authenticated) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          {/* private routes (only if authenticated) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/me" element={<Profile />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
