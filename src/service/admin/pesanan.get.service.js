// kategori.service.js
import axios from "axios";

export const getPesanan = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}admin/order?per_page=${100}`,
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
