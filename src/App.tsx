import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './providers/AuthProvider';
import PublicRoute from './routes/PublicRoute';
import Profile from './pages/Profile';
import Header from './components/Header';
import Topics from './pages/Topics';
import News from './pages/News';
import Topic from './pages/Topic';
import CreateNews from './pages/CreateNews';

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
            <Route path="/create-news" element={<CreateNews />} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/news" element={<News />} />
          <Route path="/topics/:topicName" element={<Topic />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
