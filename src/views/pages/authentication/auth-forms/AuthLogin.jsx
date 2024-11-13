import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import AnimateButton from "../../../../ui-component/extended/AnimateButton";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ============================|| AUTH - LOGIN ||============================ //

const AuthLogin = ({ ...others }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(""); // State untuk error login
  const navigate = useNavigate();

  // Menangani toggle visibilitas password
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Fungsi login menggunakan API yang diambil dari .env
  const handleLogin = async (values, setSubmitting) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API}login`, // Mengambil URL dari .env
        {
          username: values.username,
          password: values.password,
        }
      );

      if (response.data.code === 200) {
        // Simpan token di localStorage atau context
        sessionStorage.setItem("token", response.data.data.access_token);

        // Cek role dari respons API
        const userRole = response.data.data.user.role;

        // Redirect berdasarkan role
        if (userRole === "superadmin") {
          navigate("/super-admin");
        } else if (userRole === "admin") {
          navigate("/admin");
        } else if (userRole === "salesman") {
          navigate("/sales");
        } else {
          setLoginError("Role tidak dikenal");
        }
      } else {
        // Menampilkan pesan error jika login gagal
        setLoginError("Nama Pengguna atau Kata Sandi salah");
      }
    } catch (error) {
      console.error("Gagal Masuk:", error);
      setLoginError("Gagal Masuk. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item container alignItems="center" justifyContent="center">
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              Masuk dengan Nama Pengguna
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Formik
        initialValues={{
          username: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required("Nama Pengguna Di Perlukan"),
          password: Yup.string().max(255).required("Kata Sandi Di Perlukan"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleLogin(values, setSubmitting);
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.username && errors.username)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-username-login">
                Nama Pengguna
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-username-login"
                type="text"
                value={values.username}
                name="username"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Username"
              />
              {touched.username && errors.username && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-username-login"
                >
                  {errors.username}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Kata Sandi
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            {loginError && (
              <Box sx={{ mt: 2 }}>
                <FormHelperText error>{loginError}</FormHelperText>
              </Box>
            )}
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                >
                  Masuk
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
