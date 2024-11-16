import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, TextField, Grid, MenuItem } from "@mui/material";
import { message } from "antd";
import MainCard from "../../../ui-component/cards/MainCard";
import { getSalesmanById } from "../../../service/salesman/salesman.getSpesifik.service"; // Service untuk mendapatkan data salesman
import { updateSalesman } from "../../../service/salesman/salesman.update.service"; // Service untuk memperbarui data salesman

const EditSales = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Mendapatkan ID salesman dari URL
  const [formData, setFormData] = useState({
    name: "",
    gender: "male", // Nilai default
    address: "",
  });

  const fetchSalesmanData = async () => {
    try {
      const response = await getSalesmanById(id);
      const salesman = response.data;
      setFormData({
        name: salesman.name,
        gender: salesman.gender,
        address: salesman.address,
      });
    } catch (error) {
      console.error("Error fetching salesman data:", error);
    }
  };

  const handleUpdateSalesman = async () => {
    try {
      await updateSalesman(id, formData);
      message.success("Informasi Salesman telah diperbarui.");
      navigate("/super-admin/manajemen/sales"); // Redirect setelah update
    } catch (error) {
      console.error("Error updating salesman:", error);
      message.error("Gagal memperbarui informasi Salesman.");
    }
  };

  useEffect(() => {
    fetchSalesmanData();
  }, [id]); // Ensure to fetch data when the ID changes

  return (
    <MainCard title="Edit Salesman">
      <div>
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
              select
              label="Jenis Kelamin"
              value={formData.gender}
              sx={{ mt: 1 }}
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
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mt: 2 }}
        >
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button variant="contained" onClick={handleUpdateSalesman}>
            Simpan
          </Button>
        </Grid>
      </div>
    </MainCard>
  );
};

export default EditSales;
