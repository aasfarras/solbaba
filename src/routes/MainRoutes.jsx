import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import { element } from "prop-types";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Produk = Loadable(lazy(() => import("../views/manajemen/produk")));
const Sales = Loadable(lazy(() => import("../views/manajemen/sales")));
const Pelanggan = Loadable(lazy(() => import("../views/manajemen/pelanggan")));
const Transaksi = Loadable(lazy(() => import("../views/other/transaksi")));
const Laporan = Loadable(lazy(() => import("../views/other/laporan")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <DashboardDefault />,
        },
      ],
    },
    {
      path: "manajemen",
      children: [
        {
          path: "produk",
          element: <Produk />,
        },
      ],
    },
    {
      path: "manajemen",
      children: [
        {
          path: "sales",
          element: <Sales />,
        },
      ],
    },
    {
      path: "manajemen",
      children: [
        {
          path: "pelanggan",
          element: <Pelanggan />,
        },
      ],
    },
    {
      path: "other",
      children: [
        {
          path: "transaksi",
          element: <Transaksi />,
        },
      ],
    },
    {
      path: "other",
      children: [
        {
          path: "laporan",
          element: <Laporan />,
        },
      ],
    },
  ],
};

export default MainRoutes;
