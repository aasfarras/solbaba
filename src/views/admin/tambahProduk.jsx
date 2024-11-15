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
} from "@mui/material";
import { Upload, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IconUpload } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../service/admin/kategori.get.service";
import { getSubKategori } from "../../service/admin/subKategori.get.service";
import { postProduct } from "../../service/admin/product/product.post.service";
import { postProductImage } from "../../service/admin/product/productgambar.post.service";
import { deleteProductImage } from "../../service/admin/product/productgambar.delete.service";
import MainCard from "../../ui-component/cards/MainCard";
import DynamicTable from "../../ui-component/DynamicTable";
import Desk from "../../ui-component/Desk";
import { useDropzone } from "react-dropzone";

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
  });

  const [activeStep, setActiveStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productId, setProductId] = useState(null);

  // dari sini
  const [imageFile, setImageFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // const handleSaveTable = (htmlOutput) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     specification: htmlOutput, // Update formData with HTML table
  //   }));
  // };

  const getDataForApi = () => {
    return data
      .map((row) => {
        const formattedRow = {};
        columns.forEach((column) => {
          // Hanya tambahkan ke formattedRow jika nilainya tidak kosong
          if (row[column.accessor] && row[column.accessor].trim() !== "") {
            formattedRow[column.Header] = row[column.accessor];
          }
        });
        return formattedRow;
      })
      .filter((row) => Object.keys(row).length > 0); // Hanya ambil row yang tidak kosong
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

      console.log("Filtered Specifications:", filteredSpecifications); // Log filtered specifications

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
        });

        if (response.code === 200) {
          setProductId(response.data.id);
          console.log("Product ID:", response.data.id);
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

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

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
          <Typography variant="body">maksimal ukuran gambar 1 mb</Typography>
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
                  afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
                style={{ objectFit: "contain" }} // Menyesuaikan cara gambar ditampilkan
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
