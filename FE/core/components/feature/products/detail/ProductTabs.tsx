'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent } from '@/core/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/core/components/ui/tabs';
import { Textarea } from '@/core/components/ui/textarea';
import ConfirmDialog from '@/core/components/ui/confirm-dialog';
import { ROUTES } from '@/core/constants';
import type { CommentResponse, Product } from '@/core/lib/type';
import { formatDate } from '@/core/lib/utils';
import { useAuthStore } from '@/core/store/authStore';
import {
  Calendar,
  CheckCircle,
  FileText,
  Loader2,
  LogIn,
  MessageSquare,
  MessageSquarePlus,
  PackageCheck,
  Send,
  Star,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductTabsProps {
  product: Product;
  comments?: CommentResponse[];
  loadingComments?: boolean;
  onRefreshComments?: () => void;
  onSubmitComment?: (
    content: string,
    rating: number
  ) => Promise<{ success: boolean; message?: string }>;
  onDeleteComment?: (
    commentId: number
  ) => Promise<{ success: boolean; message?: string }>;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Rất không hài lòng',
  2: 'Chưa ưng ý',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Rất hài lòng & Tuyệt vời',
};

export function ProductTabs({
  product,
  comments = [],
  loadingComments = false,
  onSubmitComment,
  onDeleteComment,
}: ProductTabsProps) {
  const { isAuthenticated, isAdmin, user, profile } = useAuthStore();

  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newContent, setNewContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Lấy 2 chữ cái đầu làm avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    const first = parts[0]?.[0] || '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '';
    return (first + last).toUpperCase() || 'KH';
  };

  const totalCount = comments.length;
  const hasComments = totalCount > 0;
  const avgScore = hasComments
    ? Number(
        (
          comments.reduce((acc, c) => acc + (c.rating || 5), 0) / totalCount
        ).toFixed(1)
      )
    : 5.0;

  const count5 = comments.filter((c) => c.rating === 5).length;
  const count4 = comments.filter((c) => c.rating === 4).length;
  const count3 = comments.filter((c) => c.rating <= 3).length;
  const percent5 = hasComments ? Math.round((count5 / totalCount) * 100) : 100;
  const percent4 = hasComments ? Math.round((count4 / totalCount) * 100) : 0;
  const percent3 = hasComments ? Math.round((count3 / totalCount) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để gửi đánh giá sản phẩm');
      return;
    }
    const trimmed = newContent.trim();
    if (!trimmed) {
      toast.error('Vui lòng nhập nội dung đánh giá của bạn');
      return;
    }
    if (trimmed.length > 1000) {
      toast.error('Nội dung đánh giá không được vượt quá 1000 ký tự');
      return;
    }
    if (!onSubmitComment) return;

    setIsSubmitting(true);
    try {
      const result = await onSubmitComment(trimmed, newRating);
      if (result.success) {
        setNewContent('');
        setNewRating(5);
        setHoverRating(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete || !onDeleteComment) return;
    setIsDeleting(true);
    try {
      await onDeleteComment(commentToDelete);
      setCommentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentDisplayRating = hoverRating || newRating;

  return (
    <div className="mt-12 sm:mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl">
          <TabsTrigger
            value="description"
            className="rounded-lg font-bold text-xs sm:text-sm"
          >
            Mô tả chi tiết
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="rounded-lg font-bold text-xs sm:text-sm"
          >
            Đánh giá ({totalCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="rounded-2xl border-border/70 shadow-xs">
            <CardContent className="space-y-8 pt-6">
              <div>
                <h3 className="mb-3 text-lg font-extrabold text-foreground sm:text-xl">
                  Thông tin sản phẩm
                </h3>
                <div className="prose max-w-none text-sm leading-relaxed text-muted-foreground sm:text-base">
                  <p className="whitespace-pre-line">
                    {product.description ||
                      'Sản phẩm chính hãng với nguồn gốc xuất xứ rõ ràng, mang lại sự tiện lợi và chất lượng cao nhất cho người tiêu dùng.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t border-border/60 pt-6 md:grid-cols-3">
                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4.5">
                  <div className="flex items-center gap-2 text-primary">
                    <PackageCheck className="size-4" />
                    <h4 className="text-sm font-bold text-foreground">
                      Thành phần chính
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {product.ingredients ||
                      'Thành phần chọn lọc tự nhiên, đạt tiêu chuẩn chất lượng cao.'}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4.5">
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="size-4" />
                    <h4 className="text-sm font-bold text-foreground">
                      Hướng dẫn sử dụng
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {product.usageInstructions ||
                      'Sử dụng đều đặn theo chỉ dẫn ghi trên bao bì sản phẩm.'}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4.5">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="size-4" />
                    <h4 className="text-sm font-bold text-foreground">
                      Hạn dùng & Bảo quản
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {product.manufactureDate
                      ? `HSD: ${formatDate(product.manufactureDate)}`
                      : 'Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card className="rounded-2xl border-border/70 shadow-xs">
            <CardContent className="space-y-8 pt-6">
              {/* Thống kê đánh giá */}
              <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-muted/20 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-foreground sm:text-4xl">
                      {hasComments ? avgScore.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i <= Math.round(avgScore)
                            ? 'fill-warning text-warning'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {hasComments
                      ? `Dựa trên ${totalCount} đánh giá từ người dùng`
                      : 'Chưa có đánh giá nào được gửi'}
                  </p>
                </div>

                <div className="w-full max-w-xs space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-muted-foreground">5 sao</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${percent5}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold text-foreground">
                      {percent5}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-muted-foreground">4 sao</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-500"
                        style={{ width: `${percent4}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold text-foreground">
                      {percent4}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 text-muted-foreground">≤ 3 sao</span>
                    <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/40 transition-all duration-500"
                        style={{ width: `${percent3}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-semibold text-foreground">
                      {percent3}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Form gửi bình luận / đánh giá mới */}
              {isAuthenticated ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 transition-all shadow-2xs">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <MessageSquarePlus className="size-4" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground sm:text-base">
                        Viết đánh giá của bạn
                      </h4>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      Đăng nhận xét với tên: <span className="font-semibold text-foreground">{profile?.fullName || user || 'Tài khoản của bạn'}</span>
                    </span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Chọn số sao */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Chất lượng sản phẩm:
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-muted-foreground/30 transition-transform hover:scale-110 focus:outline-none"
                            aria-label={`${star} sao`}
                          >
                            <Star
                              className={`size-6 transition-colors ${
                                star <= currentDisplayRating
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground/25 hover:text-warning/50'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-warning transition-all">
                        {RATING_LABELS[currentDisplayRating]}
                      </span>
                    </div>

                    {/* Textarea nhập nhận xét */}
                    <div className="space-y-1.5">
                      <Textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Hãy chia sẻ trải nghiệm chân thực của bạn về chất liệu, form dáng, đường may và độ vừa vặn khi mặc sản phẩm này nhé..."
                        rows={3}
                        maxLength={1000}
                        className="rounded-xl border-border/80 bg-background resize-none focus-visible:ring-primary/40 text-sm"
                        disabled={isSubmitting}
                      />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Nhận xét chi tiết sẽ giúp những người mua khác lựa chọn kích cỡ phù hợp hơn.</span>
                        <span>{newContent.length} / 1000 ký tự</span>
                      </div>
                    </div>

                    {/* Nút gửi */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !newContent.trim()}
                        className="rounded-xl px-5 h-9 text-xs font-semibold gap-1.5 shadow-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" />
                            <span>Đang gửi đánh giá...</span>
                          </>
                        ) : (
                          <>
                            <Send className="size-3.5" />
                            <span>Gửi đánh giá</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-5 text-center sm:text-left">
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <LogIn className="size-5" />
                    </div>
                    <div className="text-left space-y-0.5">
                      <p className="text-sm font-semibold text-foreground">
                        Bạn đã trải nghiệm sản phẩm này?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Đăng nhập tài khoản để chia sẻ nhận xét và đánh giá trải nghiệm thực tế nhé!
                      </p>
                    </div>
                  </div>

                  <Link href={ROUTES.AUTH.LOGIN}>
                    <Button variant="default" size="sm" className="rounded-xl gap-1.5 text-xs font-medium h-9 shrink-0">
                      <LogIn className="size-3.5" />
                      <span>Đăng nhập để đánh giá</span>
                    </Button>
                  </Link>
                </div>
              )}

              {/* Danh sách bình luận */}
              {loadingComments ? (
                <div className="space-y-4 py-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse rounded-xl border border-border/50 bg-muted/30"
                    />
                  ))}
                </div>
              ) : hasComments ? (
                <div className="divide-y divide-border/60">
                  {comments.map((comment) => {
                    const isVerifiedBuyer = Boolean(
                      comment.isPurchased ||
                        comment.purchased ||
                        (comment.orderDetailId && comment.orderDetailId > 0)
                    );
                    const canDelete = Boolean(
                      isAdmin ||
                        (profile?.userId && comment.userId === profile.userId)
                    );

                    return (
                      <div
                        key={comment.commentId}
                        className="py-5 first:pt-0 last:pb-0 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                              {getInitials(comment.userName || 'Khách')}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-bold text-foreground">
                                  {comment.userName || 'Khách hàng'}
                                </span>
                                {isVerifiedBuyer ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                                    <CheckCircle className="size-3" />
                                    Đã mua hàng
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                    Thành viên
                                  </span>
                                )}
                              </div>

                              <div className="mt-0.5 flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    className={`size-3.5 ${
                                      i <= (comment.rating || 5)
                                        ? 'fill-warning text-warning'
                                        : 'text-muted-foreground/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(comment.createdAt)}
                            </span>
                            {canDelete && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setCommentToDelete(comment.commentId)}
                                className="size-7 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Xóa bình luận"
                              >
                                <Trash2 className="size-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="mt-3 pl-12 text-xs leading-relaxed text-muted-foreground sm:text-sm whitespace-pre-line">
                          {comment.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                    <MessageSquare className="size-5" />
                  </div>
                  <h4 className="text-sm font-bold text-foreground">
                    Chưa có đánh giá nào cho sản phẩm này
                  </h4>
                  <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                    Hãy là người đầu tiên trải nghiệm và chia sẻ cảm nhận về sản phẩm này nhé!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Hộp thoại xác nhận xóa bình luận */}
      <ConfirmDialog
        open={commentToDelete !== null}
        variant="destructive"
        title="Xác nhận xóa bình luận"
        description="Bình luận này sẽ bị xóa vĩnh viễn khỏi sản phẩm. Bạn có chắc chắn muốn xóa không?"
        confirmText="Xóa bình luận"
        cancelText="Hủy"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCommentToDelete(null)}
      />
    </div>
  );
}
