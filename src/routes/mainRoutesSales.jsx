import { lazy } from "react";

// project imports
import MainLayoutSales from "../layout/MainLayoutSales";
import Loadable from "../ui-component/Loadable";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Produk = Loadable(lazy(() => import("../views/manajemen/produk")));
const Pesanan = Loadable(lazy(() => import("../views/menu/pesanan")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutesSales = {
  path: "sales",
  element: <MainLayoutSales />,
  children: [
    {
      path: "",
      element: <DashboardDefault />,
    },
    {
      path: "dashboard",
      element: <DashboardDefault />,
    },
    {
      path: "menu",
      children: [
        {
          path: "pesanan",
          element: <Pesanan />,
        },
      ],
    },
    {
      path: "menu",
      children: [
        {
          path: "customer",
          element: <Produk />,
        },
      ],
    },
    {
      path: "menu",
      children: [
        {
          path: "transaksi",
          element: <Produk />,
        },
      ],
    },
  ],
};
export default MainRoutesSales;
