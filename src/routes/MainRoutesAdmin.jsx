import { lazy } from "react";

// project imports
import MainLayoutAdmin from "../layout/MainLayoutAdmin"; // Anda perlu membuat layout untuk admin
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/AuthGuard"; // Import AuthGuard

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Pesanan = Loadable(lazy(() => import("../views/admin/pesanan")));
const ArsipAdmin = Loadable(lazy(() => import("../views/admin/arsipAdmin")));
const DetailPesanan = Loadable(
  lazy(() => import("../views/admin/detailPesanan"))
);
const Produk = Loadable(lazy(() => import("../views/admin/produk")));

// ==============================|| MAIN ROUTING FOR ADMIN ||============================== //

const MainRoutesAdmin = {
  path: "admin",
  element: <MainLayoutAdmin />,
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
      path: "manajemen",
      children: [
        {
          path: "produk",
          element: (
            <AuthGuard>
              <Produk />
            </AuthGuard>
          ),
        },
        {
          path: "arsip",
          element: (
            <AuthGuard>
              <ArsipAdmin />
            </AuthGuard>
          ),
        },
        {
          path: "arsip/detailarsip/:id",
          element: (
            <AuthGuard>
              <DetailArsipAdmin />
            </AuthGuard>
          ),
        },
        {
          path: "pesanan",
          element: (
            <AuthGuard>
              <Pesanan />
            </AuthGuard>
          ),
        },
        {
          path: "pesanan/detailpesanan/:id",
          element: (
            <AuthGuard>
              <DetailPesanan />
            </AuthGuard>
          ),
        },
      ],
    },
  ],
};

export default MainRoutesAdmin;
