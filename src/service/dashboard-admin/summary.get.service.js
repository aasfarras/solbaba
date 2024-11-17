// kategori.service.js
import axios from "axios";

export const getSummary = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}admin/dashboard/summary`,
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
