import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import MainCard from "../../ui-component/cards/MainCard";

// Gaya gambar secara horizontal
const imageStyle = {
  display: "flex",
  overflowX: "auto",
  gap: "10px",
  padding: "10px 0",
};

const Produk = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    {
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150",
      ],
      name: "Produk A",
      kategori: "Elektronik",
      subKategori: "Smartphone",
      harga: "Rp. 5.000.000",
      terjual: "50",
      rating: "4.5",
    },
    // Produk lainnya
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Detail", "Create", "Update"
  const [currentRowIndex, setCurrentRowIndex] = useState(null); // Menyimpan index baris yang sedang diedit
  const [currentRow, setCurrentRow] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fungsi untuk menangani klik tombol "Detail"
  const handleDetail = (rowIndex) => {
    setDialogMode("Detail");
    setCurrentRowIndex(rowIndex);
    setCurrentRow(data[rowIndex]);
    setImagePreviews(data[rowIndex].images);
    setDialogOpen(true);
  };

  // Fungsi untuk menangani klik tombol "Edit"
  const handleEdit = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRowIndex(rowIndex);
    setCurrentRow({ ...data[rowIndex] }); // Copy data untuk diedit
    setImagePreviews(data[rowIndex].images); // Menetapkan URL gambar sebagai preview
    setDialogOpen(true);
  };

  // Fungsi untuk menangani klik tombol "Delete"
  const handleDelete = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
  };

  // Fungsi untuk menutup dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    setImagePreviews([]);
  };

  // Fungsi untuk menyimpan perubahan produk baru atau produk yang diedit
  const handleSave = () => {
    const updatedData = [...data];
    if (dialogMode === "Create") {
      updatedData.push({ ...currentRow, images: imagePreviews });
    } else if (dialogMode === "Update") {
      updatedData[currentRowIndex] = { ...currentRow, images: imagePreviews };
    }
    setData(updatedData);
    handleDialogClose();
  };

  // Fungsi untuk menangani perubahan gambar yang diunggah
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setCurrentRow((prevRow) => ({
      ...prevRow,
      images: files,
    }));
  };

  // Kolom untuk tabel
  const columns = [
    {
      name: "images",
      label: "Foto Produk",
      options: {
        customBodyRender: (value, tableMeta) => (
          <img
            src={data[tableMeta.rowIndex].images[0]} // Thumbnail gambar pertama
            alt="Foto Produk"
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
        ),
      },
    },
    { name: "name", label: "Nama Produk" },
    { name: "kategori", label: "Kategori Produk" },
    { name: "subKategori", label: "Sub Kategori Produk" },
    { name: "harga", label: "Harga" },
    { name: "terjual", label: "Jumlah Terjual" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Tooltip title="Detail">
              <Button
                onClick={() => handleDetail(tableMeta.rowIndex)}
                sx={{ color: theme.palette.success.dark }}
              >
                <IconEye />
              </Button>
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                onClick={() => handleEdit(tableMeta.rowIndex)}
                sx={{ color: theme.palette.primary.main }}
              >
                <IconPencil />
              </Button>
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                onClick={() => handleDelete(tableMeta.rowIndex)}
                sx={{ color: theme.palette.error.main }}
              >
                <IconTrash />
              </Button>
            </Tooltip>
          </div>
        ),
      },
    },
  ];

  return (
    <MainCard title="Manajemen Produk">
      <MUIDataTable
        title={
          <Button
            onClick={() => {
              setDialogMode("Create");
              setCurrentRow({
                images: [],
                name: "",
                kategori: "",
                subKategori: "",
                harga: "",
                terjual: "",
                rating: "",
              });
              setImagePreviews([]);
              setDialogOpen(true);
            }}
            variant="contained"
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
        }}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Box>
            <Typography variant="h6">
              {dialogMode === "Detail" ? "Detail Produk" : "Form Produk"}
            </Typography>
            <TextField
              margin="dense"
              label="Nama Produk"
              name="name"
              fullWidth
              value={currentRow?.name || ""}
              InputProps={{
                readOnly: dialogMode === "Detail",
              }}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Kategori Produk"
              name="kategori"
              fullWidth
              value={currentRow?.kategori || ""}
              InputProps={{
                readOnly: dialogMode === "Detail",
              }}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, kategori: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Sub Kategori Produk"
              name="subKategori"
              fullWidth
              value={currentRow?.subKategori || ""}
              InputProps={{
                readOnly: dialogMode === "Detail",
              }}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, subKategori: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Harga"
              name="harga"
              fullWidth
              value={currentRow?.harga || ""}
              InputProps={{
                readOnly: dialogMode === "Detail",
              }}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, harga: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Jumlah Terjual"
              name="terjual"
              fullWidth
              value={currentRow?.terjual || ""}
              InputProps={{
                readOnly: dialogMode === "Detail",
              }}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, terjual: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Rating"
              name="rating"
              fullWidth
              value={currentRow?.rating || ""}
              InputProps={{
                readOnly: dialogMode === "Detail",
              }}
              onChange={(e) =>
                setCurrentRow({ ...currentRow, rating: e.target.value })
              }
            />
            {/* Menampilkan gambar jika dalam mode detail */}
            {dialogMode === "Detail" && currentRow.images && (
              <Box sx={imageStyle}>
                {currentRow.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Detail ${index}`}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                ))}
              </Box>
            )}
            {/* Menambahkan opsi upload gambar */}
            {dialogMode !== "Detail" && (
              <>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Upload Gambar Produk:
                </Typography>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginTop: "10px" }}
                />
                <Box sx={imageStyle}>
                  {imagePreviews.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index}`}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Produk;
