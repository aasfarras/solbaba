// assets
import { IconHammer, IconUserEdit, IconUsersGroup } from "@tabler/icons-react";

// constant
const icons = { IconHammer, IconUserEdit, IconUsersGroup };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const manajemen = {
  id: "manajemen",
  title: "Manajemen",
  type: "group",
  children: [
    {
      id: "produk",
      title: "Produk",
      type: "item",
      url: "/manajemen/Produk",
      icon: icons.IconHammer,
      breadcrumbs: false,
    },
    {
      id: "sales",
      title: "Sales",
      type: "item",
      url: "/manajemen/Sales",
      icon: icons.IconUserEdit,
      breadcrumbs: false,
    },
    {
      id: "pelanggan",
      title: "Pelanggan",
      type: "item",
      url: "/manajemen/Pelanggan",
      icon: icons.IconUsersGroup,
      breadcrumbs: false,
    },
  ],
};

export default manajemen;
