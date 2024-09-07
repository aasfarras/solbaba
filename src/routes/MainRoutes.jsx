import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Produk = Loadable(lazy(() => import("../views/manajemen/produk")));
const Kategori = Loadable(lazy(() => import("../views/manajemen/kategori")));
const SubKategori = Loadable(
  lazy(() => import("../views/manajemen/subKategori"))
);
const Sales = Loadable(lazy(() => import("../views/manajemen/sales")));
const Pelanggan = Loadable(lazy(() => import("../views/manajemen/pelanggan")));
const Transaksi = Loadable(lazy(() => import("../views/other/transaksi")));
const Laporan = Loadable(lazy(() => import("../views/other/laporan")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "super-admin",
  element: <MainLayout />,
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
      path: "manajemen",
      children: [
        {
          path: "produk",
          element: <Produk />,
        },
        {
          path: "kategori",
          element: <Kategori />,
        },
        {
          path: "subKategori",
          element: <SubKategori />,
        },
        {
          path: "sales",
          element: <Sales />,
        },
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
        // {
        //   path: "laporan",
        //   element: <Laporan />,
        // },
      ],
    },
  ],
};
export default MainRoutes;
