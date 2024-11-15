import { lazy } from "react";

// project imports
import MainLayoutSales from "../layout/MainLayoutSales";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/AuthGuard"; // Import AuthGuard

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Produk = Loadable(lazy(() => import("../views/manajemen/produk/produk")));
const Pesanan = Loadable(lazy(() => import("../views/menu/pesanan")));
const DetailPesanan = Loadable(
  lazy(() => import("../views/menu/detailpesanan"))
); // Pastikan path ini benar
const Pelanggan = Loadable(lazy(() => import("../views/menu/pelanggan")));
const Arsip = Loadable(lazy(() => import("../views/menu/arsip")));
const DetailArsip = Loadable(lazy(() => import("../views/menu/detailArsip")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutesSales = {
  path: "sales",
  element: <MainLayoutSales />,
  children: [
    {
      path: "",
      element: (
        <AuthGuard>
          <DashboardDefault />
        </AuthGuard>
      ),
    },
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <DashboardDefault />
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
              <Pesanan />
            </AuthGuard>
          ),
        },
        {
          path: "pesanan/detailpesanan/:id", // Rute untuk detail pesanan
          element: (
            <AuthGuard>
              <DetailPesanan />
            </AuthGuard>
          ),
        },
        {
          path: "customer",
          element: (
            <AuthGuard>
              <Pelanggan />
            </AuthGuard>
          ),
        },
        {
          path: "arsip",
          element: (
            <AuthGuard>
              <Arsip />
            </AuthGuard>
          ),
        },
        {
          path: "arsip/detailarsip/:id",
          element: (
            <AuthGuard>
              <DetailArsip />
            </AuthGuard>
          ),
        },
      ],
    },
  ],
};

export default MainRoutesSales;
