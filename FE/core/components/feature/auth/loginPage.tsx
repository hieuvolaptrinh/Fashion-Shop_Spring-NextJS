"use client";

import AppRegistrationRounded from "@mui/icons-material/AppRegistrationRounded";
import Email from "@mui/icons-material/Email";
import Facebook from "@mui/icons-material/Facebook";
import Google from "@mui/icons-material/Google";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import styles from "./loginPage.module.css";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const route = useRouter();

  const fetchLoginData = async (emailOrPhone: string) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await axios
        .post(`${API_URL}/api/v1/auth/login`, {
          phoneNumber: emailOrPhone,
        })
        .catch((error) => {
          if (error.response) {
            toast.error("Số điện thoại không hợp lệ hoặc chưa đăng ký");
            console.error("Error response:", error.response.data);
          }
        });
      if (response) {
        toast.success("Đăng nhập thành công");
        return response.data?.data;
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  const handleLoginGoogle = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const googleLoginUrl = `${API_URL}/api/v1/oauth2/google`;
    route.push(googleLoginUrl);
  };
  const handleLoginFacebook = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const facebookLoginUrl = `${API_URL}/api/v1/oauth2/facebook`;
    route.push(facebookLoginUrl);
  };

  const handleContinue = async (e: FormEvent) => {
    e.preventDefault();
    if (emailOrPhone.trim()) {
      const res = await fetchLoginData(emailOrPhone);
      const isAdmin = res.roles.find((e: string) => e === "ADMIN");
      localStorage.setItem("accessToken", res.token);
      localStorage.setItem("user", res.fullName);

      if (isAdmin) {
        window.location.href = "/admin";
      }
      window.location.href = "/";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundDecorations}>
        <div className={styles.decoration1} />
        <div className={styles.decoration2} />
        <div className={styles.decoration3} />
      </div>

      <Container maxWidth="sm" className={styles.mainContainer}>
        <Paper elevation={20} className={styles.paper}>
          <div className={styles.header}>
            <div className={styles.imageContainer}>
              <img
                src="./older.png"
                alt="Sức khỏe người cao tuổi"
                className={styles.heroImage}
              />
            </div>
            <Typography variant="h4" className={styles.title}>
              Sức khỏe là vàng
            </Typography>
            <Typography variant="body1" className={styles.subtitle}>
              Chăm sóc sức khỏe người cao tuổi với các sản phẩm chất lượng, an
              toàn và phù hợp nhất.
            </Typography>
          </div>
          <Box
            component="form"
            onSubmit={handleContinue}
            className={styles.form}
          >
            <TextField
              fullWidth
              required
              type="text"
              label="Số điện thoại"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="0123456789"
              className={styles.textField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ ml: 2, color: "#dc2626", fontSize: 28 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  backgroundColor: "#fef7f7",
                  fontSize: "1.1rem",
                  padding: "8px 0",
                  "&.Mui-focused fieldset": {
                    borderColor: "#dc2626",
                    borderWidth: "3px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#f87171",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "1.1rem",
                  fontWeight: 600,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#dc2626",
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!emailOrPhone.trim()}
              className={styles.continueButton}
              sx={{
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 700,
                py: 2.5,
                fontSize: "1.2rem",
                boxShadow: "0 12px 40px rgba(220, 38, 38, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
                  boxShadow: "0 16px 50px rgba(220, 38, 38, 0.5)",
                  transform: "translateY(-2px)",
                },
                "&:disabled": {
                  background: "#d1d5db",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              Tiếp tục
            </Button>
          </Box>

          <Grid container spacing={2}>
            <Grid size={12}>
              <Button
                component={Link}
                href="/register"
                variant="outlined"
                fullWidth
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  borderWidth: "2px",
                  borderColor: "#0284c7", // blue-600
                  color: "#0284c7",
                  backgroundColor: "#f0f9ff",
                  height: "56px",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&:hover": {
                    borderColor: "#0369a1", // darker blue
                    backgroundColor: "#e0f2fe",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(2, 132, 199, 0.25)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <AppRegistrationRounded sx={{ mr: 1, fontSize: 20 }} />
                Đăng ký
              </Button>
              <Divider className={styles.divider}>
                <Typography variant="body1" className={styles.dividerText}>
                  Hoặc tiếp tục với
                </Typography>
              </Divider>
            </Grid>
            <Grid size={12}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleLoginGoogle}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  borderWidth: "2px",
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  backgroundColor: "#fef2f2",

                  fontWeight: 700,
                  "&:hover": {
                    borderWidth: "2px",
                    borderColor: "#b91c1c",
                    backgroundColor: "#fef2f2",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Google className="mr-3" />
                Sign in with Google
              </Button>
            </Grid>
            <Grid size={12}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleLoginFacebook}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  borderWidth: "2px",
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  backgroundColor: "#fef2f2",

                  fontWeight: 700,
                  "&:hover": {
                    borderWidth: "2px",
                    borderColor: "#b91c1c",
                    backgroundColor: "#fef2f2",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 30px rgba(220, 38, 38, 0.25)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Facebook className="mr-3" />
                Sign in with Facebook
              </Button>
            </Grid>
          </Grid>

          {/* Footer */}
          <div className={styles.footer}>
            <Typography variant="body2" className={styles.footerText}>
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <span className={styles.link}>Điều khoản dịch vụ</span> và{" "}
              <span className={styles.link}>Chính sách bảo mật</span>
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
