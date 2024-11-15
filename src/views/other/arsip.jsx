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
import { getArsip } from "../../service/Arsip/arsip.get.service"; // Ganti dengan path yang sesuai
import { useNavigate } from "react-router-dom";
import { updatePesanan } from "../../service/admin/pesanan.update.service"; // Ganti dengan path yang sesuai
import { getArsipById } from "../../service/Arsip/arsip.detail.service";

const Pesanan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPesananId, setCurrentPesananId] = useState(null); // Definisikan state ini
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan pesan kesalahan
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // State untuk mengontrol modal kesalahan

  const statusTranslations = {
    received: "Diterima",
    pending_payment: "Menunggu Pembayaran",
    payment_verified: "Pembayaran Terverifikasi",
    processing: "Sedang Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    canceled: "Dibatalkan",
    returned: "Dikembalikan",
  };

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

  const fetchData = async () => {
    try {
      const result = await getArsip();
      const formattedData = result.data.data.map((item) => [
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

  const handleDetail = async (rowIndex) => {
    const rowData = data[rowIndex];
    const PesananId = rowData[6];

    try {
      // Panggil fungsi untuk mendapatkan detail pesanan berdasarkan ID
      await getArsipById(PesananId); // Ganti dengan fungsi yang sesuai untuk mendapatkan detail
      navigate(`/super-admin/other/arsip/detailArsip/${PesananId}`);
    } catch (error) {
      // Tangkap kesalahan dan simpan pesan kesalahan
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // Ambil pesan dari respons kesalahan
      } else {
        setErrorMessage("Terjadi kesalahan saat mengambil detail pesanan.");
      }
      setErrorDialogOpen(true); // Buka modal kesalahan
    }
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
    setCurrentPesananId(rowData[6]);
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
      await updatePesanan(currentPesananId, { status: selectedStatus });
      console.log(
        "Update status Pesanan ID:",
        currentPesananId,
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
    { name: "transaction_code", label: "Kode Pesanan" },
    { name: "customer_name", label: "Nama Pelanggan" },
    { name: "customer_address", label: "Alamat Pelanggan" },
    {
      name: "total_price",
      label: "Total Harga",
      options: {
        customBodyRender: (value) => formatPrice(value),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) => {
          return statusTranslations[value] || value; // Menggunakan pemetaan untuk menampilkan status dalam bahasa Indonesia
        },
      },
    },
    {
      name: "created_at",
      label: "Tanggal Pesanan",
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
        customBodyRender: (value, tableMeta) => {
          const rowData = data[tableMeta.rowIndex];
          const status = rowData[4]; // Ambil status dari data

          return (
            <>
              <Tooltip title="Detail">
                <span>
                  <Button
                    onClick={() => handleDetail(tableMeta.rowIndex)}
                    sx={{ color: theme.palette.info.main }}
                  >
                    <IconEye />
                  </Button>
                </span>
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
        title={<Typography variant="h3">Pesanan</Typography>}
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
        <DialogTitle>Pilih Status Pesanan</DialogTitle>
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
                  {statusTranslations[status]}{" "}
                  {/* Menggunakan pemetaan untuk menampilkan status dalam bahasa Indonesia */}
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
      <Dialog
        fullWidth
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
      >
        <DialogTitle>Kesalahan</DialogTitle>
        <DialogContent>
          <Typography>{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pesanan;
