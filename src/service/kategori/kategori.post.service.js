import axios from "axios";

export const postKategori = async (serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}superadmin/product/category`,
      {
        category_name: serviceData.category_name,
      },
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
