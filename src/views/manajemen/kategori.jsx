import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const Kategori = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    ["Pipa", "3", "18"], // Pipa memiliki 3 subkategori dan 18 produk
    ["Genteng", "2", "12"], // Genteng memiliki 2 subkategori dan 12 produk
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Read", "Update"
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    jumlahSubKategori: "",
    jumlahProduk: "",
  });

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({ name: "", jumlahSubKategori: "", jumlahProduk: "" });
    setDialogOpen(true);
  };

  const handleRead = (rowIndex) => {
    setDialogMode("Read");
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setFormData({
      name: rowData[0],
      jumlahSubKategori: rowData[1],
      jumlahProduk: rowData[2],
    });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setFormData({
      name: rowData[0],
      jumlahSubKategori: rowData[1],
      jumlahProduk: rowData[2],
    });
    setDialogOpen(true);
  };

  const handleDelete = (rowIndex) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    setData(newData);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    if (dialogMode === "Create") {
      const newData = [
        ...data,
        [formData.name, formData.jumlahSubKategori, formData.jumlahProduk],
      ];
      setData(newData);
    } else if (dialogMode === "Update") {
      const updatedData = data.map((row, index) =>
        index === currentRowIndex
          ? [formData.name, formData.jumlahSubKategori, formData.jumlahProduk]
          : row
      );
      setData(updatedData);
    }
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    { name: "Nama Kategori", label: "Nama Kategori" },
    { name: "Jumlah Sub Kategori", label: "Jumlah Sub Kategori" },
    { name: "Jumlah Produk", label: "Jumlah Produk" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Tooltip title="edit">
                <Button
                  onClick={() => handleUpdate(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.warning.main }}
                >
                  <IconPencil />
                </Button>
              </Tooltip>
              <Tooltip title="delete">
                <Button
                  onClick={() => handleDelete(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.error.main }}
                >
                  <IconTrash />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    },
  ];

  return (
    <>
      <MUIDataTable
        title={
          <Button onClick={handleCreate} variant="contained">
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
          <TextField
            margin="dense"
            label="Nama"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Jumlah Sub Kategori"
            name="jumlahSubKategori"
            fullWidth
            value={formData.jumlahSubKategori}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Jumlah Produk"
            name="jumlahProduk"
            fullWidth
            value={formData.jumlahProduk}
            onChange={handleInputChange}
            disabled={dialogMode === "Read"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {dialogMode !== "Read" && (
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Kategori;
