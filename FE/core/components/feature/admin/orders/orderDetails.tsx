import AttachMoney from "@mui/icons-material/AttachMoney";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Close from "@mui/icons-material/Close";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import Print from "@mui/icons-material/Print";
import Receipt from "@mui/icons-material/Receipt";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import axios from "axios";

interface OrderDetailsProps {
  open: boolean;
  onClose: () => void;
  order: any | null;
}

const OrderDetails = ({ open, onClose, order }: OrderDetailsProps) => {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  const handlePrintedBill = async (orderId: number) => {
    const localStorageToken = localStorage.getItem("accessToken");
    if (!localStorageToken) {
      throw new Error("No access token provided");
    }
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await axios.post(
      `${API_URL}/api/v1/bills/export-multiple`,
      [orderId],
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorageToken}`,
          Accept: "application/pdf",
          "Content-Type": "application/json",
        },
      },
    );

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = pdfUrl;

    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
    document.body.appendChild(iframe);
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, bgcolor: "primary.main", color: "white" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" component="div" fontWeight={600}>
            Chi tiết đơn hàng #{order.orderId}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: "white" }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Order Status and Basic Info */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Thông tin đơn hàng
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Ngày tạo:</strong> {formatDate(order.createAt)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AttachMoney fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Tổng tiền:</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="error.main"
                      >
                        {formatPrice(order.totalPrice)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Thông tin khách hàng
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">
                        <strong>Số điện thoại:</strong> {order.phoneNumber}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                    >
                      <LocationOn
                        fontSize="small"
                        color="action"
                        sx={{ mt: 0.5 }}
                      />
                      <Box>
                        <Typography variant="body2">
                          <strong>Địa chỉ giao hàng:</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.shippingAddress}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payment and Bill Status */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ borderRadius: 2, border: 1, borderColor: "divider" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Trạng thái in bill
                  </Typography>
                  <Chip
                    icon={order.bill ? <Receipt /> : <Print />}
                    label={order.bill ? "Đã in bill" : "Chưa in bill"}
                    color={order.bill ? "success" : "warning"}
                    variant="outlined"
                    sx={{ fontSize: "0.875rem" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Products List */}
          <Card
            sx={{ borderRadius: 2, border: 1, borderColor: "divider", mt: 3 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Danh sách sản phẩm ({order.items?.length || 0} sản phẩm)
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List sx={{ p: 0 }}>
                {order.items?.map((item: any, index: number) => (
                  <ListItem
                    key={item.orderDetailId || index}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 2,
                      mb: 2,
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={item.product?.listImages?.[0]?.link || ""}
                        variant="rounded"
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight={500}>
                          {item.product?.productName}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Giá: {formatPrice(item.price)} x {item.quantity}
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="error.main"
                          >
                            Tổng: {formatPrice(item.price * item.quantity)}
                          </Typography>
                          {item.product?.listTypes?.map((type: any) => (
                            <Chip
                              key={type.typeId}
                              label={type.typeName}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 0.5, mt: 0.5, fontSize: "0.75rem" }}
                            />
                          ))}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Đóng
        </Button>
        <Button
          variant="contained"
          startIcon={<Print />}
          sx={{ borderRadius: 2 }}
          onClick={() => handlePrintedBill(order.orderId)}
        >
          {order.bill ? "In lại bill" : "In bill"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetails;
