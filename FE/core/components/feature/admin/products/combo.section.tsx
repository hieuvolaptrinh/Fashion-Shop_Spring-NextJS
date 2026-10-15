import { Combo } from "@/core/lib/type";
import { Add, Remove } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";

interface ComboSectionProps {
  combos: Combo[];
  onAddCombo: () => void;
  onRemoveCombo: (index: number) => void;
  onUpdateCombo: (index: number, field: keyof Combo, value: any) => void;
  salePrice: number;
  errors: Record<string, string>;
  isViewing?: boolean;
}

const ComboSection: React.FC<ComboSectionProps> = ({
  combos,
  onAddCombo,
  onRemoveCombo,
  onUpdateCombo,
  salePrice,
  errors,
  isViewing = false,
}) => {
  if (isViewing && combos.length === 0) return null;

  return (
    <Card sx={{ mt: 2, borderRadius: 2 }}>
      <CardHeader
        title="Tùy chọn Combo"
        subheader={
          isViewing
            ? "Các gói combo hiện có"
            : "Thêm các gói combo với giá ưu đãi khi mua số lượng lớn"
        }
        action={
          !isViewing && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={onAddCombo}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Thêm Combo
            </Button>
          )
        }
      />
      <CardContent>
        {combos.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={2}>
            Chưa có combo nào. Nhấn "Thêm Combo" để tạo gói ưu đãi.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {combos.map((combo, index) => (
              <Card key={index} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      Combo {index + 1}
                    </Typography>
                    {!isViewing && (
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onRemoveCombo(index)}
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                      label="Số lượng"
                      type="number"
                      value={combo.quantityInCombo}
                      onChange={(e) =>
                        onUpdateCombo(
                          index,
                          "quantityInCombo",
                          Number(e.target.value),
                        )
                      }
                      error={!!errors[`combo_${index}_quantity`]}
                      helperText={errors[`combo_${index}_quantity`]}
                      InputProps={{
                        inputProps: { min: 1, step: 1 },
                      }}
                      fullWidth
                      disabled={isViewing}
                      sx={{
                        bgcolor: isViewing
                          ? "action.disabledBackground"
                          : "inherit",
                      }}
                    />
                    <TextField
                      label="Giá combo"
                      type="number"
                      value={combo.comboPrice}
                      onChange={(e) =>
                        onUpdateCombo(
                          index,
                          "comboPrice",
                          Number(e.target.value),
                        )
                      }
                      error={!!errors[`combo_${index}_price`]}
                      helperText={errors[`combo_${index}_price`]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">₫</InputAdornment>
                        ),
                        inputProps: { min: 0, step: 1000 },
                      }}
                      fullWidth
                      disabled={isViewing}
                      sx={{
                        bgcolor: isViewing
                          ? "action.disabledBackground"
                          : "inherit",
                      }}
                    />
                  </Box>

                  <TextField
                    label="Mô tả combo (tùy chọn)"
                    value={combo.comboDescription || ""}
                    onChange={(e) =>
                      onUpdateCombo(index, "comboDescription", e.target.value)
                    }
                    placeholder="Ví dụ: Mua 3 tặng 1, Giảm 20% khi mua từ 5 sản phẩm..."
                    fullWidth
                    multiline
                    rows={2}
                    disabled={isViewing}
                    sx={{
                      bgcolor: isViewing
                        ? "action.disabledBackground"
                        : "inherit",
                    }}
                  />

                  {combo.quantityInCombo > 0 &&
                    combo.comboPrice > 0 &&
                    salePrice > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          p: 2,
                          bgcolor: "success.light",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="success.dark">
                          <strong>Tiết kiệm:</strong>{" "}
                          {(
                            salePrice * combo.quantityInCombo -
                            combo.comboPrice
                          ).toLocaleString("vi-VN")}
                          ₫ (
                          {(
                            ((salePrice * combo.quantityInCombo -
                              combo.comboPrice) /
                              (salePrice * combo.quantityInCombo)) *
                            100
                          ).toFixed(1)}
                          %)
                        </Typography>
                        <Typography variant="body2" color="success.dark">
                          <strong>Giá lẻ:</strong>{" "}
                          {(salePrice * combo.quantityInCombo).toLocaleString(
                            "vi-VN",
                          )}
                          ₫{" → "}
                          <strong>Giá combo:</strong>{" "}
                          {combo.comboPrice.toLocaleString("vi-VN")}₫
                        </Typography>
                      </Box>
                    )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ComboSection;
