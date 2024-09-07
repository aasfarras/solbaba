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
  Box,
} from "@mui/material";
import { IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const Transaksi = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    {
      kode: "1",
      namaProduk: "Produk A",
      namaCustomer: "Budi",
      jumlahBeli: "2",
      transaksi: "200000",
      images: ["https://via.placeholder.com/150"],
    },
    {
      kode: "2",
      namaProduk: "Produk B",
      namaCustomer: "Andi",
      jumlahBeli: "1",
      transaksi: "150000",
      images: ["https://via.placeholder.com/150"],
    },
    // Produk lainnya
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Read", "Update"
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    city: "",
    state: "",
  });

  const handleRead = (rowIndex) => {
    setDialogMode("Read");
    setCurrentRowIndex(rowIndex);
    const rowData = data[rowIndex];
    setFormData({
      name: rowData.namaProduk,
      company: rowData.namaCustomer,
      city: rowData.jumlahBeli,
      state: rowData.transaksi,
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    const updatedData = [...data];
    if (dialogMode === "Create") {
      updatedData.push({
        kode: (data.length + 1).toString(),
        namaProduk: formData.name,
        namaCustomer: formData.company,
        jumlahBeli: formData.city,
        transaksi: formData.state,
        images: [], // Gambar tidak diubah di mode Create
      });
    } else if (dialogMode === "Update") {
      updatedData[currentRowIndex] = {
        ...updatedData[currentRowIndex],
        namaProduk: formData.name,
        namaCustomer: formData.company,
        jumlahBeli: formData.city,
        transaksi: formData.state,
      };
    }
    setData(updatedData);
    setDialogOpen(false);
  };

  const columns = [
    {
      name: "images",
      label: "Foto Produk",
      options: {
        customBodyRender: (value, tableMeta) => (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {data[tableMeta.rowIndex].images.length > 0 && (
              <img
                src={data[tableMeta.rowIndex].images[0]}
                alt="Foto Produk"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            )}
          </Box>
        ),
      },
    },
    { name: "kode", label: "Kode Produk" },
    { name: "namaProduk", label: "Nama Produk" },
    { name: "namaCustomer", label: "Nama Customer" },
    { name: "jumlahBeli", label: "Jumlah beli" },
    { name: "transaksi", label: "Transaksi" },
    {
      name: "Actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Tooltip title="Read">
              <Button
                onClick={() => handleRead(tableMeta.rowIndex)}
                sx={{ color: theme.palette.success.dark }}
              >
                <IconEye />
              </Button>
            </Tooltip>
          </div>
        ),
      },
    },
  ];

  return (
    <div>
      <MUIDataTable
        title={
          <Typography variant="h3" sx={{ fontWeight: 500 }}>
            Transaksi
          </Typography>
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
            label="Nama Produk"
            name="name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Nama Customer"
            name="company"
            fullWidth
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Jumlah Beli"
            name="city"
            fullWidth
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            disabled={dialogMode === "Read"}
          />
          <TextField
            margin="dense"
            label="Transaksi"
            name="state"
            fullWidth
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            disabled={dialogMode === "Read"}
          />
          {/* Menampilkan gambar jika dalam mode Read */}
          {dialogMode === "Read" && data[currentRowIndex].images.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <img
                src={data[currentRowIndex].images[0]}
                alt="Detail"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
            </Box>
          )}
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
    </div>
  );
};

export default Transaksi;
