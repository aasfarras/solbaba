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
  Box,
  CircularProgress,
} from "@mui/material";
import { IconEdit, IconEye } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getPesanan } from "../../service/admin/pesanan.get.service"; // Ganti dengan path yang sesuai
import { useNavigate } from "react-router-dom";
import { updatePesanan } from "../../service/admin/pesanan.update.service"; // Ganti dengan path yang sesuai
import { getPesananById } from "../../service/admin/pesanan.getSpesifik.service";
import { message } from "antd";

const Pesanan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPesananId, setCurrentPesananId] = useState(null); // Definisikan state ini
  const [errorMessage, setErrorMessage] = useState(""); // State untuk menyimpan pesan kesalahan
  const [errorDialogOpen, setErrorDialogOpen] = useState(false); // State untuk mengontrol modal kesalahan
  const [loading, setLoading] = useState(false); // Add this line

  const statusTranslations = {
    paid: "Menunggu Pembayaran",
    unpaid: "Pembayaran Terverifikasi",
  };

  const statuses = ["paid", "unpaid"];

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getPesanan();
      const formattedData = result.data.map((item) => [
        item.transaction_code,
        item.customer_name,
        item.customer_address,
        item.total_price,
        item.payment_status,
        item.created_at,
        item.id,
      ]);
      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch transaction data", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
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
      await getPesananById(PesananId); // Ganti dengan fungsi yang sesuai untuk mendapatkan detail
      navigate(`/admin/manajemen/pesanan/detailpesanan/${PesananId}`);
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
      message.success("Status telah diubah");
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
      label: "Status Pembayaran",
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
            <Box display="flex" gap={0.25}>
              <Tooltip title="Detail">
                <span>
                  <Button
                    onClick={() => handleDetail(tableMeta.rowIndex)}
                    sx={{ color: theme.palette.info.main }}
                    disabled={status == "paid"} // Disable jika status bukan "Menunggu Pembayaran" atau "Pembayaran Terverifikasi"
                  >
                    <IconEye />
                  </Button>
                </span>
              </Tooltip>
              {/* <Tooltip title="Status">
                <Button
                  onClick={() => handleOpenStatusDialog(tableMeta.rowIndex)}
                  sx={{ color: theme.palette.warning.main }}
                >
                  <IconEdit />
                </Button>
              </Tooltip> */}
            </Box>
          );
        },
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
            title={<Typography variant="h3">Pesanan</Typography>}
            data={data}
            columns={columns}
            options={{
              selectableRows: "none",
              elevation: 0,
              rowsPerPageOptions: [5, 10, 20, 50],
              textLabels: {
                body: {
                  noMatch: "Maaf, tidak ada catatan yang cocok ditemukan", // Ubah pesan di sini
                },
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
                      {statusTranslations[status]}
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
      )}
    </>
  );
};

export default Pesanan;
