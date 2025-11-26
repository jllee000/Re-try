import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import ChatRoom from "../pages/Chat/ChatRoom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,   
    children: [
        { path: "/", element: <Home /> },
        { path: "/login", element: <Login /> },
        { path: "/chat", element: <ChatRoom /> },
    ],
  },
]);

export default router;
