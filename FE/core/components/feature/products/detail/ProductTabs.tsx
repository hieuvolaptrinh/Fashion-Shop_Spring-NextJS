'use client';

import { Card, CardContent } from '@/core/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/core/components/ui/tabs';
import type { CommentResponse, Product } from '@/core/lib/type';
import { formatDate } from '@/core/lib/utils';
import { Calendar, CheckCircle, FileText, MessageSquare, PackageCheck, Star } from 'lucide-react';

interface ProductTabsProps {
  product: Product;
  comments?: CommentResponse[];
  loadingComments?: boolean;
  onRefreshComments?: () => void;
}

export function ProductTabs({
  product,
  comments = [],
  loadingComments = false,
}: ProductTabsProps) {
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
    ? Number((comments.reduce((acc, c) => acc + (c.rating || 5), 0) / totalCount).toFixed(1))
    : 5.0;

  const count5 = comments.filter((c) => c.rating === 5).length;
  const count4 = comments.filter((c) => c.rating === 4).length;
  const count3 = comments.filter((c) => c.rating <= 3).length;
  const percent5 = hasComments ? Math.round((count5 / totalCount) * 100) : 100;
  const percent4 = hasComments ? Math.round((count4 / totalCount) * 100) : 0;
  const percent3 = hasComments ? Math.round((count3 / totalCount) * 100) : 0;

  return (
    <div className="mt-12 sm:mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 rounded-xl">
          <TabsTrigger value="description" className="rounded-lg font-bold text-xs sm:text-sm">
            Mô tả chi tiết
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg font-bold text-xs sm:text-sm">
            Đánh giá ({totalCount})
          </TabsTrigger>
        </TabsList>

        {/* Tab Mô tả */}
        <TabsContent value="description" className="mt-6">
          <Card className="rounded-2xl border-border/70 shadow-xs">
            <CardContent className="space-y-8 pt-6">
              {/* Đoạn mô tả chính */}
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

              {/* Các khối thông số chi tiết dạng Bento Cards */}
              <div className="grid grid-cols-1 gap-4 border-t border-border/60 pt-6 md:grid-cols-3">
                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4.5">
                  <div className="flex items-center gap-2 text-primary">
                    <PackageCheck className="size-4" />
                    <h4 className="text-sm font-bold text-foreground">Thành phần chính</h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {product.ingredients || 'Thành phần chọn lọc tự nhiên, đạt tiêu chuẩn chất lượng cao.'}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4.5">
                  <div className="flex items-center gap-2 text-primary">
                    <FileText className="size-4" />
                    <h4 className="text-sm font-bold text-foreground">Hướng dẫn sử dụng</h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {product.usageInstructions || 'Sử dụng đều đặn theo chỉ dẫn ghi trên bao bì sản phẩm.'}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4.5">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar className="size-4" />
                    <h4 className="text-sm font-bold text-foreground">Hạn dùng & Bảo quản</h4>
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

        {/* Tab Đánh giá */}
        <TabsContent value="reviews" className="mt-6">
          <Card className="rounded-2xl border-border/70 shadow-xs">
            <CardContent className="space-y-8 pt-6">
              {/* Tóm tắt điểm số đánh giá */}
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
                      ? `Dựa trên ${totalCount} đánh giá từ người mua thực tế`
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

              {/* Trạng thái tải hoặc Danh sách bình luận thực tế */}
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
                  {comments.map((comment) => (
                    <div key={comment.commentId} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                            {getInitials(comment.userName || 'Khách')}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">
                                {comment.userName || 'Khách hàng'}
                              </span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                                <CheckCircle className="size-3" />
                                Đã mua hàng
                              </span>
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

                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      <p className="mt-3 pl-12 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {comment.content}
                      </p>
                    </div>
                  ))}
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
                    Đánh giá được ghi nhận từ những khách hàng đã nhận hàng thành công. Hãy là người đầu tiên trải nghiệm nhé!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
