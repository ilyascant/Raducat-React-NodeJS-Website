import React, { useEffect } from "react";

import { Navigate, Outlet } from "react-router";
import { userActionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

const ProtectedCreate = ({ component, user }) => {
  const [_, dispatch] = useStateValue();
  useEffect(() => {
    dispatch({
      type: userActionType.SET_RETURN_URL,
      returnURL: user ? window.location.pathname : "/",
    });
  }, [user]);

  if (user) {
    return component ? component : <Outlet />;
  } else {
    return <Navigate replace to="/auth/signin" />;
  }
};

export default ProtectedCreate;
