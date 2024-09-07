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
  IconButton,
} from "@mui/material";
import { IconEye, IconPencil, IconBrandWhatsapp } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";

const Pesanan = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    ["2024-09-01", "Laptop ASUS", 2, 20000000, "Agus", "Lunas", "Dikirim"],
    [
      "2024-09-02",
      "Smartphone Samsung",
      1,
      10000000,
      "Budi",
      "Belum Lunas",
      "Pending",
    ],
    ["2024-09-03", "Headset Sony", 3, 1500000, "Citra", "Lunas", "Selesai"],
    [
      "2024-09-04",
      "Kamera Canon",
      1,
      5000000,
      "Dewi",
      "Belum Lunas",
      "Dibatalkan",
    ],
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // "Create", "Detail", "Update"
  const [currentRow, setCurrentRow] = useState(null);
  const [formData, setFormData] = useState({
    tanggalPemesanan: "",
    namaBarang: "",
    jumlahBarang: "",
    totalBayar: "",
    namaCustomer: "",
    statusBayar: "",
    statusPesanan: "",
  });

  const handleCreate = () => {
    setDialogMode("Create");
    setFormData({
      tanggalPemesanan: "",
      namaBarang: "",
      jumlahBarang: "",
      totalBayar: "",
      namaCustomer: "",
      statusBayar: "",
      statusPesanan: "",
    });
    setDialogOpen(true);
  };

  const handleRead = (rowIndex) => {
    setDialogMode("Detail");
    setCurrentRow(data[rowIndex]);
    setFormData({
      tanggalPemesanan: data[rowIndex][0],
      namaBarang: data[rowIndex][1],
      jumlahBarang: data[rowIndex][2],
      totalBayar: data[rowIndex][3],
      namaCustomer: data[rowIndex][4],
      statusBayar: data[rowIndex][5],
      statusPesanan: data[rowIndex][6],
    });
    setDialogOpen(true);
  };

  const handleUpdate = (rowIndex) => {
    setDialogMode("Update");
    setCurrentRow(data[rowIndex]);
    setFormData({
      tanggalPemesanan: data[rowIndex][0],
      namaBarang: data[rowIndex][1],
      jumlahBarang: data[rowIndex][2],
      totalBayar: data[rowIndex][3],
      namaCustomer: data[rowIndex][4],
      statusBayar: data[rowIndex][5],
      statusPesanan: data[rowIndex][6],
    });
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    if (dialogMode === "Create") {
      const newData = [
        ...data,
        [
          formData.tanggalPemesanan,
          formData.namaBarang,
          formData.jumlahBarang,
          formData.totalBayar,
          formData.namaCustomer,
          formData.statusBayar,
          formData.statusPesanan,
        ],
      ];
      setData(newData);
    } else if (dialogMode === "Update") {
      const newData = data.map((row, index) =>
        index === data.indexOf(currentRow)
          ? [
              formData.tanggalPemesanan,
              formData.namaBarang,
              formData.jumlahBarang,
              formData.totalBayar,
              formData.namaCustomer,
              formData.statusBayar,
              formData.statusPesanan,
            ]
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

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/6285341614066", "_blank");
  };

  const columns = [
    { name: "Tanggal Pemesanan", label: "Tanggal Pemesanan" },
    { name: "Nama Barang", label: "Nama Barang" },
    { name: "Jumlah Barang", label: "Jumlah Barang" },
    { name: "Total Bayar", label: "Total Bayar" },
    { name: "Nama Customer", label: "Nama Customer" },
    { name: "Status Bayar", label: "Status Bayar" },
    { name: "Status Pesanan", label: "Status Pesanan" },
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
              <Tooltip title="Detail">
                <Button
                  onClick={() => handleRead(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.primary.main }}
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
              <Tooltip title="Hubungi via WhatsApp">
                <Button
                  onClick={handleWhatsAppClick}
                  sx={{ color: theme.palette.success.dark }}
                >
                  <IconBrandWhatsapp />
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
        title={<Typography variant="h4">Manajemen Pesanan</Typography>}
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
            label="Tanggal Pemesanan"
            name="tanggalPemesanan"
            fullWidth
            value={formData.tanggalPemesanan}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Nama Barang"
            name="namaBarang"
            fullWidth
            value={formData.namaBarang}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Jumlah Barang"
            name="jumlahBarang"
            fullWidth
            value={formData.jumlahBarang}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Total Bayar"
            name="totalBayar"
            fullWidth
            value={formData.totalBayar}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Nama Customer"
            name="namaCustomer"
            fullWidth
            value={formData.namaCustomer}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Status Bayar"
            name="statusBayar"
            fullWidth
            value={formData.statusBayar}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
          <TextField
            margin="dense"
            label="Status Pesanan"
            name="statusPesanan"
            fullWidth
            value={formData.statusPesanan}
            onChange={handleInputChange}
            disabled={dialogMode === "Detail"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Batal</Button>
          {dialogMode !== "Detail" && (
            <Button onClick={handleSave} color="primary">
              Simpan
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pesanan;
