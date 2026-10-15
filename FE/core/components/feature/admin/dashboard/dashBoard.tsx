"use client";

import {
  Add,
  Analytics,
  AttachMoney,
  People,
  ShoppingBag,
  TrendingUp,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
} from "@mui/material";

export default function Dashboard() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 2,
      }}
    >
      {/* Page Header */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 2,
            fontSize: { xs: "1.75rem", md: "2.5rem" },
          }}
        >
          Dashboard
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            fontSize: "1.1rem",
          }}
        >
          Tổng quan hoạt động kinh doanh
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          mb: 6,
        }}
      >
        <Card
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            boxShadow: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
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
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                >
                  123
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp sx={{ fontSize: 28, color: "primary.main" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            boxShadow: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
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
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                >
                  56
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "success.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShoppingBag sx={{ fontSize: 28, color: "success.main" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            boxShadow: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
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
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                >
                  8,192
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "secondary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <People sx={{ fontSize: 28, color: "secondary.main" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            boxShadow: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: 4,
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
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
                    fontWeight: 700,
                    color: "text.primary",
                    fontSize: "2rem",
                  }}
                >
                  ₫45.2M
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: "warning.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AttachMoney sx={{ fontSize: 28, color: "warning.main" }} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          boxShadow: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "text.primary",
            fontSize: "1.5rem",
          }}
        >
          Hành động nhanh
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "1fr",
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
              py: 3,
              px: 3,
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: 2,
              border: 1,
              borderColor: "primary.light",
              color: "primary.main",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 3,
                borderColor: "primary.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "1rem",
                }}
              >
                Thêm sản phẩm mới
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  mt: 0.5,
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
              py: 3,
              px: 3,
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: 2,
              border: 1,
              borderColor: "success.light",
              color: "success.main",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 3,
                borderColor: "success.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "1rem",
                }}
              >
                Xem đơn hàng
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  mt: 0.5,
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
              py: 3,
              px: 3,
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: 2,
              border: 1,
              borderColor: "info.light",
              color: "info.main",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: 3,
                borderColor: "info.main",
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                  fontSize: "1rem",
                }}
              >
                Báo cáo doanh thu
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  mt: 0.5,
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
