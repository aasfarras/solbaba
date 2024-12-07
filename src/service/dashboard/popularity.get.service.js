// kategori.service.js
import axios from "axios";

export const getPopularity = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/dashboard/popularity`,
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
