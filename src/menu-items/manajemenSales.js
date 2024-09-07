// assets
import {
  IconHammer,
  IconUserEdit,
  IconUsersGroup,
  IconRouteAltRight,
} from "@tabler/icons-react";

// constant
const icons = { IconHammer, IconUserEdit, IconUsersGroup, IconRouteAltRight };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const manajemenSales = {
  id: "menu",
  title: "Menu",
  type: "group",
  children: [
    {
      id: "pesanan",
      title: "Pesanan",
      type: "item",
      url: "/sales/menu/pesanan", // Update URL
      icon: icons.IconUserEdit,
      breadcrumbs: false,
    },
    {
      id: "customer",
      title: "Customer",
      type: "item",
      url: "/sales/menu/customer", // Update URL
      icon: icons.IconHammer,
      breadcrumbs: false,
    },
    {
      id: "transaksi",
      title: "Transaksi",
      type: "item",
      url: "/sales/menu/transaksi", // Update URL
      icon: icons.IconUsersGroup,
      breadcrumbs: false,
    },
  ],
};

export default manajemenSales;
