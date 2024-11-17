import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Input,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Grid,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IconUpload } from "@tabler/icons-react";

import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../../service/kategori/kategori.get.service";
import { getSubKategori } from "../../../service/subKategori/subKategori.get.service";
import { postProduct } from "../../../service/product/product.post.service";
import { postProductVariants } from "../../../service/product/product.postVariants.service";
import { postProductImage } from "../../../service/product/productgambar.post.service";
import { deleteProductImage } from "../../../service/product/productgambar.delete.service";
import MainCard from "../../../ui-component/cards/MainCard";
import DynamicTable from "../../../ui-component/DynamicTable";
import Desk from "../../../ui-component/Desk";
import { useDropzone } from "react-dropzone";
import { getVariantById } from "../../../service/product/product.getVariants.service"; // Adjust the path as necessary
import { deleteVariantImage } from "../../../service/product/product.deleteVariants.service"; // Adjust the path as necessary

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const TambahProduk = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    product_name: "",
    product_images: [],
    category_name: "",
    categoryId: "",
    subcategory_name: "",
    subcategoryId: "",
    price: "",
    additional_fee_area_2: "",
    description: "", // Add description to formData
    location: "",
    status: "",
    stock: "",
    special_price: false,
    free_shipping: false,
    vat: false,
    specification: [],
    product_variants: [], // Add this line
  });

  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productId, setProductId] = useState(null);

  // dari sini
  const [imageFile, setImageFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [variantName, setVariantName] = useState(""); // Add this line
  const [variantNames, setVariantNames] = useState([]); // Change this line
  const [fetchedVariants, setFetchedVariants] = useState([]); // State to store fetched variants

  // const handleSaveTable = (htmlOutput) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     specification: htmlOutput, // Update formData with HTML table
  //   }));
  // };

  const handleRemoveVariant = async (index) => {
    const variantToDelete = fetchedVariants[index]; // Get the variant to delete
    try {
      await deleteVariantImage(variantToDelete.id); // Call the API to delete the variant
      setFetchedVariants(
        (prevVariants) => prevVariants.filter((_, i) => i !== index) // Update the state to remove the deleted variant
      );
      message.success("Varian berhasil dihapus.");
    } catch (error) {
      message.error("Gagal menghapus varian: " + error.message);
    }
  };

  const handleAddVariant = async () => {
    if (!productId) {
      message.error("Harap simpan informasi produk terlebih dahulu.");
      return;
    }

    if (variantName.trim() === "") {
      message.error("Nama varian tidak boleh kosong.");
      return;
    }

    const serviceData = {
      product_id: productId,
      variant_name: variantName,
    };

    try {
      const response = await postProductVariants(serviceData);
      if (response.code === 200) {
        message.success("Varian berhasil ditambahkan.");
        // Optionally, you can reset the variant name input
        setVariantName("");
        setVariantNames([...variantNames, variantName]); // Tambahkan ini
        await fetchVariants();
      } else {
        message.error("Gagal menambahkan varian: " + response.message);
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      message.error("Gagal menambahkan varian.");
    }
  };

  const handleNextStep = async () => {
    if (activeStep === 0) {
      // Validasi spesifikasi

      // Filter data untuk menghilangkan kolom yang kosong
      const filteredSpecifications = formData.specification
        .map((spec) => {
          const filteredSpec = {};
          Object.keys(spec).forEach((key) => {
            if (spec[key] !== "") {
              // Hanya tambahkan jika nilainya tidak kosong
              filteredSpec[key] = spec[key];
            }
          });
          return filteredSpec;
        })
        .filter((spec) => Object.keys(spec).length > 0); // Hanya ambil spesifikasi yang tidak kosong

      try {
        const response = await postProduct({
          product_name: formData.product_name,
          category_id: formData.categoryId,
          subcategory_id: formData.subcategoryId,
          price: formData.price,
          description: formData.description,
          location: formData.location,
          status: formData.status,
          special_price: formData.special_price,
          free_shipping: formData.free_shipping,
          vat: formData.vat,
          additional_fee_area_2: formData.additional_fee_area_2,
          specification: filteredSpecifications, // Kirim data yang sudah difilter
          stock: formData.stock,
          product_variants: formData.product_variants,
        });

        if (response.code === 200) {
          setProductId(response.data.id);

          // Send variants to the server
          for (const variant of formData.product_variants) {
            await postProductVariants(variant.variant_name, response.data.id);
          }

          setActiveStep((prevStep) => prevStep + 1);
          message.success("Informasi Produk telah tersimpan.");
        } else {
          message.error("Gagal menambahkan produk: " + response.message);
        }
      } catch (error) {
        console.error("Error creating product:", error);
        message.error("Gagal menyimpan informasi Produk.");
      }
    } else {
      navigate(-1);
    }
  };

  const handleImageUpload = async ({ file }) => {
    try {
      // Mengunggah gambar
      const uploadResult = await postProductImage(productId, file);

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

  const handleRemove = async (file) => {
    try {
      // Menggunakan id gambar yang disimpan dalam state
      await deleteProductImage(file.id); // Gunakan file.id yang disimpan saat mengupload

      message.success("Gambar berhasil terhapus.");

      setImageFile((prevFileList) =>
        prevFileList.filter((item) => item.uid !== file.uid)
      );

      setFormData((prevData) => ({
        ...prevData,
        product_images: prevData.product_images.filter(
          (imgId) => imgId !== file.id // Filter berdasarkan id gambar
        ),
      }));
    } catch (error) {
      console.error("Failed to delete image:", error);
      message.error("Gagal menghapus gambar.");
    }
  };

  // sampai sini

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

  const fetchVariants = async () => {
    if (productId) {
      try {
        const response = await getVariantById(productId);
        setFetchedVariants(response.data);
      } catch (error) {
        message.error("Gagal mengambil varian produk.");
      }
    }
  };

  useEffect(() => {
    fetchVariants();
    fetchCategories();
    fetchSubCategories();
  }, [productId]);

  return (
    <MainCard>
      <Stepper activeStep={activeStep}>
        <Step>
          <StepLabel>Informasi Produk</StepLabel>
        </Step>
        <Step>
          <StepLabel>Unggah Gambar</StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <div>
          <Grid container columnSpacing={2} rowSpacing={1.5} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Nama Product"
                name="product _name"
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
                label={formData.special_price ? "Harga Special" : "Harga"}
                name="price"
                fullWidth
                type="number"
                value={
                  formData.special_price ? "Harga Special" : formData.price
                }
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
                value={formData.categoryId}
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
              />
            </Grid>

            <Grid item xs={6} sx={{ mt: 1 }}>
              <TextField
                select
                label="Sub Kategori"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={(e) =>
                  setFormData({ ...formData, subcategoryId: e.target.value })
                }
                fullWidth
              >
                {subCategories
                  .filter((item) => item.category_id == formData.categoryId)
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
                fullWidth
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                type="number"
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
                specifications={formData.specification}
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
          </Grid>

          <Grid
            container
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Kembali
            </Button>
            <Button
              variant="contained"
              sx={{ boxShadow: 0, mt: 2 }}
              onClick={handleNextStep}
            >
              Selanjutnya
            </Button>
          </Grid>
        </div>
      )}
      {activeStep === 1 && (
        <div style={{ marginTop: "20px" }}>
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
            <span style={{ color: "red" }}>*</span> maksimal ukuran gambar 1 mb
          </Typography>
          <Table
            style={{ border: "0.2px solid #ccc" }}
            sx={{ borderRadius: "200px", mt: 2 }}
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
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}
          <Grid direction="row">
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              sx={{ mt: 2 }}
            >
              Selesai
            </Button>
          </Grid>
        </div>
      )}
    </MainCard>
  );
};

export default TambahProduk;
