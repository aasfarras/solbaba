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
      id: "transaksi",
      title: "Transaksi",
      type: "item",
      url: "/admin/manajemen/transaksi", // Update URL
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
