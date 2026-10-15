import type { Product } from "@/core/lib/type";
import Warning from "@mui/icons-material/Warning";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

interface ConfirmDeleteProps {
  open: boolean;
  product: Product | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDelete = ({
  open,
  product,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDeleteProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 2,
        }}
      >
        <Warning color="warning" fontSize="large" />
        <Typography variant="h6" component="span" fontWeight={600}>
          Xác nhận xóa sản phẩm
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight={500}>
            Cảnh báo: Hành động này không thể hoàn tác!
          </Typography>
        </Alert>

        <DialogContentText component="div">
          <Typography variant="body1" color="text.primary" mb={1}>
            Bạn có chắc muốn xóa sản phẩm:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="primary">
              "{product?.productName}"
            </Typography>
          </Box>
          <Typography variant="body2" color="error.main" fontWeight={500}>
            ⚠️ Việc xóa sản phẩm này sẽ xóa đi tất cả các đơn hàng liên quan!
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          disabled={loading}
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{ borderRadius: 2, minWidth: 100 }}
        >
          {loading ? "Đang xóa..." : "Xác nhận xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
