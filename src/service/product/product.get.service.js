import axios from "axios";

export const getProduct = async () => {
  try {
    const token = sessionStorage.getItem("token"); // Ambil token dari localStorage
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API}superadmin/product`,
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
