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
  Typography,
  Box,
} from "@mui/material";
import {
  IconPencil,
  IconTrash,
  IconUpload,
  IconEye,
} from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getProduct } from "../../service/product/product.get.service";
import { postProduct } from "../../service/product/product.post.service";
import { updateProduct } from "../../service/product/product.update.service";
import { deleteProduct } from "../../service/product/product.delete.service";
import { postProductImage } from "../../service/product/productgambar.post.service";

const Product = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create" or "Update"
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    product_images: [],
    category_name: "",
    price: "",
    description: "",
  });
  const [currentProductId, setCurrentProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Menyimpan file gambar yang diunggah

  // Fetch data produk dari API
  const fetchData = async () => {
    try {
      const result = await getProduct();
      const formattedData = result.data.data.map((item) => [
        item.product_images[0], // Ambil hanya gambar pertama untuk ditampilkan di tabel
        item.product_name,
        item.category_name,
        item.price,
        item.description, // Tambahkan deskripsi ke dalam data yang diformat
        item.id, // ID produk
        item.product_images, // Menyimpan semua gambar untuk detail
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch product data", error);
    }
  };

  useEffect(() => {
    fetchData(); // Panggil data produk setiap kali halaman di-load
  }, []);

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({
      product_name: "",
      product_images: [],
      category_name: "",
      price: "",
      description: "",
    }); // Reset data
    setImageFile(null); // Reset file gambar
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setFormData({
      product_name: rowData[1], // Ambil nama produk
      product_images: rowData[6], // Ambil URL gambar
      category_name: rowData[2],
      price: rowData[3],
      description: rowData[4], // Ambil deskripsi dari data yang diformat
    });
    setCurrentProductId(rowData[5]); // Ambil ID produk
    setDialogOpen(true); // Buka dialog untuk edit
  };

  const handleDetail = (rowIndex) => {
    const rowData = data[rowIndex];
    setFormData({
      product_name: rowData[1],
      product_images: rowData[6], // Ambil semua gambar dari data yang diformat
      category_name: rowData[2],
      price: rowData[3],
      description: rowData[4], // Ambil deskripsi dari data yang diformat
    });
    setCurrentProductId(rowData[5]); // Ambil ID produk
    setDetailDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDetailDialogOpen(false);
  };

  const handleSave = async () => {
    try {
      let imageUrl = formData.product_images;

      // Jika ada file gambar yang diunggah, upload terlebih dahulu
      if (imageFile) {
        const uploadResult = await postProductImage(
          currentProductId,
          imageFile
        );
        imageUrl = uploadResult.image_url; // Dapatkan URL gambar dari hasil unggahan
      }

      if (dialogMode === "Create") {
        await postProduct({
          product_name: formData.product_name,
          product_images: imageUrl,
          category_name: formData.category_name,
          price: formData.price,
          description: formData.description,
        });
        fetchData(); // Refresh data setelah create
      } else if (dialogMode === "Update") {
        await updateProduct(currentProductId, {
          product_name: formData.product_name,
          product_images: imageUrl,
          category_name: formData.category_name,
          price: formData.price,
          description: formData.description,
        });
        fetchData(); // Refresh data setelah update
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Menyimpan file gambar yang dipilih
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Fungsi untuk membuka dialog konfirmasi delete
  const handleDeleteClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setCurrentProductId(rowData[5]);
    setDeleteDialogOpen(true);
  };

  // Fungsi untuk menghapus produk
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

  const columns = [
    {
      name: "product_images",
      label: "Gambar Produk",
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="product" style={{ width: 50, height: 50 }} />
        ),
      },
    },
    { name: "product_name", label: "Nama Produk" },
    { name: "category_name", label: "Nama Kategori" },
    { name: "price", label: "Harga" },
    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => (
          <>
            <Tooltip title="Edit">
              <Button
                onClick={() => handleUpdate(tableMeta.rowIndex)}
                sx={{ color: theme.palette.warning.main }}
              >
                <IconPencil />
              </Button>
            </Tooltip>
            <Tooltip title="Detail">
              <Button
                onClick={() => handleDetail(tableMeta.rowIndex)}
                sx={{ color: theme.palette.info.main }}
              >
                <IconEye />
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
            Tambah Produk
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
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Produk"
            name="product_name"
            fullWidth
            value={formData.product_name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Nama Kategori"
            name="category_name"
            fullWidth
            value={formData.category_name}
            onChange={handleInputChange}
            sx={{ marginTop: 2 }}
          />
          <TextField
            margin="dense"
            label="Harga"
            name="price"
            fullWidth
            value={formData.price}
            onChange={handleInputChange}
            sx={{ marginTop: 2 }}
          />
          <TextField
            margin="dense"
            label="Deskripsi"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{ marginTop: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderColor: theme.palette.grey[400],
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
              onChange={handleImageChange} // Menangani perubahan file gambar
              inputProps={{ accept: "image/*" }}
              sx={{ display: "none" }} // Sembunyikan input asli
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Batal
          </Button>
          <Button onClick={handleSave} color="primary">
            {dialogMode === "Create" ? "Simpan" : "Perbarui"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Hapus Produk</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin menghapus produk ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Batal
          </Button>
          <Button onClick={handleDelete} color="primary">
            Hapus
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
            value={getSubCategoryName(formData.subcategoryId)}
            disabled
          />
          <TextField
            margin="dense"
            label="Kategori"
            name="subcategory_name"
            fullWidth
            value={getSubCategoryName(formData.subcategoryId)}
            disabled
          />
          <TextField
            margin="dense"
            label="Kategori"
            name="category_name"
            fullWidth
            value={getSubCategoryName(formData.subcategoryId)}
            disabled
          />
          <TextField
            margin="dense"
            label="Harga"
            name="price"
            fullWidth
            value={formData.price}
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
    </>
  );
};

export default Product;
