import axios from "axios";

export const getProduct = async (perPage, page) => {
  try {
    const token = sessionStorage.getItem("token"); // Ambil token dari localStorage
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/product?per_page=${100}&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Jika membutuhkan otorisasi
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error; // Lanjutkan error jika diperlukan untuk penanganan di komponen
  }
};
