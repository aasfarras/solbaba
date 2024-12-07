import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTransaksiAdminById } from "../../service/admin/transaksi.detail.service"; // Import the new service
import { updateDonePesanan } from "../../service/admin/pesanan.doneUpdate.service"; // Ganti dengan path yang sesuai
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
} from "@mui/material";
import MainCard from "../../ui-component/cards/MainCard";
import { Image, message } from "antd";

const DetailTransaksi = () => {
  const { id } = useParams(); // Get the transaction ID from the URL
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactionDetails = async () => {
    setLoading(true);
    try {
      const data = await getTransaksiAdminById(id); // Use the service to fetch transaction details
      setTransaction(data);
    } catch (error) {
      setError("Failed to fetch transaction details");
    } finally {
      setLoading(false);
    }
  };

  const statusTranslations = {
    received: "Diterima",
    pending_payment: "Menunggu Pembayaran",
    payment_verified: "Pembayaran Terverifikasi",
    processing: "Sedang Diproses",
    shipped: "Dikirim",
    completed: "Selesai",
    canceled: "Dibatalkan",
    returned: "Dikembalikan",
    ready_for_pickup: "Siap di Ambil",
    picked_up: "Telah di Ambil",
  };

  const statusPaymentTranslations = {
    paid: "Menunggu Pembayaran",
    unpaid: "Pembayaran Terverifikasi",
  };

  const pickupMethodTranslations = {
    home_delivery: "Di Antarkan",
    self_pickup: "Ambil di Tempat",
  };

  const handleSave = async () => {
    try {
      await updateDonePesanan(id); // Panggil fungsi untuk mengupdate status pesanan
      message.success("Pesanan Berhasil Diperbarui");
      // Anda bisa menambahkan logika lain di sini, seperti navigasi atau refresh data
      navigate(-1);
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Gagal memperbarui pesanan."); // Tampilkan pesan error
    }
  };

  useEffect(() => {
    fetchTransactionDetails(); // Fetch transaction details
  }, [id]);

  if (error)
    return (
      <Typography variant="h6" color="error">
        {error}
      </Typography>
    );

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
        <MainCard title="Detail Transaksi">
          <Box>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Tanggal Pesanan</TableCell>
                    <TableCell>
                      {new Date(transaction.data.created_at).toLocaleString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        }
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kode Pesanan</TableCell>
                    <TableCell>{transaction.data.transaction_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nama Produk</TableCell>
                    <TableCell>{transaction.data.product_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Varian Produk</TableCell>
                    <TableCell>{transaction.data.product_variant}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Produk Kategori</TableCell>
                    <TableCell>{transaction.data.product_category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Produk Subkategori</TableCell>
                    <TableCell>
                      {transaction.data.product_subcategory}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nama Pelanggan</TableCell>
                    <TableCell>{transaction.data.customer_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>No Telp</TableCell>
                    <TableCell>{transaction.data.customer_phone}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Alamat Pelanggan</TableCell>
                    <TableCell>{transaction.data.customer_address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status Pengiriman</TableCell>
                    <TableCell>
                      {statusTranslations[transaction.data.status] ||
                        transaction.data.status}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status Pembayaran</TableCell>
                    <TableCell>
                      {statusPaymentTranslations[
                        transaction.data.payment_status
                      ] || transaction.data.payment_status}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Metode Pengambilan</TableCell>
                    <TableCell>
                      {pickupMethodTranslations[
                        transaction.data.pickup_method
                      ] || transaction.data.pickup_method}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Kode Referral</TableCell>
                    <TableCell>{transaction.data.referral_code}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nama Bank</TableCell>
                    <TableCell>{transaction.data.bank_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Nomor Akun</TableCell>
                    <TableCell>{transaction.data.account_number}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Grid
              container
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ mt: 2 }}
            >
              <Grid item>
                <Button variant="contained" onClick={() => navigate(-1)}>
                  Kembali
                </Button>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

export default DetailTransaksi;
