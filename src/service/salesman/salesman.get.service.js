// kategori.service.js
import axios from "axios";

export const getSalesman = async () => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/salesman?per_page=${100}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Salesman data:", error);
    throw error;
  }
};
