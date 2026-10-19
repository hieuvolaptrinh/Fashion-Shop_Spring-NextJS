import { z } from "zod";
import { REGEX_PATTERNS } from "@/core/constants";

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(REGEX_PATTERNS.PHONE_VN, "Số điện thoại không hợp lệ (Ví dụ: 0988888888)"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(REGEX_PATTERNS.PHONE_VN, "Số điện thoại không hợp lệ (Ví dụ: 0988888888)"),
    fullName: z
      .string()
      .trim()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự"),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng xác nhận lại mật khẩu"),
    addressName: z
      .string()
      .trim()
      .min(3, "Vui lòng nhập số nhà, tên đường chi tiết"),
    provinceCode: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
    provinceName: z.string().min(1, "Vui lòng chọn Tỉnh/Thành phố"),
    wardCode: z.string().min(1, "Vui lòng chọn Xã/Phường"),
    wardName: z.string().min(1, "Vui lòng chọn Xã/Phường"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không trùng khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
