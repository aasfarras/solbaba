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
} from "@mui/material";
import { IconEye } from "@tabler/icons-react";
import { useTheme } from "@mui/material/styles";
import { getPesananSales } from "../../service/sales-route/pesanansales.get.service"; // Ganti dengan path yang sesuai
import { useNavigate } from "react-router-dom";
import { getPesananSalesById } from "../../service/sales-route/pesanansales.getSpesifik.service";
import { Box } from "@mui/system";

const Pesanan = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
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

  const fetchData = async () => {
    try {
      const result = await getPesananSales();
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

  const handleDetail = async (rowIndex) => {
    const rowData = data[rowIndex];
    const PesananId = rowData[6];

    try {
      // Panggil fungsi untuk mendapatkan detail pesanan berdasarkan ID
      await getPesananSalesById(PesananId); // Ganti dengan fungsi yang sesuai untuk mendapatkan detail
      navigate(`/sales/menu/pesanan/detailpesanan/${PesananId}`);
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
      label: "Aksi",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
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
    <Box sx={{ pb: 8 }}>
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
    </Box>
  );
};

export default Pesanan;
