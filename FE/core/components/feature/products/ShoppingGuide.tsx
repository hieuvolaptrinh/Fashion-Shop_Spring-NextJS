const ShoppingGuide = () => {
  return (
    <div className="mt-16 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-6 md:p-8">
      <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Hướng Dẫn Mua Hàng
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            step: 1,
            title: "Tìm Sản Phẩm",
            description: "Tìm sản phẩm bạn quan tâm và nhấn vào để xem chi tiết",
          },
          {
            step: 2,
            title: "Chọn Tùy Chọn",
            description: "Chọn số lượng, phân loại và kích thước phù hợp",
          },
          {
            step: 3,
            title: "Thêm Vào Giỏ",
            description: "Nhấn nút 'Thêm vào giỏ' hoặc chọn mua ngay sản phẩm",
          },
          {
            step: 4,
            title: "Thanh Toán",
            description: "Hoàn tất đơn hàng và chọn phương thức thanh toán thuận tiện",
          },
        ].map((item) => (
          <div
            key={item.step}
            className="flex flex-col items-center rounded-xl border border-border/60 bg-muted/20 p-4 text-center transition-all duration-200 hover:border-primary/30 hover:bg-muted/40 sm:p-6"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-xs sm:h-14 sm:w-14 sm:text-2xl">
              {item.step}
            </div>
            <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingGuide;
