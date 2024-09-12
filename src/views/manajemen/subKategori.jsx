import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Tooltip,
} from "@mui/material";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const SubKategori = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    ["PVC", "5", "Pipa"], // Nama Sub Kategori, Jumlah Produk
    ["PVCC", "3", "Pipa"],
    ["PVCCC", "10", "Pipa"],
    ["Metal", "5", "Genteng"],
    ["Kaca", "7", "Genteng"],
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Read", "Update"
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({
    subKategoriName: "",
    jumlahProduk: "",
    Kategori: "",
  });

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({ subKategoriName: "", jumlahProduk: "" });
    setDialogOpen(true);
  };

  const handleRead = (rowIndex) => {
    setDialogMode("Read");
    setCurrentRow(data[rowIndex]);
    setFormData({
      subKategoriName: data[rowIndex][0],
      jumlahProduk: data[rowIndex][1],
      jumlahProduk: data[rowIndex][2],
    });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRow(data[rowIndex]);
    setFormData({
      subKategoriName: data[rowIndex][0],
      jumlahProduk: data[rowIndex][1],
      jumlahProduk: data[rowIndex][2],
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
        [formData.subKategoriName, formData.jumlahProduk, formData.Kategori],
      ];
      setData(newData);
    } else if (dialogMode === "Update") {
      const newData = data.map((row, index) =>
        index === data.indexOf(currentRow)
          ? [formData.subKategoriName, formData.jumlahProduk, formData.Kategori]
          : row
      );
      setData(newData);
    }
    setDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const columns = [
    { name: "Nama sub Kategori", label: "Nama sub Kategori" },
    { name: "Jumlah Produk", label: "Jumlah Produk" },
    { name: "Kategori", label: "Kategori" },
    {
      name: "Actions",
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => {
          return (
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
        search={false}
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
            label="Nama sub Kategori"
            name="subKategoriName"
            fullWidth
            value={formData.subKategoriName}
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
          <TextField
            margin="dense"
            label="Kategori"
            name="Kategori"
            fullWidth
            value={formData.Kategori}
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

export default SubKategori;
