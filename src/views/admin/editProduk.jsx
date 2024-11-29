import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  InputAdornment,
} from "@mui/material";
import { Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../service/admin/kategori.get.service";
import { getSubKategori } from "../../service/admin/subKategori.get.service";
import { getProductById } from "../../service/admin/product/product.getSpesifik.service"; // Assuming you have this service
import { updateProduct } from "../../service/admin/product/product.update.service";
import { deleteProductImage } from "../../service/admin/product/productgambar.delete.service";
import { postProductImage } from "../../service/admin/product/productgambar.post.service";
import { postProductVariants } from "../../service/admin/product/product.postVariants.service"; // Import the service for adding variants
import { deleteVariantImage } from "../../service/admin/product/product.deleteVariants.service"; // Import the service for deleting variants
import MainCard from "../../ui-component/cards/MainCard";
import Desk from "../../ui-component/Desk";
import DynamicTable from "../../ui-component/DynamicTable";

const EditProduk = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL
  const [formData, setFormData] = useState({
    product_name: "",
    product_images: [],
    categoryId: "",
    subcategoryId: "",
    price: "",
    additional_fee_area_2: "",
    description: "",
    location: "",
    status: "",
    special_price: false,
    free_shipping: false,
    vat: false,
    specification: [],
    stock: "",
  });

  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState([]);
  const [loading, setLoading] = useState(false); // Add this line

  // State for managing product variants
  const [variantName, setVariantName] = useState("");
  const [fetchedVariants, setFetchedVariants] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getKategori();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await getSubKategori();
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await getProductById(id);
      const product = response.data;

      setFormData({
        product_name: product.product_name,
        product_images: product.product_images || [],
        categoryId: product.category_id || "",
        subcategoryId: product.subcategory_id || "",
        price: product.price,
        additional_fee_area_2: product.additional_fee_area_2 || "",
        description: product.description,
        location: product.location,
        status: product.status,
        special_price: product.special_price,
        free_shipping: product.free_shipping,
        vat: product.vat,
        specification: Array.isArray(product.specification)
          ? product.specification
          : [],
        stock: product.stock,
      });

      // Set image files from existing images
      const existingImages = product.product_images.map((img) => ({
        uid: img.id,
        status: "done",
        url: img.image_url,
        id: img.id,
      }));
      setImageFile(existingImages);

      // Fetch existing product variants
      setFetchedVariants(product.product_variants || []);
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleImageUpload = async ({ file }) => {
    try {
      const uploadResult = await postProductImage(id, file);
      setFormData((prevData) => ({
        ...prevData,
        product_images: [...prevData.product_images, uploadResult.data.id],
      }));

      setImageFile((prevFileList) => {
        const isExistingFile = prevFileList.some(
          (item) => item.uid === file.uid
        );
        if (isExistingFile) {
          return prevFileList.map((item) =>
            item.uid === file.uid
              ? {
                  ...item,
                  status: "done",
                  url: uploadResult.imageFile,
                  id: uploadResult.data.id,
                }
              : item
          );
        } else {
          return [
            ...prevFileList,
            {
              uid: file.uid,
              name: file.name,
              status: "done",
              url: uploadResult.imageFile,
              id: uploadResult.data.id,
            },
          ];
        }
      });

      message.success("Gambar berhasil terkirim.");
    } catch (error) {
      console.error("Error uploading product image:", error);
      message.error("Gagal mengirim gambar.");
    }
  };

  const handleRemove = async (file) => {
    try {
      await deleteProductImage(file.id);
      message.success("Gambar berhasil terhapus.");
      setImageFile((prevFileList) =>
        prevFileList.filter((item) => item.uid !== file.uid)
      );
      setFormData((prevData) => ({
        ...prevData,
        product_images: prevData.product_images.filter(
          (imgId) => imgId !== file.id
        ),
      }));
    } catch (error) {
      console.error("Failed to delete image:", error);
      message.error("Gagal menghapus gambar.");
    }
  };

  const handleAddVariant = async () => {
    if (variantName.trim() === "") {
      message.error("Nama varian tidak boleh kosong.");
      return;
    }

    const serviceData = {
      product_id: id,
      variant_name: variantName,
    };

    try {
      const response = await postProductVariants(serviceData);
      if (response.code === 200) {
        message.success("Varian berhasil ditambahkan.");
        setFetchedVariants((prevVariants) => [
          ...prevVariants,
          { id: response.data.id, variant_name: variantName },
        ]);
        setVariantName(""); // Reset the variant name input
      } else {
        message.error("Gagal menambahkan varian: " + response.message);
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      message.error("Gagal menambahkan varian.");
    }
  };

  const handleRemoveVariant = async (index) => {
    const variantToDelete = fetchedVariants[index];
    try {
      await deleteVariantImage(variantToDelete.id);
      setFetchedVariants((prevVariants) =>
        prevVariants.filter((_, i) => i !== index)
      );
      message.success("Varian berhasil dihapus.");
    } catch (error) {
      message.error("Gagal menghapus varian: " + error.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await updateProduct(id, {
        category_id: formData.categoryId,
        subcategory_id: formData.subcategoryId,
        product_name: formData.product_name,
        product_images: formData.product_images,
        description: formData.description,
        price: formData.price,
        additional_fee_area_2: formData.additional_fee_area_2,
        location: formData.location,
        status: formData.status,
        special_price: formData.special_price,
        free_shipping: formData.free_shipping,
        vat: formData.vat,
        specification: formData.specification,
        stock: formData.stock,
      });
      message.success("Informasi Produk telah diperbarui.");
      navigate("/admin/manajemen/produk");
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("Gagal memperbarui informasi Produk.");
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList }) => {
    setImageFile(fileList);
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProductData();
  }, []);

  if (!formData) return <p>{loading}</p>;

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
        <MainCard title="Edit Produk">
          <div>
            <Grid container columnSpacing={2} rowSpacing={1.5} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Nama Product"
                  name="product_name"
                  fullWidth
                  value={formData.product_name}
                  onChange={(e) =>
                    setFormData({ ...formData, product_name: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <TextField
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  fullWidth
                >
                  {[
                    { key: "available", value: "Tersedia" },
                    { key: "out_of_stock", value: "Tidak Tersedia" },
                    { key: "pre_order", value: "Preorder/Inden" },
                  ].map((status) => (
                    <MenuItem key={status.key} value={status.key}>
                      {status.value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Harga"
                  name="price"
                  fullWidth
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <TextField
                  select
                  label="Kategori"
                  name="categoryId"
                  value={formData.categoryId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  fullWidth
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.category_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Harga Tambahan Lokasi 2"
                  name="additional_fee_area_2"
                  fullWidth
                  type="number"
                  value={formData.additional_fee_area_2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additional_fee_area_2: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <TextField
                  select
                  label="Sub Kategori"
                  name="subcategoryId"
                  value={formData.subcategoryId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategoryId: e.target.value })
                  }
                  fullWidth
                >
                  {subCategories
                    .filter((item) => item.category_id === formData.categoryId)
                    .map((subcategory) => (
                      <MenuItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.subcategory_name}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sx={{ mt: 1 }}>
                <TextField
                  select
                  label="Cabang"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  fullWidth
                >
                  {["Makassar", "Gowa", "Maros"].map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  margin="dense"
                  label="Stok"
                  name="stock"
                  type="number"
                  fullWidth
                  value={formData.stock}
                  onChange={(e) => {
                    setFormData({ ...formData, stock: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Desk
                  description={formData.description}
                  setDescription={(newDescription) =>
                    setFormData({ ...formData, description: newDescription })
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <DynamicTable
                  specifications={
                    Array.isArray(formData.specification)
                      ? formData.specification
                      : []
                  }
                  setSpecifications={(specs) =>
                    setFormData({ ...formData, specification: specs })
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Table
                  style={{ border: "0.2px solid #ccc" }}
                  sx={{ borderRadius: "200px" }}
                >
                  <TableHead style={{ border: "0.2px solid #ccc" }}>
                    <TableRow style={{ border: "0.2px solid #ccc" }}>
                      <TableCell style={{ border: "0.2px solid #ccc" }}>
                        Variant Produk
                        <TextField
                          margin="dense"
                          label="Nama Varian"
                          value={variantName}
                          onChange={(e) => setVariantName(e.target.value)}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell style={{ border: "0.2px solid #ccc" }}>
                        Aksi
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{ border: "0.2px solid #ccc" }}>
                    {fetchedVariants.map((variant, index) => (
                      <TableRow
                        key={variant.id}
                        style={{ border: "0.2px solid #ccc" }}
                      >
                        <TableCell style={{ border: "0.2px solid #ccc" }}>
                          <Typography variant="body1">
                            {variant.variant_name}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ border: "0.2px solid #ccc" }}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveVariant(index)}
                          >
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: "white",
                    color: "#555",
                    borderColor: "#999",
                    mt: 1,
                  }}
                  onClick={handleAddVariant}
                >
                  Tambah Varian
                </Button>
              </Grid>

              <Grid container item xs={12} direction="column">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.free_shipping}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          free_shipping: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Gratis Ongkir"
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Upload
                    customRequest={handleImageUpload}
                    fileList={imageFile}
                    listType="picture-card"
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                  >
                    {imageFile.length >= 5 ? null : (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </Box>
                <Typography variant="body" sx={{ color: "grey" }}>
                  <span style={{ color: "red" }}>*</span> maksimal ukuran gambar
                  1 mb
                </Typography>
                {previewImage && (
                  <Box
                    sx={{
                      display: previewOpen ? "block" : "none",
                      opacity: previewOpen ? 1 : 0,
                      transition: "opacity 0.5s ease",
                      position: "relative",
                    }}
                  >
                    <Image
                      wrapperStyle={{ display: "none" }}
                      opacity={0}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                      style={{ objectFit: "contain" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6">Product Variants</Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                margin="dense"
                label="Nama Varian"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" onClick={handleAddVariant}>
                Tambah Varian
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {fetchedVariants.map((variant, index) => (
              <Grid item xs={12} key={variant.id}>
                <Grid container spacing={1} sx={{ padding: "8px 0" }}>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {variant.variant_name}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveVariant(index)}
                    >
                      Hapus
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid> */}
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ mt: 2 }}
            >
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Kembali
              </Button>
              <Button variant="contained" onClick={handleUpdateProduct}>
                Simpan
              </Button>
            </Grid>
          </div>
        </MainCard>
      )}
    </>
  );
};

export default EditProduk;
