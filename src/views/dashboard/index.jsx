import { useEffect, useState } from "react";

// material-ui
import Grid from "@mui/material/Grid";

// project imports
import EarningCard from "./EarningCard";
import PopularCard from "./PopularCard";
import TotalOrderLineChartCard from "./TotalOrderLineChartCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import TotalIncomeLightCard from "./TotalIncomeLightCard";
import TotalGrowthBarChart from "./TotalGrowthBarChart"; // Import the new chart component

import { gridSpacing } from "../../store/constant";

// assets
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";

// Fungsi untuk memformat angka menjadi format rupiah tanpa "K" dan simbol dolar
const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "")
    .trim(); // Menghilangkan simbol IDR
};

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const currencyRate = 14000; // Nilai tukar rupiah

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            {/* Menambahkan konversi dari dolar ke rupiah */}
            <EarningCard isLoading={isLoading} currencyRate={currencyRate} />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                {/* Menambahkan total dalam format rupiah tanpa simbol */}
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: formatRupiah(202 * currencyRate), // Mengubah total menjadi format rupiah tanpa simbol
                    label: "Jumlah Pemasukan",
                    icon: <StorefrontTwoToneIcon fontSize="inherit" />, // Ikon tetap
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} /> {/* Bar chart baru */}
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
