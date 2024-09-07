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

const manajemen = {
  id: "manajemen",
  title: "Manajemen",
  type: "group",
  children: [
    {
      id: "kategoriProduk",
      title: "Kategori Produk",
      type: "collapse",
      icon: icons.IconRouteAltRight,
      children: [
        {
          id: "kategori",
          title: "Kategori",
          type: "item",
          url: "/super-admin/manajemen/kategori", // Update URL
        },
        {
          id: "subKategori",
          title: "Sub Kategori",
          type: "item",
          url: "/super-admin/manajemen/subKategori", // Update URL
        },
      ],
    },
    {
      id: "sales",
      title: "Sales",
      type: "item",
      url: "/super-admin/manajemen/sales", // Update URL
      icon: icons.IconUserEdit,
      breadcrumbs: false,
    },
    {
      id: "produk",
      title: "Produk",
      type: "item",
      url: "/super-admin/manajemen/produk", // Update URL
      icon: icons.IconHammer,
      breadcrumbs: false,
    },
    {
      id: "pelanggan",
      title: "Pelanggan",
      type: "item",
      url: "/super-admin/manajemen/pelanggan", // Update URL
      icon: icons.IconUsersGroup,
      breadcrumbs: false,
    },
  ],
};

export default manajemen;
