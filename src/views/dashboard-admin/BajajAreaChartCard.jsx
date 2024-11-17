import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

// third-party
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";

// project imports
import chartData from "./chart-data/bajaj-area-chart";
import { getSummary } from "../../service/dashboard-admin/summary.get.service"; // Sesuaikan dengan path yang benar

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

const BajajAreaChartCard = () => {
  const theme = useTheme();
  const orangeDark = theme.palette.secondary[800];

  const customization = useSelector((state) => state.customization);
  const { navType } = customization;

  const [transactionCount, setTransactionCount] = useState(0); // State untuk menyimpan transaction_count

  // Fetch data from API
  const fetchSummaryData = async () => {
    try {
      const result = await getSummary(); // Mengambil data dari API
      if (result.code === 200) {
        setTransactionCount(result.data.transaction_count); // Menyimpan transaction_count
      }
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  useEffect(() => {
    fetchSummaryData(); // Panggil fungsi fetchSummaryData saat komponen dimuat
  }, []);

  useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: "light" },
    };
    ApexCharts.exec(`support-chart`, "updateOptions", newSupportChart);
  }, [navType, orangeDark]);

  return (
    <Card sx={{ bgcolor: "secondary.light" }}>
      <Grid container sx={{ p: 2, pb: 0, color: "#fff" }}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="subtitle1" sx={{ color: "secondary.dark" }}>
                Jumlah
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" sx={{ color: "grey.800" }}>
                Rp {new Intl.NumberFormat("id-ID").format(transactionCount)}{" "}
                {/* Menampilkan transaction_count */}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
};

export default BajajAreaChartCard;
