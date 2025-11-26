import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,   
    children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
    ],
  },
]);

export default router;