// kategori.service.js
import axios from "axios";

export const getTransaksiAdmin = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}admin/transaction`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Transaksi data:", error);
    throw error;
  }
};
