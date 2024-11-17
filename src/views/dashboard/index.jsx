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

// Import service
import { getSummary } from "../../service/dashboard/summary.get.service"; // Sesuaikan dengan path yang benar

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [transactionCount, setTransactionCount] = useState(0); // State untuk menyimpan jumlah transaksi
  const currencyRate = 14000; // Nilai tukar rupiah

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSummary(); // Mengambil data dari API
        if (result.code === 200) {
          setTransactionCount(result.data.transaction_count); // Menyimpan jumlah transaksi
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
      } finally {
        setLoading(false); // Set loading ke false setelah fetch selesai
      }
    };

    fetchData(); // Panggil fungsi fetchData saat komponen dimuat
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
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
                {/* Menampilkan total transaksi */}
                <TotalIncomeLightCard
                  {...{
                    isLoading: isLoading,
                    total: transactionCount, // Menggunakan jumlah transaksi dari API
                    label: "Total Transaksi", // Mengubah label menjadi Total Transaksi
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
