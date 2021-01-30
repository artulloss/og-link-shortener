import React, { ElementType, ReactComponentElement, ReactNode } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

/**
 * Higher order component that takes a component and redirects to the fallbackRoute if not authenticated
 * @param Component Takes a react component
 * @param fallbackRoute Redirect to if not logged in
 */
const PrivateRoute = (Component, fallbackRoute = "/login?redirected=true") => {
  const hocComponent = ({ ...props }) => <Component {...props} />;
  return (props) => {
    const { currentUser } = useAuth();
    const router = useRouter();
    if (!currentUser) {
      router.replace(fallbackRoute);
      return <p>Redirecting...</p>;
    }
    return hocComponent(props);
  };
};

export default PrivateRoute;
