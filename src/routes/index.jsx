import { createBrowserRouter } from "react-router-dom";

// routes
import MainRoutes from "./MainRoutes";
import MainRoutesAdmin from "./MainRoutesAdmin";
import MainRoutesSales from "./mainRoutesSales";
import LoginRoutes from "./AuthenticationRoutes";

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter(
  [MainRoutes, MainRoutesAdmin, MainRoutesSales, LoginRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME,
  }
);

// export default function ThemeRoutes() {
//   return useRoutes([{ path: '/', element: <PagesLanding /> }, AuthenticationRoutes, LoginRoutes, MainRoutes]);
//   // return useRoutes([LoginRoutes, AuthenticationRoutes, MainRoutes]);
// }

export default router;
