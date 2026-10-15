"use client";

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
        boxShadow: 1,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1 }}>
        {/* Logo & Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mr: { xs: 2, sm: 4 },
            fontSize: { xs: "1rem", sm: "1.25rem" },
            display: { xs: "none", sm: "block" },
          }}
        >
          Lan Chuyên Hàng Sales
        </Typography>

        {/* Search Bar */}
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: { xs: "100%", sm: 480 },
            mx: { xs: 0, sm: 4 },
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#9e9e9e" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                bgcolor: "grey.50",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid",
                  borderColor: "divider",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
        </Box>

        {/* Right Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Notifications */}
          <IconButton
            size="large"
            sx={{
              color: "text.secondary",
              p: { xs: 1, sm: 1.5 },
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Badge badgeContent={3} color="error">
              <Bell size={20} />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            onClick={handleMenuClick}
            size="large"
            sx={{
              color: "text.secondary",
              p: { xs: 1, sm: 1.5 },
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <User size={20} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1.5,
                  gap: 1.5,
                  borderRadius: 1,
                  mx: 1,
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <User size={16} />
              <Typography variant="body2">Hồ sơ</Typography>
            </MenuItem>
            <MenuItem>
              <Settings size={16} />
              <Typography variant="body2">Cài đặt</Typography>
            </MenuItem>
            <Box sx={{ borderTop: 1, borderColor: "divider", my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <LogOut size={16} />
              <Typography variant="body2">Đăng xuất</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
