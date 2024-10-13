import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
  DialogTitle,
  Input,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  MenuItem,
} from "@mui/material";
import {
  IconPencil,
  IconTrash,
  IconUpload,
  IconEye,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../service/kategori/kategori.get.service";
import { getSubKategori } from "../../service/subKategori/subKategori.get.service";
import { getProduct } from "../../service/product/product.get.service";
import { postProduct } from "../../service/product/product.post.service";
import { updateProduct } from "../../service/product/product.update.service";
import { deleteProduct } from "../../service/product/product.delete.service";
import { postProductImage } from "../../service/product/productgambar.post.service";

const Product = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenn, setDialogOpenn] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create" or "Update"
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_images: [],
    category_name: "",
    categoryId: "",
    subcategory_name: "",
    subcategoryId: "",
    price: "",
    description: "",
  });
  const [currentProductId, setCurrentProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Menyimpan file gambar yang diunggah
  const [activeStep, setActiveStep] = useState(0); // Langkah aktif dalam stepper
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subcategoryMap, setSubcategoryMap] = useState({});

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
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch data kategori dari API
  const fetchData = async () => {
    try {
      const result = await getProduct();
      const formattedData = result.data.data.map((item) => [
        item.product_images[0], // Ambil hanya gambar pertama untuk ditampilkan di tabel
        item.product_name,
        item.category_name,
        item.subcategory_name,
        item.price, // Use item.price for price
        item.description, // Tambahkan deskripsi ke dalam data yang diformat
        item.id, // ID produk
        item.product_images,
        item.category_id,
        item.subCategory_id,
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch product data", error);
    }
  };

  useEffect(() => {
    fetchData(); // Panggil data kategori setiap kali halaman di-load
    fetchCategories();
    fetchSubCategories();
  }, []);

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({
      product_name: "",
      categoryId: "",
      subcategoryId: "",
      price: "",
      description: "",
      product_images: [],
    });
    setImageFile(null); // Reset file gambar
    setActiveStep(0); // Reset langkah ke step pertama
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    const rowData = data[rowIndex];
    setDialogMode("Update");
    setCurrentRowIndex(rowIndex);
    const category = categories.find((category) => category.id === rowData[8]);
    const subCategory = subCategories.find(
      (subcategory) => subcategory.subcategory_name === rowData[3]
    );
    setFormData({
      product_name: rowData[1],
      product_images: rowData[7],
      categoryId: rowData[8],
      subcategoryId: subCategory ? subCategory.id : null, // Set subcategoryId to the actual id
      price: rowData[4],
      description: rowData[5],
      category_name: category ? category.category_name : "",
      subcategory_name: subCategory ? subCategory.subcategory_name : "",
    });
    setCurrentProductId(rowData[6]);
    setDialogOpenn(true);
  };

  const handleDetail = (rowIndex) => {
    const rowData = data[rowIndex];
    setFormData({
      product_name: rowData[1],
      product_images: rowData[7], // Ambil semua gambar dari data yang diformat
      categoryId: rowData[2],
      subcategoryId: rowData[3],
      price: rowData[4], // Use rowData[5] for price
      description: rowData[5], // Ambil deskripsi dari data yang diformat
    });
    setCurrentProductId(rowData[6]); // Ambil ID produk
    setDetailDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogOpenn(false);
    setActiveStep(0); // Reset stepper saat dialog ditutup
    setDetailDialogOpen(false);
  };

  const handleSave = async () => {
    let imageUrl = formData.product_images;
    if (imageFile) {
      const uploadResult = await postProductImage(currentProductId, imageFile);
      imageUrl = uploadResult.image_url;
    }
    if (activeStep === 0) {
      if (dialogMode === "Create") {
        try {
          const response = await postProduct({
            product_name: formData.product_name,
            category_id: formData.categoryId,
            subcategory_id: formData.subcategoryId,
            price: formData.price,
            description: formData.description,
            product_images: [],
          });
          if (response.data && response.data.id) {
            setCurrentProductId(response.data.id);
            setActiveStep(1);
          } else {
            console.error("Product baru tidak ditemukan");
          }
        } catch (error) {
          console.error("Error creating product:", error);
        }
      } else if (dialogMode === "Update") {
        await updateProduct(currentProductId, {
          product_name: formData.product_name,
          category_id: formData.categoryId,
          subcategory_id: formData.subcategoryId,
          price: formData.price,
          description: formData.description,
          product_images: imageUrl,
        });
        const updatedData = data.map((row, index) =>
          index === currentRowIndex
            ? [
                imageUrl,
                formData.product_name,
                formData.price,
                formData.description,
                row[6],
                row[7],
                row[8],
                row[9],
              ]
            : row
        );
        setData(updatedData);
        setDialogOpenn(false);
        fetchData();
      }
    } else if (activeStep === 1) {
      if (dialogMode === "Create") {
        try {
          if (imageFile) {
            await postProductImage(currentProductId, imageFile);
          }
          fetchData();
          setDialogOpen(false);
        } catch (error) {
          console.error("Error uploading Product image:", error);
        }
      } else if (dialogMode === "Update") {
        try {
          if (imageFile) {
            await postProductImage(currentProductId, imageFile);
          }
          await updateProduct(currentProductId, {
            product_name: formData.product_name,
            category_id: formData.categoryId,
            subcategory_id: formData.subcategoryId,
            price: formData.price,
            description: formData.description,
            product_images: imageUrl,
          });
          const updatedData = data.map((row, index) =>
            index === currentRowIndex
              ? [
                  imageUrl,
                  formData.product_name,
                  formData.price,
                  formData.description,
                  row[6],
                  row[7],
                  row[8],
                  row[9],
                ]
              : row
          );
          setData(updatedData);
          setDialogOpenn(false);
          fetchData();
        } catch (error) {
          console.error("Error updating product image:", error);
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Menyimpan file gambar yang diupload
  };

  const handleDeleteClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setCurrentProductId(rowData[6]); // Use rowData[6] for product ID
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(currentProductId);
      const updatedData = data.filter((_, index) => index !== currentRowIndex);
      setData(updatedData);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0, // Add this option to remove the two numbers after the comma
    }).format(price);
  };

  const columns = [
    {
      name: "product_images",
      label: "Gambar Product",
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="product" style={{ width: 50, height: 50 }} />
        ),
      },
    },
    { name: "product_name", label: "Nama Produk" },
    { name: "category_name", label: "Nama Kategori" },
    { name: "subcategory_name", label: "Nama Sub Kategori" },
    {
      name: "price",
      label: "Harga",
      options: {
        customBodyRender: (value) => formatPrice(value),
      },
    },
    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => (
          <>
            <Tooltip title="Detail">
              <Button
                onClick={() => handleDetail(tableMeta.rowIndex)}
                sx={{ color: theme.palette.info.main }}
              >
                <IconEye />
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                onClick={() => handleUpdate(tableMeta.rowIndex)}
                sx={{ color: theme.palette.warning.main }}
              >
                <IconPencil />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                onClick={() => handleDeleteClick(tableMeta.rowIndex)}
                sx={{ color: theme.palette.error.main }}
              >
                <IconTrash />
              </Button>
            </Tooltip>
          </>
        ),
      },
    },
  ];

  return (
    <>
      <MUIDataTable
        title={
          <Button
            onClick={handleCreate}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              "&:hover": {
                background: theme.palette.error.light,
              },
            }}
          >
            Tambah Kategori
          </Button>
        }
        data={data}
        columns={columns}
        options={{
          selectableRows: "none",
          elevation: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: [5, 10, 20, 50, 100],
          textLabels: {
            pagination: {
              rowsPerPage: "Baris per Halaman",
            },
          },
        }}
      />

      <Dialog open={dialogOpenn} onClose={handleDialogClose}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Product"
            name="product_name"
            fullWidth
            value={formData.product_name}
            onChange={handleInputChange}
            sx={{ mt: 3, mb: 2 }}
          />

          <TextField
            select
            label="Kategori"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.category_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Sub Kategori"
            name="subcategoryId"
            value={formData.subcategoryId}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            {subCategories.map((subcategory) => (
              <MenuItem key={subcategory.id} value={subcategory.id}>
                {subcategory.subcategory_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Harga"
            name="price"
            fullWidth
            value={formatPrice(formData.price)}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Deskripsi"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleInputChange}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderColor: theme.palette.grey[400],
              mt: 1,
            }}
          >
            <IconUpload
              height="16px"
              width="16"
              style={{ marginRight: "10px" }}
            />
            Tambahkan Gambar
            <Input
              type="file"
              onChange={handleImageChange}
              inputProps={{ accept: "image/*" }}
              sx={{ display: "none" }}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Batal
          </Button>
          <Button onClick={handleSave} color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Tambah Product</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>Informasi Product</StepLabel>
            </Step>
            <Step>
              <StepLabel>Unggah Gambar</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 0 && (
            <>
              <TextField
                margin="dense"
                label="Nama Product"
                name="product_name"
                fullWidth
                value={formData.product_name}
                onChange={handleInputChange}
                sx={{ mt: 3, mb: 2 }} // added mb: 2 for consistent spacing
              />

              <TextField
                select
                label="Kategori"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }} // added mb: 2 for consistent spacing
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Sub Kategori"
                name="subcategoryId"
                value={formData.subcategoryId}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }} // added mb: 2 for consistent spacing
              >
                {subCategories.map((subcategory) => (
                  <MenuItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.subcategory_name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                margin="dense"
                label="Harga"
                name="price"
                fullWidth
                value={formatPrice(formData.price)}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                label="Deskripsi"
                name="description"
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
              />
            </>
          )}
          {activeStep === 1 && (
            <>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: theme.palette.grey[400],
                  marginLeft: "70px",
                  marginTop: "20px",
                }}
              >
                <IconUpload
                  height="16px"
                  width="16"
                  style={{ marginRight: "10px" }}
                />
                Tambahkan Gambar
                <Input
                  type="file"
                  onChange={handleImageChange}
                  inputProps={{ accept: "image/*" }}
                  hidden
                  sx={{ display: "none" }}
                />
              </Button>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep((prev) => prev - 1)}>
              Kembali
            </Button>
          )}
          <Button onClick={handleSave}>
            {activeStep === 0 ? "Selanjutnya" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={detailDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Detail Produk</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Produk"
            name="product_name"
            fullWidth
            value={formData.product_name}
            disabled
          />
          <TextField
            margin="dense"
            label="Kategori"
            name="category_name"
            fullWidth
            value={formData.categoryId}
            disabled
          />
          <TextField
            margin="dense"
            label="Sub Kategori"
            name="subcategory_name"
            fullWidth
            value={formData.subcategoryId}
            disabled
          />
          <TextField
            margin="dense"
            label="Harga"
            name="price"
            fullWidth
            value={formatPrice(formData.price)}
            disabled
          />
          <TextField
            margin="dense"
            label="Deskripsi"
            name="description"
            fullWidth
            value={formData.description}
            disabled
          />
          <Typography variant="body1">Gambar:</Typography>
          <Box display="flex" flexWrap="wrap">
            {formData.product_images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`product-image-${index}`}
                style={{ width: 100, height: 100, margin: 5 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Hapus Kategori</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus product ini?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Batal</Button>
          <Button onClick={handleDelete} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Product;
