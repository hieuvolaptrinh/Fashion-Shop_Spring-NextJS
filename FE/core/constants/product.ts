export interface ProductReviewItem {
  id: number;
  userName: string;
  rating: number;
  date: string;
  content: string;
}

export const PRODUCT_REVIEWS_MOCK: ProductReviewItem[] = [
  {
    id: 1,
    userName: "Nguyễn Văn An",
    rating: 5,
    date: "2 ngày trước",
    content:
      "Sản phẩm rất chất lượng, đúng với mô tả. Tôi đã sử dụng được 1 tuần và cảm thấy rất hài lòng với kết quả. Sẽ tiếp tục ủng hộ!",
  },
  {
    id: 2,
    userName: "Trần Thị B",
    rating: 4,
    date: "1 tuần trước",
    content:
      "Giao hàng nhanh, đóng gói cẩn thận. Sản phẩm tốt nhưng giá hơi cao so với thị trường.",
  },
  {
    id: 3,
    userName: "Lê Văn Mạnh",
    rating: 5,
    date: "2 tuần trước",
    content:
      "Mẹ tôi rất thích sản phẩm này. Đã mua nhiều lần và sẽ tiếp tục ủng hộ. Chất lượng luôn ổn định qua từng lần mua.",
  },
  {
    id: 4,
    userName: "Phạm Thị Bo",
    rating: 3,
    date: "1 tháng trước",
    content:
      "Sản phẩm tạm được, nhưng hướng dẫn sử dụng chưa rõ ràng lắm. Cần cải thiện phần này.",
  },
  {
    id: 5,
    userName: "Hoàng Văn Em",
    rating: 5,
    date: "1 tháng trước",
    content:
      "Tuyệt vời! Đã cải thiện sức khỏe của tôi rõ rệt sau 2 tuần sử dụng. Sẽ giới thiệu cho bạn bè và người thân.",
  },
];
