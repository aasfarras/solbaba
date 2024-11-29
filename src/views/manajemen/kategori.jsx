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
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../service/kategori/kategori.get.service";
import { postKategori } from "../../service/kategori/kategori.post.service";
import { deleteKategori } from "../../service/kategori/kategori.delete.service";
import { updateKategori } from "../../service/kategori/kategori.update.service";
import { message } from "antd"; // Import message from antd

const Kategori = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenn, setDialogOpenn] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create" or "Update"
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    category_name: "",
  });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [loading, setLoading] = useState(false); // Add this line

  // Fetch data kategori dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getKategori();
      const formattedData = result.data.map((item) => [
        item.category_name, // Only include category name
        item.product_subcategories.length, // Count of subcategories
        item.id, // Keep ID for actions
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch kategori data", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData(); // Panggil data kategori setiap kali halaman di-load
  }, []);

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({ category_name: "" });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setFormData({
      category_name: rowData[0], // Ambil nama kategori
    });
    setCurrentCategoryId(rowData[2]); // Ambil ID kategori
    setDialogOpenn(true); // Tampilkan dialog untuk editing
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogOpenn(false);
  };

  const handleSave = async () => {
    if (dialogMode === "Create") {
      try {
        await postKategori({
          category_name: formData.category_name,
        });
        message.success("Kategori berhasil ditambahkan!");
        fetchData(); // Refresh data setelah penambahan
        setDialogOpen(false); // Tutup dialog setelah selesai
      } catch (error) {
        console.error("Error creating kategori:", error);
      }
    } else if (dialogMode === "Update") {
      await updateKategori(currentCategoryId, {
        category_name: formData.category_name,
      });
      message.success("Kategori berhasil diperbarui!");
      const updatedData = data.map((row, index) =>
        index === currentRowIndex
          ? [formData.category_name, row[1], currentCategoryId]
          : row
      );
      setData(updatedData);
      setDialogOpenn(false);
      fetchData();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDeleteClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setCurrentCategoryId(rowData[2]);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteKategori(currentCategoryId);
      message.success("Kategori berhasil dihapus!");
      const updatedData = data.filter((_, index) => index !== currentRowIndex);
      setData(updatedData);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting kategori:", error);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const columns = [
    { name: "Nama Kategori", label: "Nama Kategori" },
    { name: "Jumlah Sub Kategori", label: "Jumlah Sub Kategori" },
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
                body: {
                  noMatch: "Maaf, tidak ada catatan yang cocok ditemukan",
                },
                pagination: {
                  rowsPerPage: "Baris per Halaman",
                },
              },
            }}
          />

          <Dialog open={dialogOpenn} onClose={handleDialogClose}>
            <DialogTitle variant="h5">Edit Kategori</DialogTitle>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    label="Nama Kategori"
                    name="category_name"
                    fullWidth
                    sx={{ width: 300 }}
                    value={formData.category_name}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
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
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Nama Kategori"
                name="category_name"
                fullWidth
                value={formData.category_name}
                onChange={handleInputChange}
              />
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

          <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
            <DialogTitle variant="h5">Hapus Kategori</DialogTitle>
            <DialogContent>
              Apakah Anda yakin ingin menghapus kategori ini?
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

export default Kategori;
