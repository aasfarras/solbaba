import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../../service/product/product.getSpesifik.service"; // Import the new service
import { getKategori } from "../../../service/kategori/kategori.get.service";
import { getSubKategori } from "../../../service/subKategori/subKategori.get.service";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import MainCard from "../../../ui-component/cards/MainCard";
import { Image } from "antd";

const DetailProduk = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getKategori();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    setLoading(true);
    try {
      const response = await getSubKategori();
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id); // Use the service to fetch product details
      setProduct(data);
    } catch (error) {
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const statusMapping = {
    available: "Tersedia",
    out_of_stock: "Tidak Tersedia",
    pre_order: "Preorder/Inden",
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component mounts
    fetchProductDetails(); // Fetch product details
    fetchSubCategories();
  }, [id]);

  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

  if (!product) return <p>{loading}</p>;

  // Find the category name based on the product's category ID
  const categoryName =
    categories.find((category) => category.id === product.data.category_id)
      ?.category_name || "Unknown Category";

  const subCategoryName =
    subCategories.find(
      (subcategory) => subcategory.id === product.data.subcategory_id
    )?.subcategory_name || "Unknown Sub Category";

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {loading ? ( // Conditional rendering for loading
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="70vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <MainCard title="Detail Product">
          <Box>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Nama Produk</TableCell>
                    <TableCell>{product.data.product_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kategori</TableCell>
                    <TableCell>{categoryName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sub Kategori</TableCell>
                    <TableCell>{subCategoryName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Harga</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.data.price)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Harga Tambahan Lokasi 2</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(product.data.additional_fee_area_2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Stok</TableCell>
                    <TableCell>{product.data.stock}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cabang</TableCell>
                    <TableCell>{product.data.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      {" "}
                      {statusMapping[product.data.status] ||
                        "Status Tidak Diketahui"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gratis Ongkir</TableCell>
                    <TableCell>
                      {product.data.include_free_shipping === 1
                        ? "Ya"
                        : "Tidak"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.data.description,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Spesifikasi</TableCell>
                    <TableCell>
                      {Array.isArray(product.data.specification) &&
                      product.data.specification.length > 0 ? (
                        <Table style={{ border: "0.5px solid black" }}>
                          <TableHead style={{ border: "0.5px solid black" }}>
                            <TableRow style={{ border: "0.5px solid black" }}>
                              {Object.keys(product.data.specification[0]).map(
                                (key) => (
                                  <TableCell
                                    style={{ border: "0.5px solid black" }}
                                    key={key}
                                  >
                                    {key}
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody style={{ border: "0.5px solid black" }}>
                            {product.data.specification.map((spec, index) => (
                              <TableRow
                                style={{ border: "0.5px solid black" }}
                                key={index}
                              >
                                {Object.values(spec).map((value, idx) => (
                                  <TableCell
                                    style={{ border: "0.5px solid black" }}
                                    key={idx}
                                  >
                                    {value !== null ? value : "-"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography variant="body2">
                          Tidak ada spesifikasi tersedia
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Variants</TableCell>
                    <TableCell>
                      {Array.isArray(product.data.product_variants) &&
                      product.data.product_variants.length > 0 ? (
                        <Table
                          style={{
                            border: "0.5px solid black",
                            width: "20%",
                          }}
                        >
                          <TableHead style={{ border: "0.5px solid black" }}>
                            <TableRow style={{ border: "0.5px solid black" }}>
                              <TableCell
                                style={{ border: "0.5px solid black" }}
                              >
                                Variant Name
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody style={{ border: "0.5px solid black" }}>
                            {product.data.product_variants.map(
                              (variant, index) => (
                                <TableRow
                                  style={{ border: "0.5px solid black" }}
                                  key={index}
                                >
                                  <TableCell
                                    style={{ border: "0.5px solid black" }}
                                  >
                                    {variant.variant_name}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      ) : (
                        <Typography variant="body2">
                          Tidak ada varian tersedia
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>Gambar</TableCell>
                    <TableCell>
                      <Box display="flex" flexWrap="wrap">
                        {product.data.product_images.map((image, index) => (
                          <Image.PreviewGroup key={index}>
                            <Image
                              key={index}
                              src={image.image_url}
                              alt={`product-image-${index}`}
                              style={{ width: 250, height: 250, margin: 5 }}
                            />
                          </Image.PreviewGroup>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(-1)} // Navigate back
                  sx={{ mt: 2 }} // Optional: Add some margin
                >
                  Kembali
                </Button>
              </Table>
            </TableContainer>
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default DetailProduk;
