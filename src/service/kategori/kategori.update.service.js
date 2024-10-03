import axios from "axios";

export const updateKategori = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/product/category/${id}`,
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
    console.error("Error updating kategori data:", error);
    throw error;
  }
};
