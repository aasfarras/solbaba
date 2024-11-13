import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
  DialogTitle,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { IconClipboardList, IconEye } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getTransaksi } from "../../service/admin/pesanan.get.service"; // Ganti dengan path yang sesuai
import { useNavigate } from "react-router-dom";
import { updatePesanan } from "../../service/admin/pesanan.update.service"; // Ganti dengan path yang sesuai

const Transaksi = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentTransaksiId, setCurrentTransaksiId] = useState(null); // Definisikan state ini

  // Daftar status transaksi
  const statuses = [
    "received",
    "pending_payment",
    "payment_verified",
    "processing",
    "shipped",
    "completed",
    "canceled",
    "returned",
  ];

  // Fetch data transaksi dari API
  const fetchData = async () => {
    try {
      const result = await getTransaksi();
      const formattedData = result.data.map((item) => [
        item.transaction_code,
        item.customer_name,
        item.customer_address,
        item.total_price,
        item.status,
        item.created_at,
        item.id,
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch transaction data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetail = (rowIndex) => {
    const rowData = data[rowIndex];
    const transaksiId = rowData[6];
    navigate(`/admin/manajemen/transaksi/detailtransaksi/${transaksiId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleOpenStatusDialog = (rowIndex) => {
    const rowData = data[rowIndex];
    setCurrentTransaksiId(rowData[6]); // Simpan ID transaksi saat ini
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSubmitStatus = async () => {
    try {
      // Panggil API untuk mengupdate status transaksi
      await updatePesanan(currentTransaksiId, { status: selectedStatus });
      console.log(
        "Update status transaksi ID:",
        currentTransaksiId,
        "ke status:",
        selectedStatus
      );
      // Refresh data setelah update
      fetchData();
      handleCloseStatusDialog();
    } catch (error) {
      console.error("Failed to update transaction status", error);
    }
  };

  const columns = [
    { name: "transaction_code", label: "Kode Transaksi" },
    { name: "customer_name", label: "Nama Pelanggan" },
    { name: "customer_address", label: "Alamat Pelanggan" },
    {
      name: "total_price",
      label: "Total Harga",
      options: {
        customBodyRender: (value) => formatPrice(value),
      },
    },
    { name: "status", label: "Status" },
    {
      name: "created_at",
      label: "Tanggal Transaksi",
      options: {
        customBodyRender: (value) => {
          const date = new Date(value); // Mengubah string menjadi objek Date
          return new Intl.DateTimeFormat("id-ID", {
            year: "numeric",
            month: "long", // Menggunakan 'long' untuk nama bulan
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(date);
        },
      },
    },
    {
      name: "Actions",
      label: " Aksi",
      options: {
        filter: false,
        sort: false,
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
            <Tooltip title="Status">
              <Button
                onClick={() => handleOpenStatusDialog(tableMeta.rowIndex)}
                sx={{ color: theme.palette.warning.main }}
              >
                <IconClipboardList />
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
        title={<Typography variant="h3">Transaksi</Typography>}
        data={data}
        columns={columns}
        options={{
          selectableRows: "none",
          elevation: 0,
          rowsPerPageOptions: [5, 10, 20, 50],
          textLabels: {
            pagination: {
              rowsPerPage: "Baris per Halaman",
            },
          },
        }}
      />
      <Dialog
        fullWidth
        open={statusDialogOpen}
        onClose={handleCloseStatusDialog}
      >
        <DialogTitle>Pilih Status Transaksi</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog} color="primary">
            Batal
          </Button>
          <Button
            onClick={handleSubmitStatus}
            color="primary"
            disabled={!selectedStatus}
          >
            Kirim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Transaksi;
