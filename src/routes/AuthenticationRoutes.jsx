import { lazy } from "react";

// project imports
import Loadable from "../ui-component/Loadable";
import MinimalLayout from "../layout/MinimalLayout";
import GuestGuard from "../utils/GuestGuard"; // Import GuestGuard

// login option 3 routing
const AuthLogin3 = Loadable(
  lazy(() => import("../views/pages/authentication3/Login3"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/",
      element: (
        <GuestGuard>
          <AuthLogin3 />
        </GuestGuard>
      ),
    },
  ],
};

export default AuthenticationRoutes;
