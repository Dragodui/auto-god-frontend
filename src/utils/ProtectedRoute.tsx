import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ProtectedRouteProps {
  redirect: string;
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirect }) => {
  const loading = useSelector((state: RootState) => state.user.loading);
  const user = useSelector((state: RootState) => state.user.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to={`/${redirect}`} />;
};

export default ProtectedRoute;
