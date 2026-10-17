import { z } from "zod";
import { REGEX_PATTERNS } from "@/core/constants";

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ và tên (tối thiểu 2 ký tự)"),
  phone: z
    .string()
    .trim()
    .regex(
      REGEX_PATTERNS.PHONE_VN,
      "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)"
    ),
  email: z
    .string()
    .trim()
    .email("Địa chỉ email không hợp lệ")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Vui lòng chọn danh mục cần hỗ trợ"),
  message: z
    .string()
    .trim()
    .min(10, "Nội dung lời nhắn cần tối thiểu 10 ký tự"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ContactSchemaType = ContactFormData;
