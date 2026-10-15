"use client";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Home, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
    description: "Tổng quan hệ thống",
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
    description: "Quản lý sản phẩm",
  },
  {
    title: "Đơn hàng",
    href: "/admin/orders",
    icon: ShoppingCart,
    description: "Quản lý đơn hàng",
  },
  // {
  //   title: "Khách hàng",
  //   href: "/admin/users",
  //   icon: Users,
  //   description: "Quản lý người dùng",
  // },
  // {
  //   title: "Doanh thu",
  //   href: "/admin/revenue",
  //   icon: TrendingUp,
  //   description: "Theo dõi doanh thu",
  // },
  // {
  //   title: "Cài đặt",
  //   href: "/admin/settings",
  //   icon: Settings,
  //   description: "Cài đặt hệ thống",
  // },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        width: { xs: 0, md: 280 },
        height: "100vh",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
      }}
    >
      {/* Admin Info */}
      <Box sx={{ p: { xs: 1, sm: 2 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              mb: 0.5,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Lan Chuyên Hàng Sales
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
            }}
          >
            Quản trị viên hệ thống
          </Typography>
        </Paper>
      </Box>
      {/* Navigation Menu */}
      <Box sx={{ flex: 1, pt: 2 }}>
        <List sx={{ px: { xs: 1, sm: 2 } }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 1, sm: 1.5 },
                    px: { xs: 1, sm: 2 },
                    ...(isActive && {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "& .MuiListItemIcon-root": {
                        color: "inherit",
                      },
                      "& .MuiListItemText-primary": {
                        color: "inherit",
                        fontWeight: 600,
                      },
                      "& .MuiListItemText-secondary": {
                        color: "primary.contrastText",
                        opacity: 0.8,
                      },
                    }),
                    "&:hover": {
                      bgcolor: isActive ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: { xs: 32, sm: 40 } }}>
                    <Icon size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? "inherit" : "text.primary",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        {item.title}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.6rem", sm: "0.75rem" },
                          mt: 0.25,
                          display: { xs: "none", lg: "block" },
                        }}
                      >
                        {item.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
}
