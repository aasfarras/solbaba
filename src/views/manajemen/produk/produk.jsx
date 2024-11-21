import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  DialogTitle,
  Box,
  CircularProgress,
} from "@mui/material";
import { IconPencil, IconTrash, IconEye } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../../service/kategori/kategori.get.service";
import { getSubKategori } from "../../../service/subKategori/subKategori.get.service";
import { getProduct } from "../../../service/product/product.get.service";
// import { postProduct } from "../../../service/product/product.post.service";
// import { updateProduct } from "../../../service/product/product.update.service";
import { deleteProduct } from "../../../service/product/product.delete.service";
// import { postProductImage } from "../../../service/product/productgambar.post.service";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const theme = useTheme();
  // Di dalam komponen Product
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenn, setDialogOpenn] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add this line
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
    location: "", // New field
    status: "", // New field
    special_price: false, // New field
    free_shipping: false, // New field
    vat: false, // New field
  });
  const [currentProductId, setCurrentProductId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Menyimpan file gambar yang diunggah
  const [activeStep, setActiveStep] = useState(0); // Langkah aktif dalam stepper
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subcategoryMap, setSubcategoryMap] = useState({});
  const [perPage, setPerPage] = useState(100); // Default 10 baris per halaman
  const [currentPage, setCurrentPage] = useState(1); // Default ke halaman 1
  const [total, setTotal] = useState(0);

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
  const fetchData = async (page) => {
    try {
      setLoading(true);
      const result = await getProduct(page);

      const formattedData = result.data.data.map((item) => {
        const firstImageUrl = item.product_images[0]
          ? item.product_images[0].image_url
          : null;
        return [
          firstImageUrl, // Ambil hanya gambar pertama untuk ditampilkan di tabel
          item.product_name,
          item.category_name,
          item.subcategory_name,
          item.price, // Use item.price for price
          item.description, // Tambahkan deskripsi ke dalam data yang diformat
          item.id, // ID produk
          item.product_images,
          item.category_id,
          item.subCategory_id,
          item.location, // New field
          item.status, // New field
          item.special_price, // New field
          item.free_shipping, // New field
          item.vat, // New field
        ];
      });
      setData(formattedData);
      setTotal(result.data.total);
      setCurrentPage(result.data.current_page);
    } catch (error) {
      console.error("Failed to fetch product data", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData(currentPage); // Panggil data kategori setiap kali halaman di-load
    fetchCategories();
    fetchSubCategories();
  }, [currentPage]);

  // const handleCreate = () => {
  //   setDialogMode("Create");
  //   setFormData({
  //     product_name: "",
  //     categoryId: "",
  //     subcategoryId: "",
  //     price: "",
  //     description: "",
  //     product_images: [],
  //   });
  //   setImageFile(null); // Reset file gambar
  //   setActiveStep(0); // Reset langkah ke step pertama
  //   setDialogOpen(true);
  // };

  const handleUpdate = (rowIndex) => {
    const rowData = data[rowIndex];
    const productId = rowData[6];
    window.location.href = `/super-admin/manajemen/produk/editproduk/${productId}`;
    // setDialogMode("Update");
    // setCurrentRowIndex(rowIndex);
    // const category = categories.find((category) => category.id === rowData[8]);
    // const subCategory = subCategories.find(
    //   (subcategory) => subcategory.subcategory_name === rowData[3]
    // );
    // setFormData({
    //   product_name: rowData[1],
    //   product_images: rowData[7],
    //   categoryId: rowData[8],
    //   subcategoryId: subCategory ? subCategory.id : null, // Set subcategoryId to the actual id
    //   price: rowData[4],
    //   description: rowData[5],
    //   category_name: category ? category.category_name : "",
    //   subcategory_name: subCategory ? subCategory.subcategory_name : "",
    // });
    // setCurrentProductId(rowData[6]);
    // setDialogOpenn(true);
  };

  const handleDetail = (rowIndex) => {
    const rowData = data[rowIndex];
    const productId = rowData[6]; // Assuming this is the ID of the product
    // Navigate to detail page with the product ID
    window.location.href = `/super-admin/manajemen/produk/detailproduk/${productId}`; // Adjust the path based on your routing setup
  };

  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  //   setDialogOpenn(false);
  //   setActiveStep(0); // Reset stepper saat dialog ditutup
  //   setDetailDialogOpen(false);
  // };

  // const handleSave = async () => {
  //   let imageUrl = formData.product_images;
  //   if (imageFile) {
  //     const uploadResult = await postProductImage(currentProductId, imageFile);
  //     imageUrl = uploadResult.image_url;
  //   }
  //   if (activeStep === 0) {
  //     if (dialogMode === "Create") {
  //       try {
  //         const response = await postProduct({
  //           product_name: formData.product_name,
  //           category_id: formData.categoryId,
  //           subcategory_id: formData.subcategoryId,
  //           price: formData.price,
  //           description: formData.description,
  //           product_images: [],
  //           location: formData.location, // Include location
  //           status: formData.status, // Include status
  //           special_price: formData.special_price, // Include special_price
  //           free_shipping: formData.free_shipping, // Include free_shipping
  //           vat: formData.vat, // Include vat
  //         });
  //         if (response.data && response.data.id) {
  //           setCurrentProductId(response.data.id);
  //           setActiveStep(1);
  //         } else {
  //           console.error("Product baru tidak ditemukan");
  //         }
  //       } catch (error) {
  //         console.error("Error creating product:", error);
  //       }
  //     } else if (dialogMode === "Update") {
  //       await updateProduct(currentProductId, {
  //         product_name: formData.product_name,
  //         category_id: formData.categoryId,
  //         subcategory_id: formData.subcategoryId,
  //         price: formData.price,
  //         description: formData.description,
  //         product_images: imageUrl,
  //       });
  //       const updatedData = data.map((row, index) =>
  //         index === currentRowIndex
  //           ? [
  //               imageUrl,
  //               formData.product_name,
  //               formData.price,
  //               formData.description,
  //               row[6],
  //               row[7],
  //               row[8],
  //               row[9],
  //             ]
  //           : row
  //       );
  //       setData(updatedData);
  //       setDialogOpenn(false);
  //       fetchData();
  //     }
  //   } else if (activeStep === 1) {
  //     if (dialogMode === "Create") {
  //       try {
  //         if (imageFile) {
  //           await postProductImage(currentProductId, imageFile);
  //         }
  //         fetchData();
  //         setDialogOpen(false);
  //       } catch (error) {
  //         console.error("Error uploading Product image:", error);
  //       }
  //     } else if (dialogMode === "Update") {
  //       try {
  //         if (imageFile) {
  //           await postProductImage(currentProductId, imageFile);
  //         }
  //         await updateProduct(currentProductId, {
  //           product_name: formData.product_name,
  //           category_id: formData.categoryId,
  //           subcategory_id: formData.subcategoryId,
  //           price: formData.price,
  //           description: formData.description,
  //           product_images: imageUrl,
  //         });
  //         const updatedData = data.map((row, index) =>
  //           index === currentRowIndex
  //             ? [
  //                 imageUrl,
  //                 formData.product_name,
  //                 formData.price,
  //                 formData.description,
  //                 row[6],
  //                 row[7],
  //                 row[8],
  //                 row[9],
  //               ]
  //             : row
  //         );
  //         setData(updatedData);
  //         setDialogOpenn(false);
  //         fetchData();
  //       } catch (error) {
  //         console.error("Error updating product image:", error);
  //       }
  //     }
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleImageChange = (e) => {
  //   setImageFile(e.target.files[0]); // Menyimpan file gambar yang diupload
  // };

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
      label: "Gambar Produk",
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
        <>
          <MUIDataTable
            title={
              <Link to="tambahproduk">
                <Button variant="contained">Tambah Produk</Button>
              </Link>
            }
            data={data}
            columns={columns}
            options={{
              selectableRows: "none",
              elevation: 0,
              // pagination: false,
              // rowsPerPage: perPage,
              rowsPerPageOptions: [5, 10, 20, 50, 100],
              textLabels: {
                body: {
                  noMatch: "Maaf, tidak ada data yang cocok ditemukan", // Ubah pesan di sini
                },
                pagination: {
                  rowsPerPage: "Baris per Halaman",
                },
              },
              // onChangeRowsPerPage: (newPerPage) => {
              //   setPerPage(newPerPage);
              //   fetchData(1); // Reset ke halaman 1 saat mengubah perPage
              // },
              // onChangePage: (newPage) => {
              //   fetchData(newPage + 1); // MUIDataTable menggunakan 0-indexed, jadi tambahkan 1
              // },
            }}
          />
          <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
            <DialogTitle variant="h5">Hapus Kategori</DialogTitle>
            <DialogContent>
              Apakah Anda yakin ingin menghapus produk ini?
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose}>Batal</Button>
              <Button onClick={handleDelete} color="error">
                Hapus
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Product;
