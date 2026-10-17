"use client";

import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Textarea } from "@/core/components/ui/textarea";
import { CONTACT_DATA } from "@/core/constants/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { contactSchema, type ContactFormData } from "@/core/validations";

export const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { supportCategories, storeInfo } = CONTACT_DATA;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      category: "",
      message: "",
    },
  });

  const onSubmit = async (_data: ContactFormData) => {
    try {
      // Giả lập gửi thông tin liên hệ và phản hồi
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success(
        "Gửi tin nhắn thành công! Tư vấn viên sẽ liên hệ lại bạn trong ít phút."
      );
      setIsSuccess(true);
      reset();
    } catch {
      toast.error("Đã xảy ra lỗi khi gửi lời nhắn. Vui lòng thử lại sau!");
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
  };

  return (
    <Card className="h-full border border-border/70 bg-card/70 shadow-sm backdrop-blur-sm">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground sm:text-2xl">
          <Send className="h-5 w-5 text-muted-foreground" />
          Gửi Lời Nhắn
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại với bạn sớm nhất.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center sm:py-12">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-foreground">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground sm:text-xl">
              Cảm ơn bạn đã liên hệ!
            </h3>
            <p className="mb-6 max-w-sm text-xs text-muted-foreground sm:text-sm">
              Lời nhắn của bạn đã được tiếp nhận. Đội ngũ CSKH sẽ phản hồi qua
              số điện thoại hoặc Zalo trong thời gian sớm nhất.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetForm}
                className="rounded-lg text-xs"
              >
                Gửi lời nhắn khác
              </Button>
              <Button
                size="sm"
                asChild
                className="gap-1.5 rounded-lg text-xs"
              >
                <a
                  href={`https://zalo.me/${storeInfo.zalo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat Zalo nhận phản hồi ngay
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium sm:text-sm">
                  Họ và tên <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  {...register("fullName")}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium sm:text-sm">
                  Số điện thoại <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ví dụ: 0912345678"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium sm:text-sm">
                  Email <span className="text-muted-foreground text-[11px] font-normal">(Không bắt buộc)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Category Select */}
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-medium sm:text-sm">
                  Danh mục cần hỗ trợ <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        id="category"
                        className={`w-full ${errors.category ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Chọn vấn đề cần hỗ trợ" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-[11px] text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs font-medium sm:text-sm">
                Nội dung lời nhắn <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Nhập chi tiết yêu cầu, tên sản phẩm hoặc mã đơn hàng của bạn..."
                rows={4}
                {...register("message")}
                className={`resize-none ${errors.message ? "border-destructive" : ""}`}
              />
              {errors.message && (
                <p className="text-[11px] text-destructive">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-2 py-5 font-semibold transition-all hover:shadow-md sm:py-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang gửi lời nhắn...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Gửi Tin Nhắn Ngay
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
