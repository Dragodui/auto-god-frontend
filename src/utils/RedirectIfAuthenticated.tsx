import { Outlet, Navigate } from "react-router-dom";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

interface RedirectIfAuthenticatedProps {
  redirect: string;
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ redirect }) => {
  
  const user = useSelector((state: RootState) => state.user.user);
  const loading = useSelector((state: RootState) => state.user.loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Navigate to={redirect} /> : <Outlet />;
};

export default RedirectIfAuthenticated;
