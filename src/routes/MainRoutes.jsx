import { lazy } from "react";

// project imports
import MainLayout from "../layout/MainLayout";
import Loadable from "../ui-component/Loadable";
import AuthGuard from "../utils/AuthGuard"; // Import AuthGuard

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import("../views/dashboard")));
const Produk = Loadable(lazy(() => import("../views/manajemen/produk/produk")));
const TambahProduk = Loadable(
  lazy(() => import("../views/manajemen/produk/tambahProduk"))
);
const DetailProduk = Loadable(
  lazy(() => import("../views/manajemen/produk/detailProduk"))
);
const EditProduk = Loadable(
  lazy(() => import("../views/manajemen/produk/editProduk"))
);
const Kategori = Loadable(lazy(() => import("../views/manajemen/kategori")));
const SubKategori = Loadable(
  lazy(() => import("../views/manajemen/subKategori"))
);
const Sales = Loadable(lazy(() => import("../views/manajemen/salesman/sales")));
const DetailSales = Loadable(
  lazy(() => import("../views/manajemen/salesman/detailSales"))
);
const TambahSales = Loadable(
  lazy(() => import("../views/manajemen/salesman/tambahSales"))
);
const EditSales = Loadable(
  lazy(() => import("../views/manajemen/salesman/editSales"))
);
const Pelanggan = Loadable(lazy(() => import("../views/manajemen/pelanggan")));
const DetailPelanggan = Loadable(
  lazy(() => import("../views/manajemen/detailPelanggan"))
);
const Transaksi = Loadable(lazy(() => import("../views/other/transaksi")));
const DetailTransaksi = Loadable(
  lazy(() => import("../views/other/detailTransaksi"))
);
const Pesanan = Loadable(lazy(() => import("../views/other/pesanan")));
const DetailPesanan = Loadable(
  lazy(() => import("../views/other/detailPesanan"))
);
// const Laporan = Loadable(lazy(() => import("../views/other/laporan")));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "super-admin",
  element: <MainLayout />,
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
        // {
        //   path: "produk",
        //   element: (
        //     <AuthGuard>
        //       <Produk />
        //     </AuthGuard>
        //   ),
        // },
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
          path: "kategori",
          element: (
            <AuthGuard>
              <Kategori />
            </AuthGuard>
          ),
        },
        {
          path: "subKategori",
          element: (
            <AuthGuard>
              <SubKategori />
            </AuthGuard>
          ),
        },
        {
          path: "sales",
          element: (
            <AuthGuard>
              <Sales />
            </AuthGuard>
          ),
        },
        {
          path: "sales/detailsales/:id",
          element: (
            <AuthGuard>
              <DetailSales />
            </AuthGuard>
          ),
        },
        {
          path: "sales/tambahsales",
          element: (
            <AuthGuard>
              <TambahSales />
            </AuthGuard>
          ),
        },
        {
          path: "sales/editsales/:id",
          element: (
            <AuthGuard>
              <EditSales />
            </AuthGuard>
          ),
        },
        {
          path: "pelanggan",
          element: (
            <AuthGuard>
              <Pelanggan />
            </AuthGuard>
          ),
        },
        {
          path: "pelanggan/detailpelanggan/:id",
          element: (
            <AuthGuard>
              <DetailPelanggan />
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
              <Transaksi />
            </AuthGuard>
          ),
        },
        {
          path: "transaksi/detailTransaksi/:id",
          element: (
            <AuthGuard>
              <DetailTransaksi />
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
        // {
        //   path: "laporan",
        //   element: <Laporan />,
        // },
      ],
    },
  ],
};
export default MainRoutes;
