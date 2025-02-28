import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Todo from "./pages/Todo/Todo";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <div>home</div>,
  },

  {
    path: "/todo",
    element: <Todo />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
