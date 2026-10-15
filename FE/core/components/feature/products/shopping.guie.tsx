const ShoppingGuide = () => {
  return (
    <>
      <div className="mt-16 rounded-2xl border border-rose-100 bg-white p-4 shadow-lg sm:p-6 md:p-8">
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Hướng Dẫn Mua Hàng
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: 1,
              title: "Tìm Sản Phẩm",
              description:
                "Tìm sản phẩm bạn quan tâm và nhấn vào để xem chi tiết",
            },
            {
              step: 2,
              title: "Chọn Tùy Chọn",
              description: "Chọn số lượng, màu sắc và kích thước phù hợp",
            },
            {
              step: 3,
              title: "Thêm Vào Giỏ",
              description: "Nhấn nút 'Thêm vào giỏ hàng' hoặc 'Mua ngay'",
            },
            {
              step: 4,
              title: "Thanh Toán",
              description: "Hoàn tất đơn hàng và chọn phương thức thanh toán",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center rounded-xl border border-rose-100 bg-rose-50 p-4 text-center sm:p-6"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900 sm:text-xl">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center sm:mt-8">
          <p className="max-w-full rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-4 text-sm break-words whitespace-normal text-white hover:from-rose-700 hover:to-red-700 sm:px-6 sm:py-5 sm:text-base">
            Cần Hỗ Trợ? Gọi Ngay: 093.1133.128 - 08.193.148.93
          </p>
        </div>
      </div>
    </>
  );
};

export default ShoppingGuide;
