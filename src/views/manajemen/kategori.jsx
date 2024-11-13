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
} from "@mui/material";
import { IconPencil, IconTrash, IconUpload } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getKategori } from "../../service/kategori/kategori.get.service";
import { postKategori } from "../../service/kategori/kategori.post.service";
import { deleteKategori } from "../../service/kategori/kategori.delete.service";
import { postKategoriImage } from "../../service/kategori/kategorigambar.post.service";
import { updateKategori } from "../../service/kategori/kategori.update.service";

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
    category_image_url: "",
  });
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // Menyimpan file gambar yang diunggah
  const [activeStep, setActiveStep] = useState(0); // Langkah aktif dalam stepper

  // Fetch data kategori dari API
  const fetchData = async () => {
    try {
      const result = await getKategori();
      const formattedData = result.data.map((item) => [
        item.category_image_url,
        item.category_name,
        item.product_subcategories.length,
        item.id,
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch kategori data", error);
    }
  };

  useEffect(() => {
    fetchData(); // Panggil data kategori setiap kali halaman di-load
  }, []);

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({ category_name: "", category_image_url: "" });
    setImageFile(null); // Reset file gambar
    setActiveStep(0); // Reset langkah ke step pertama
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setFormData({
      category_name: rowData[1], // Ambil nama kategori
      category_image_url: rowData[0], // Ambil url gambar
    });
    setCurrentCategoryId(rowData[3]); // Ambil ID kategori
    setDialogOpenn(true); // Tampilkan dialog untuk editing
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogOpenn(false);
    setActiveStep(0); // Reset stepper saat dialog ditutup
  };

  const handleSave = async () => {
    let imageUrl = formData.category_image_url;
    if (imageFile) {
      const uploadResult = await postKategoriImage(
        currentCategoryId,
        imageFile
      );
      imageUrl = uploadResult.image_url; // Dapatkan URL gambar dari hasil unggahan

      // Refresh data setelah upload gambar berhasil
    }
    if (activeStep === 0) {
      // Langkah pertama
      if (dialogMode === "Create") {
        try {
          // Langkah pertama: postKategori
          const response = await postKategori({
            category_name: formData.category_name,
            category_image_url: "", // Belum ada gambar di langkah pertama
          });

          // Cek respons untuk memastikan ID tersedia
          if (response.data === "success") {
            // Fetch data kategori setelah penambahan
            const categories = await getKategori();
            const newCategory = categories.data.find(
              (cat) => cat.category_name === formData.category_name
            );
            if (newCategory) {
              setCurrentCategoryId(newCategory.id); // Simpan ID kategori baru
              setActiveStep(1); // Pindah ke langkah kedua
            } else {
              console.error("Kategori baru tidak ditemukan");
            }
          }
        } catch (error) {
          console.error("Error creating kategori:", error);
        }
      } else if (dialogMode === "Update") {
        await updateKategori(currentCategoryId, {
          category_name: formData.category_name,
          category_image_url: imageUrl,
        });
        const updatedData = data.map((row, index) =>
          index === currentRowIndex
            ? [imageUrl, formData.category_name, row[2], currentCategoryId]
            : row
        );
        setData(updatedData);
        setDialogOpenn(false);
        fetchData();
      }
    } else if (activeStep === 1) {
      // Langkah kedua
      if (dialogMode === "Create") {
        try {
          if (imageFile) {
            await postKategoriImage(currentCategoryId, imageFile);
          }
          fetchData(); // Refresh data setelah upload gambar
          setDialogOpen(false); // Tutup dialog setelah selesai
        } catch (error) {
          console.error("Error uploading kategori image:", error);
        }
      } else if (dialogMode === "Update") {
        try {
          if (imageFile) {
            await postKategoriImage(currentCategoryId, imageFile);
          }
          await updateKategori(currentCategoryId, {
            category_name: formData.category_name,
            category_image_url: imageUrl,
          });
          const updatedData = data.map((row, index) =>
            index === currentRowIndex
              ? [imageUrl, formData.category_name, row[2], currentCategoryId]
              : row
          );
          setData(updatedData);
          setDialogOpenn(false);
          fetchData();
        } catch (error) {
          console.error("Error updating kategori image:", error);
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
    setCurrentCategoryId(rowData[3]);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteKategori(currentCategoryId);
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
    {
      name: "category_image_url",
      label: "Gambar Kategori",
      options: {
        customBodyRender: (value) => (
          <img src={value} alt="product" style={{ width: 50, height: 50 }} />
        ),
      },
    },
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
            label="Nama Kategori"
            name="category_name"
            fullWidth
            value={formData.category_name}
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
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Tambah Kategori</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>Informasi Kategori</StepLabel>
            </Step>
            <Step>
              <StepLabel>Unggah Gambar</StepLabel>
            </Step>
          </Stepper>
          {activeStep === 0 && (
            <>
              <TextField
                margin="dense"
                label="Nama Kategori"
                name="category_name"
                fullWidth
                value={formData.category_name}
                onChange={handleInputChange}
                sx={{ mt: 3 }}
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
  );
};

export default Kategori;
