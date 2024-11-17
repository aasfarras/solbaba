import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

// material-ui
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

// project imports
import BajajAreaChartCard from "./BajajAreaChartCard";
import MainCard from "../../ui-component/cards/MainCard";
import SkeletonPopularCard from "../../ui-component/cards/Skeleton/PopularCard";
import { gridSpacing } from "../../store/constant";
import { useNavigate } from "react-router-dom";

// assets
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

// Import service
import { getPopularity } from "../../service/dashboard/popularity.get.service"; // Sesuaikan dengan path yang benar

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popularProducts, setPopularProducts] = useState([]); // State untuk menyimpan produk terlaris

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAll = () => {
    navigate("/super-admin/manajemen/produk");
  };

  // Fetch data from API
  const fetchPopularityData = async () => {
    try {
      const result = await getPopularity(); // Mengambil data dari API
      if (result.code === 200) {
        setPopularProducts(result.data.products); // Menyimpan produk terlaris
      }
    } catch (error) {
      console.error("Error fetching popularity data:", error);
    }
  };

  useEffect(() => {
    fetchPopularityData(); // Panggil fungsi fetchPopularityData saat komponen dimuat
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={gridSpacing} sx={{ mb: 9 }}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Grid item>
                    <Typography variant="h4">Produk Terlaris</Typography>
                  </Grid>
                  {/* <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: "primary.200",
                        cursor: "pointer",
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    />
                    <Menu
                      id="menu-popular-card"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      variant="selectedMenu"
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <MenuItem onClick={handleClose}> Today</MenuItem>
                      <MenuItem onClick={handleClose}> This Month</MenuItem>
                      <MenuItem onClick={handleClose}> This Year </MenuItem>
                    </Menu>
                  </Grid> */}
                </Grid>
              </Grid>
              {/* <Grid item xs={12} sx={{ pt: "16px !important" }}>
                <BajajAreaChartCard />
              </Grid> */}
              <Grid item xs={12}>
                <Grid container direction="column">
                  {popularProducts.map((product) => (
                    <React.Fragment key={product.product_id}>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {product.product_name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Grid item>
                                <Typography variant="subtitle1" color="inherit">
                                  {product.product_count}
                                </Typography>
                              </Grid>
                              {/* <Grid item>
                                <Avatar
                                  variant="rounded"
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "5px",
                                    bgcolor:
                                      product.product_count > 0
                                        ? "success.light"
                                        : "orange.light",
                                    color:
                                      product.product_count > 0
                                        ? "success.dark"
                                        : "orange.dark",
                                    ml: 2,
                                  }}
                                >
                                  {product.product_count > 0 ? (
                                    <KeyboardArrowUpOutlinedIcon
                                      fontSize="small"
                                      color="inherit"
                                    />
                                  ) : (
                                    <KeyboardArrowDownOutlinedIcon
                                      fontSize="small"
                                      color="inherit"
                                    />
                                  )}
                                </Avatar>
                              </Grid> */}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Divider sx={{ my: 1.5 }} />
                    </React.Fragment>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button
              fullWidth
              variant="contained"
              endIcon={<ChevronRightOutlinedIcon />}
              onClick={handleViewAll}
            >
              Lihat Semua
            </Button>
          </CardActions>
        </MainCard>
      )}
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default PopularCard;
