"use client";

// Icon per-file import
import Add from "@mui/icons-material/Add";
import Analytics from "@mui/icons-material/Analytics";
import AttachMoney from "@mui/icons-material/AttachMoney";
import People from "@mui/icons-material/People";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Visibility from "@mui/icons-material/Visibility";
// Material UI component per-file import
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";

export default function AdminPage() {
  const [lengthOrder, setLengthOrder] = React.useState(0);
  const [lengthProduct, setLengthProduct] = React.useState(0);

  const fetchLengthOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token provided");
      }
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/api/v1/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order count");
      }

      const data = await response.json();
      setLengthOrder(data.data.length);
      return data.count;
    } catch (error) {
      console.error("Error fetching order count:", error);
      return 0;
    }
  };

  const fetchLengthProduct = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token provided");
      }
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/api/v1/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order count");
      }

      const data = await response.json();
      setLengthProduct(data.data.totalElements);
      return data.count;
    } catch (error) {
      console.error("Error fetching order count:", error);
      return 0; // Return 0 or handle the error as needed
    }
  };

  React.useEffect(() => {
    fetchLengthProduct();
    fetchLengthOrder();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "#2c3e50",
            mb: 2,
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "#7f8c8d",
            fontWeight: 400,
            fontSize: { xs: "1rem", sm: "1.1rem" },
          }}
        >
          Tổng quan hoạt động kinh doanh
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, sm: 3, md: 4 },
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          mb: { xs: 4, sm: 6 },
        }}
      >
        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            border: "1px solid #f1f3f4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ order: { xs: 2, sm: 1 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Tổng sản phẩm
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  {lengthProduct}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  borderRadius: 2,
                  bgcolor: "#e3f2fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  order: { xs: 1, sm: 2 },
                }}
              >
                <TrendingUp
                  sx={{ fontSize: { xs: 24, sm: 28 }, color: "#1976d2" }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            border: "1px solid #f1f3f4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ order: { xs: 2, sm: 1 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Tổng đơn hàng
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  {lengthOrder}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  borderRadius: 2,
                  bgcolor: "#e8f5e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  order: { xs: 1, sm: 2 },
                }}
              >
                <ShoppingBag
                  sx={{ fontSize: { xs: 24, sm: 28 }, color: "#4caf50" }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            border: "1px solid #f1f3f4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ order: { xs: 2, sm: 1 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Khách hàng
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  8,192
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  borderRadius: 2,
                  bgcolor: "#f3e5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  order: { xs: 1, sm: 2 },
                }}
              >
                <People
                  sx={{ fontSize: { xs: 24, sm: 28 }, color: "#9c27b0" }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            border: "1px solid #f1f3f4",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                textAlign: { xs: "center", sm: "left" },
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box sx={{ order: { xs: 2, sm: 1 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  Doanh thu tháng
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  sx={{
                    fontWeight: 600,
                    color: "#2c3e50",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  ₫45.2M
                </Typography>
              </Box>
              <Box
                sx={{
                  width: { xs: 48, sm: 56 },
                  height: { xs: 48, sm: 56 },
                  borderRadius: 2,
                  bgcolor: "#fff3e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  order: { xs: 1, sm: 2 },
                }}
              >
                <AttachMoney
                  sx={{ fontSize: { xs: 24, sm: 28 }, color: "#ff9800" }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 3 },
          border: "1px solid #f1f3f4",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: { xs: 3, sm: 4 },
            color: "#2c3e50",
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Hành động nhanh
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 2, sm: 3 },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Add />}
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: 2,
              border: "1px solid #e3f2fd",
              color: "#1976d2",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                border: "1px solid #1976d2",
                backgroundColor: "#fafafa",
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                onClick={() => (window.location.href = "/admin/products")}
              >
                Thêm sản phẩm mới
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mt: 0.5,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Thêm sản phẩm vào kho hàng
              </Typography>
            </Box>
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Visibility />}
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: 2,
              border: "1px solid #e8f5e8",
              color: "#4caf50",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(76, 175, 80, 0.15)",
                border: "1px solid #4caf50",
                backgroundColor: "#fafafa",
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
                // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                onClick={() => (window.location.href = "/admin/orders")}
              >
                Xem đơn hàng
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mt: 0.5,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Quản lý đơn hàng mới
              </Typography>
            </Box>
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<Analytics />}
            sx={{
              py: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3 },
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: 2,
              border: "1px solid #f3e5f5",
              color: "#9c27b0",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(156, 39, 176, 0.15)",
                border: "1px solid #9c27b0",
                backgroundColor: "#fafafa",
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2c3e50",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Báo cáo doanh thu
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  mt: 0.5,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Xem thống kê chi tiết
              </Typography>
            </Box>
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
