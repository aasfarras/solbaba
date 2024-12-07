// kategori.service.js
import axios from "axios";

export const getTransaksi = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/transaction`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching Transaksi data:", error);
    throw error;
  }
};
