import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
        <Route path="/"  element={<ProtectedRoute><Home /></ProtectedRoute>}>
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
