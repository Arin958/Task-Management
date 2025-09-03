// components/PublicRoute.js
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>;

  return isAuthenticated && user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;