import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/AuthGuard"; // Import AuthGuard

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
      path: "manajemen",
      children: [
        {
          path: "produk",
          element: (
            <AuthGuard>
              <Produk />,
            </AuthGuard>
          ),
        },
        {
          path: "kategori",
          element: (
            <AuthGuard>
              <Kategori />,
            </AuthGuard>
          ),
        },
        {
          path: "subKategori",
          element: (
            <AuthGuard>
              <SubKategori />,
            </AuthGuard>
          ),
        },
        {
          path: "sales",
          element: (
            <AuthGuard>
              <Sales />,
            </AuthGuard>
          ),
        },
        {
          path: "pelanggan",
          element: (
            <AuthGuard>
              <Pelanggan />,
            </AuthGuard>
          ),
        },
      ],
    },
    {
      path: "other",
      children: [
        {
          path: "transaksi",
          element: (
            <AuthGuard>
              <Transaksi />,
            </AuthGuard>
          ),
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
