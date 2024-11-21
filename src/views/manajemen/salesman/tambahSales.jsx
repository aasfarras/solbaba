import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { message } from "antd";
import MainCard from "../../../ui-component/cards/MainCard";
import { postSalesman } from "../../../service/salesman/salesman.post.service"; // Sesuaikan import sesuai struktur layanan Anda

const TambahSales = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    gender: "male", // Nilai default
    address: "",
    password: "",
    password_confirmation: "",
    referral_code: "",
    phone: "",
  });

  const handleSubmit = async () => {
    // Validasi password
    if (formData.password !== formData.password_confirmation) {
      message.error("Password dan verifikasi password tidak cocok.");
      return;
    }

    try {
      const response = await postSalesman(formData);
      message.success("Salesman berhasil dibuat.");
      navigate(-1); // Kembali setelah berhasil
    } catch (error) {
      console.error("Error creating salesman:", error);
      message.error("Gagal membuat salesman.");
    }
  };

  return (
    <MainCard>
      <div>
        <Typography variant="h3">Tambah Sales</Typography>
        <Grid container columnSpacing={2} rowSpacing={1.5} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Nama Salesman"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} sx={{ mt: 1 }}>
            <TextField
              select
              label="Jenis Kelamin"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              fullWidth
            >
              {[
                { key: "male", value: "Pria" },
                { key: "female", value: "Wanita" },
              ].map((gender) => (
                <MenuItem key={gender.key} value={gender.key}>
                  {gender.value}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Kata Sandi"
              type="password"
              fullWidth
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Verifikasi Kata Sandi"
              type="password"
              fullWidth
              value={formData.password_confirmation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password_confirmation: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="No. Telp"
              fullWidth
              type="number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Kode Referral"
              fullWidth
              value={formData.referral_code}
              onChange={(e) =>
                setFormData({ ...formData, referral_code: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Alamat"
              fullWidth
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ boxShadow: 0, mt: 2 }}
            onClick={handleSubmit}
          >
            Selesai
          </Button>
        </Grid>
      </div>
    </MainCard>
  );
};

export default TambahSales;
