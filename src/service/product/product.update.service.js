import axios from "axios";

export const updateProduct = async (id, serviceData) => {
  const token = sessionStorage.getItem("token");
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_API}superadmin/product/${id}`,
      {
        category_id: serviceData.category_id,
        subcategory_id: serviceData.subcategory_id,
        product_name: serviceData.product_name,
        description: serviceData.description,
        location: serviceData.location,
        status: serviceData.status,
        price: serviceData.price,
        specification: serviceData.specification,
        location: serviceData.location,
        status: serviceData.status,
        special_price: serviceData.special_price,
        include_free_shipping: serviceData.free_shipping,
        include_vat: serviceData.vat,
        additional_fee_area_2: serviceData.additional_fee_area_2,
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
    console.error("Error updating product data:", error);
    throw error;
  }
};
