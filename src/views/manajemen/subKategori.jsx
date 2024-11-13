import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
  MenuItem,
  DialogTitle,
} from "@mui/material";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getSubKategori } from "../../service/subKategori/subKategori.get.service";
import { getKategori } from "../../service/kategori/kategori.get.service";
import { postSubKategori } from "../../service/subKategori/subKategori.post.service";
import { updateSubKategori } from "../../service/subKategori/subKategori.update.service"; // Import service update
import { deleteSubKategori } from "../../service/subKategori/subKategori.delete.service";

const SubKategori = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subKategoriName: "",
    categoryId: "",
  });
  const [selectedSubKategoriId, setSelectedSubKategoriId] = useState(null); // To store the selected sub kategori ID
  const [currentRowIndex, setCurrentRowIndex] = useState(null); // Missing state to track the row index for deletion
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  const fetchData = async () => {
    try {
      const response = await getSubKategori();
      const formattedData = response.data.map((subcat) => ({
        id: subcat.id,
        subcategory_name: subcat.subcategory_name,
        category_name: subcat.category_name,
        category_id: subcat.category_id,
      }));
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching subkategori:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getKategori();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({ subKategoriName: "", categoryId: "" });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    const selectedData = data[rowIndex];
    setSelectedSubKategoriId(selectedData.id); // Menyimpan ID sub kategori yang dipilih
    setFormData({
      subKategoriName: selectedData.subcategory_name,
      categoryId: selectedData.category_id,
    });
    setDialogMode("Update");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (dialogMode === "Create") {
      try {
        const newSubCategory = {
          subcategory_name: formData.subKategoriName,
          category_id: formData.categoryId,
        };
        await postSubKategori(newSubCategory);
        fetchData();
      } catch (error) {
        console.error("Error creating subkategori:", error);
      }
    } else if (dialogMode === "Update") {
      try {
        const updatedSubCategory = {
          subcategory_name: formData.subKategoriName,
          category_id: formData.categoryId,
        };
        await updateSubKategori(selectedSubKategoriId, updatedSubCategory); // Update dengan ID dan data baru
        fetchData();
      } catch (error) {
        console.error("Error updating subkategori:", error);
      }
    }
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // src/service/subKategori/subKategori.delete.service.js
  const handleDeleteClick = (rowIndex) => {
    setCurrentRowIndex(rowIndex); // Correctly store the row index
    const rowData = data[rowIndex];
    setCurrentCategoryId(rowData.id); // Ensure you're setting the category ID from the correct data field
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteSubKategori(currentCategoryId); // Use the correct ID for deletion
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
    { name: "subcategory_name", label: "Nama Sub Kategori" },
    { name: "category_name", label: "Kategori" },
    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
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
            <Tooltip title="Hapus">
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
            Tambah Sub Kategori
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogContent sx={{ minWidth: "400px" }}>
          <TextField
            label="Nama Sub Kategori"
            name="subKategoriName"
            value={formData.subKategoriName}
            onChange={handleInputChange}
            sx={{ mb: "10px" }}
            fullWidth
          />
          <TextField
            select
            label="Kategori"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.category_name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle variant="h5">Hapus Sub Kategori</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus sub kategori ini?
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

export default SubKategori;
