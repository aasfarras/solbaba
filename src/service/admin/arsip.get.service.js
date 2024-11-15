// kategori.service.js
import axios from "axios";

export const getArsipAdmin = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}admin/order/finished`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Arsip data:", error);
    throw error;
  }
};
