// Product.service.js
import { Category } from "@mui/icons-material";
import axios from "axios";

export const postProductVariants = async (serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}superadmin/product/variant`,
      {
        product_id: serviceData.product_id,
        variant_name: serviceData.variant_name,
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
