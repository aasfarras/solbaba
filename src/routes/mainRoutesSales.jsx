import { lazy } from "react";

// project imports
import MainLayoutSales from "../layout/MainLayoutSales";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/AuthGuard"; // Import AuthGuard

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Produk = Loadable(lazy(() => import("../views/manajemen/produk")));
const Pesanan = Loadable(lazy(() => import("../views/menu/pesanan")));
const Pelanggan = Loadable(lazy(() => import("../views/menu/pelanggan")));
const Transaksi = Loadable(lazy(() => import("../views/menu/transaksi")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutesSales = {
  path: "sales",
  element: <MainLayoutSales />,
  children: [
    {
      path: "",
      element: (
        <AuthGuard>
          <DashboardDefault />,
        </AuthGuard>
      ),
    },
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <DashboardDefault />,
        </AuthGuard>
      ),
    },
    {
      path: "menu",
      children: [
        {
          path: "pesanan",
          element: (
            <AuthGuard>
              <Pesanan />,
            </AuthGuard>
          ),
        },
      ],
    },
    {
      path: "menu",
      children: [
        {
          path: "customer",
          element: (
            <AuthGuard>
              <Pelanggan />,
            </AuthGuard>
          ),
        },
      ],
    },
    {
      path: "menu",
      children: [
        {
          path: "transaksi",
          element: (
            <AuthGuard>
              <Transaksi />,
            </AuthGuard>
          ),
        },
      ],
    },
  ],
};
export default MainRoutesSales;
