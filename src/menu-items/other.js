// assets
import { IconCash, IconFileAnalytics } from "@tabler/icons-react";

// constant
const icons = { IconCash, IconFileAnalytics };

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
      icon: icons.IconCash,
      breadcrumbs: false,
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
