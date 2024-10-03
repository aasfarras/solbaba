// Product.service.js
import { Category } from "@mui/icons-material";
import axios from "axios";

export const postProduct = async (serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_API}superadmin/product`,
      {
        category_id: serviceData.category_id,
        subcategory_id: serviceData.subcategory_id,
        product_name: serviceData.product_name,
        description: serviceData.description,
        location: serviceData.location,
        status: serviceData.status,
        price: serviceData.price,
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
