import { lazy } from "react";

// project imports
import MainLayoutAdmin from "../layout/MainLayoutAdmin"; // Anda perlu membuat layout untuk admin
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/AuthGuard"; // Import AuthGuard

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("../views/dashboard-admin"))
);
const Pesanan = Loadable(lazy(() => import("../views/admin/pesanan")));
const TransaksiAdmin = Loadable(
  lazy(() => import("../views/admin/transaksiAdmin"))
);
const DetailTransaksiAdmin = Loadable(
  lazy(() => import("../views/admin/detailTransaksi"))
);
const DetailPesanan = Loadable(
  lazy(() => import("../views/admin/detailPesanan"))
);
const Produk = Loadable(lazy(() => import("../views/admin/produk")));
const TambahProduk = Loadable(
  lazy(() => import("../views/admin/tambahProduk"))
);
const EditProduk = Loadable(lazy(() => import("../views/admin/editProduk")));
const DetailProduk = Loadable(
  lazy(() => import("../views/admin/detailProduk"))
);

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
          path: "produk/tambahproduk",
          element: (
            <AuthGuard>
              <TambahProduk />
            </AuthGuard>
          ),
        },
        {
          path: "produk/detailproduk/:id",
          element: (
            <AuthGuard>
              <DetailProduk />
            </AuthGuard>
          ),
        },
        {
          path: "produk/editProduk/:id",
          element: (
            <AuthGuard>
              <EditProduk />
            </AuthGuard>
          ),
        },
        {
          path: "transaksi",
          element: (
            <AuthGuard>
              <TransaksiAdmin />
            </AuthGuard>
          ),
        },
        {
          path: "transaksi/detailTransaksi/:id",
          element: (
            <AuthGuard>
              <DetailTransaksiAdmin />
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
