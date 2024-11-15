// assets
import {
  IconHammer,
  IconUserEdit,
  IconReceipt,
  IconShoppingCart,
} from "@tabler/icons-react";

// constant
const icons = { IconHammer, IconUserEdit, IconShoppingCart, IconReceipt };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const manajemenAdmin = {
  id: "manajemen",
  title: "Manajemen",
  type: "group",
  children: [
    {
      id: "produk",
      title: "Produk",
      type: "item",
      url: "/admin/manajemen/produk", // Update URL
      icon: icons.IconHammer,
    },
    {
      id: "Arsip",
      title: "Arsip",
      type: "item",
      url: "/admin/manajemen/arsip", // Update URL
      icon: icons.IconReceipt,
    },
    {
      id: "pesanan",
      title: "Pesanan",
      type: "item",
      url: "/admin/manajemen/pesanan", // Update URL
      icon: icons.IconShoppingCart,
    },
  ],
};

export default manajemenAdmin;
