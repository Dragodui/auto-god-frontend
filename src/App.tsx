import { useEffect } from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import RedirectIfAuthenticated from "./utils/RedirectIfAuthenticated";
import { getMe } from "./api/auth";
import { UserData } from "./types";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "./store/slices/userSlice";

function App() {

  const dispatch = useDispatch(); 

  useEffect(() => {
    
    const getUser = async () => {
      try {
        dispatch(setLoading(true));
        const response = await getMe();
        if (response && response.data) {
          const data = response.data;
          const fetchedUser: UserData = {
            id: data._id,
            email: data.email,
            name: data.name,
            lastName: data.lastName,
            nickname: data.nickname,
            car: data.car,
            createdAt: data.createdAt,
            rank: data.rank,
          };
          dispatch(setUser(fetchedUser));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<RedirectIfAuthenticated redirect="" />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute redirect="login" />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
