import axios from "axios";

export const postSubKategori = async (serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}superadmin/product/subcategory`,
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
    console.error("Error posting sub kategori data:", error);
    throw error;
  }
};
