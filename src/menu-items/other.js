// assets
import { IconReceipt, IconShoppingCart } from "@tabler/icons-react";

// constant
const icons = { IconReceipt, IconShoppingCart };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const other = {
  id: "other",
  title: "Lainnya",
  type: "group",
  children: [
    {
      id: "transaksi",
      title: "Transaksi",
      type: "item",
      url: "/super-admin/other/transaksi",
      icon: icons.IconReceipt,
      breadcrumbs: false,
    },
    {
      id: "pesanan",
      title: "Pesanan",
      type: "item",
      url: "/super-admin/other/pesanan", // Update URL
      icon: icons.IconShoppingCart,
    },
    // {
    //   id: "laporan",
    //   title: "Laporan",
    //   type: "item",
    //   url: "/super-admin/other/laporan",
    //   icon: icons.IconFileAnalytics,
    //   breadcrumbs: false,
    // },
  ],
};

export default other;
