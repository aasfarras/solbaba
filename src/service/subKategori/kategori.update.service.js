import axios from "axios";

export const updateKategori = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/product/subcategory/${id}`,
      {
        category_id: serviceData.category_id, // Pastikan mengirim category_id
        subcategory_name: serviceData.subcategory_name, // Mengirim subcategory_name
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
