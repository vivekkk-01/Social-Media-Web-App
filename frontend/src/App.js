import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login, {
  action as loginAction,
  loader as loginLoader,
} from "./pages/login/Login";
import Register, {
  action as registerAction,
  loader as registerLoader,
} from "./pages/register/Register";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Root, { loader as rootLoader } from "./pages/root/Root";

import { loader as feedLoader } from "./components/feed/Feed";
import Messenger from "./pages/messenger/Messenger";

const userObj = localStorage.getItem("socialUser");
const user = JSON.parse(userObj);
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
    id: "user",
    children: [
      {
        index: true,
        element: <Home />,
        loader: feedLoader,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
        loader: feedLoader,
      },
      {
        path: "/messenger",
        element: <Messenger />,
      },
    ],
  },
  {
    path: "/register",
    element: !user && <Register />,
    action: registerAction,
    loader: registerLoader,
  },
  {
    path: "/login",
    element: !user && <Login />,
    action: loginAction,
    loader: loginLoader,
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
