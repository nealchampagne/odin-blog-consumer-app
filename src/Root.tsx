import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index.jsx";
import { useAuth } from "./store/auth.js";

const Root = () => {
  const restore = useAuth(s => s.restore);

  React.useEffect(() => {
    restore();
  }, [restore]);

  return <RouterProvider router={router} />;
}

export default Root;