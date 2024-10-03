// kategori.service.js
import axios from "axios";

export const getSubKategori = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/product/subcategory`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching kategori data:", error);
    throw error;
  }
};
