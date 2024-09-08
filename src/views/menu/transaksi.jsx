import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import { useTheme } from "@mui/material/styles";

const Transaksi = () => {
  const theme = useTheme();
  const [data, setData] = useState([
    ["27/08/24", "Pipa", "20", "Rp.200.000", "dzaky", "sudah", "dikirim"],
    ["21/04/24", "genteng", "3", "Rp.250.000", "irfan", "belum", "dikemas"],
  ]);

  const columns = [
    { name: "Tanggal Pemesanan", label: "Tanggal Pemesanan" },
    { name: "Nama Barang", label: "Nama Barang" },
    { name: "Jumlah Barang", label: "Jumlah Barang" },
    { name: "Total Bayar", label: "Total Bayar" },
    { name: "Nama Customer", label: "Nama Customer" },
    { name: "Status Bayar", label: "Status Bayar" },
    { name: "Status Pengiriman", label: "Status Pengiriman" },
  ];

  return (
    <>
      <MUIDataTable
        title="Transaksi"
        data={data}
        columns={columns}
        options={{
          selectableRows: "none",
          elevation: 0,
          rowsPerPage: 10,
          rowsPerPageOptions: [5, 10, 20, 50, 100],
        }}
      />
    </>
  );
};

export default Transaksi;
