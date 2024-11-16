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
import MainCard from "../../ui-component/cards/MainCard";
import Desk from "../../ui-component/Desk";
import DynamicTable from "../../ui-component/DynamicTable";
import { Box } from "@mui/system";

const EditProduk = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the product ID from the URL
  const [formData, setFormData] = useState({
    product_name: "",
    product_images: [], // Menyimpan gambar produk
    category_name: "", // Menyimpan nama kategori
    categoryId: "",
    subcategory_name: "", // Menyimpan nama subkategori
    subcategoryId: "",
    price: "",
    additional_fee_area_2: "",
    description: "", // Menyimpan deskripsi produk
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
  const [imageFile, setImageFile] = useState([]); // State untuk gambar yang diupload
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState([]);

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
    try {
      const response = await getProductById(id);
      const product = response.data;

      setFormData({
        product_name: product.product_name,
        product_images: product.product_images || [],
        categoryId: product.category_id || "",
        subcategoryId: product.subcategory_id || "",
        price: product.price,
        additional_fee_area_2: product.additional_fee_area_2 || "", // Ambil nilai dari API
        description: product.description,
        location: product.location,
        status: product.status,
        special_price: product.special_price,
        free_shipping: product.free_shipping,
        vat: product.vat,
        specification: Array.isArray(product.specification)
          ? product.specification
          : [], // Ensure it's an array
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
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const handleImageUpload = async ({ file }) => {
    try {
      // Mengunggah gambar
      const uploadResult = await postProductImage(id, file);

      // Memperbarui state formData dengan URL gambar yang baru diunggah
      setFormData((prevData) => ({
        ...prevData,
        product_images: [...prevData.product_images, uploadResult.data.id], // Simpan id gambar
      }));

      // Tambahkan gambar yang berhasil diupload ke fileList
      setImageFile((prevFileList) => {
        const isExistingFile = prevFileList.some(
          (item) => item.uid === file.uid
        );

        if (isExistingFile) {
          // Jika file sudah ada dalam fileList, perbarui status dan URL
          return prevFileList.map((item) =>
            item.uid === file.uid
              ? {
                  ...item,
                  status: "done",
                  url: uploadResult.imageFile,
                  id: uploadResult.data.id,
                } // Simpan id
              : item
          );
        } else {
          // Jika file belum ada, tambahkan sebagai item baru
          return [
            ...prevFileList,
            {
              uid: file.uid, // Unique ID dari file
              name: file.name,
              status: "done", // Set status menjadi 'done'
              url: uploadResult.imageFile, // URL dari gambar yang telah diupload
              id: uploadResult.data.id, // Simpan id gambar
            },
          ];
        }
      });

      // Tampilkan pesan sukses
      message.success("Gambar berhasil terkirim.");
    } catch (error) {
      console.error("Error uploading product image:", error);
      message.error("Gagal mengirim gambar.");
    }
  };

  const handleRemove = async (file) => {
    try {
      await deleteProductImage(file.id); // Hapus gambar berdasarkan ID
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

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchProductData();
  }, []);

  const handleChange = ({ fileList }) => {
    setImageFile(fileList);
  };

  const handleUpdateProduct = async () => {
    console.log("Updating product with data:", formData);
    try {
      await updateProduct(id, {
        category_id: formData.categoryId,
        subcategory_id: formData.subcategoryId,
        product_name: formData.product_name,
        product_images: formData.product_images,
        category_name: formData.category_name,
        subcategory_name: formData.subcategory_name,
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

  //   console.log(formData);

  return (
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
                { key: "Preorder", value: "Preorder/Inden" },
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
              value={formData.additional_fee_area_2} // Pastikan ini terhubung dengan state
              onChange={(e) =>
                setFormData({
                  ...formData,
                  additional_fee_area_2: e.target.value,
                })
              }
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
                console.log("Stock input value:", e.target.value);

                setFormData({ ...formData, stock: e.target.value });
              }}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Desk
              description={formData.description} // Pass description to Desk
              setDescription={(newDescription) =>
                setFormData({ ...formData, description: newDescription })
              } // Pass function to update description
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <DynamicTable
              specifications={
                Array.isArray(formData.specification)
                  ? formData.specification
                  : []
              } // Ensure it's an array
              setSpecifications={(specs) =>
                setFormData({ ...formData, specification: specs })
              }
            />
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
              <span style={{ color: "red" }}>*</span> maksimal ukuran gambar 1
              mb
            </Typography>
            {previewImage && (
              <Box
                sx={{
                  display: previewOpen ? "block" : "none", // Menyembunyikan Box jika tidak terlihat
                  opacity: previewOpen ? 1 : 0, // Mengatur opacity
                  transition: "opacity 0.5s ease", // Menambahkan animasi transisi
                  position: "relative", // Agar dapat mengatur posisi jika diperlukan
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
                  style={{ objectFit: "contain" }} // Menyesuaikan cara gambar ditampilkan
                />
              </Box>
            )}
          </Grid>
        </Grid>
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
  );
};

export default EditProduk;
