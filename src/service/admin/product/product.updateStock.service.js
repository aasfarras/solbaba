// Product.service.js
import { Category } from "@mui/icons-material";
import axios from "axios";

export const postProduct = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}admin/product/${id}/update-stock`,
      {
        stock: serviceData.stock,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Product data:", error);
    throw error;
  }
};
