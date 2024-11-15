// assets
import { IconCash, IconFileAnalytics, IconReceipt } from "@tabler/icons-react";

// constant
const icons = { IconCash, IconFileAnalytics, IconReceipt };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const other = {
  id: "other",
  title: "Lainnya",
  type: "group",
  children: [
    {
      id: "arsip",
      title: "Arsip",
      type: "item",
      url: "/super-admin/other/arsip",
      icon: icons.IconReceipt,
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
