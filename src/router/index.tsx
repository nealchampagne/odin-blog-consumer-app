import { createBrowserRouter } from "react-router-dom";
import ConsumerLayout from "../ConsumerLayout";

import PostsList from "../pages/PostsList";
import PostDetail from "../pages/PostDetail";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

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
