import { createBrowserRouter } from "react-router-dom";
import ConsumerLayout from "../ConsumerLayout.jsx";

import PostsList from "../pages/PostsList.jsx";
import PostDetail from "../pages/PostDetail.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/",
    element: <ConsumerLayout />,
    children: [
        { path: "/", element: <PostsList /> },
        { path: "posts/:id", element: <PostDetail /> }
      ]
    }
  ]
);
