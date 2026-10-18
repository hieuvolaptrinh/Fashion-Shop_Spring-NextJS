-- =======================================================
-- SCRIPT KHỞI TẠO VÀ NẠP DỮ LIỆU MẪU CHO DỰ ÁN FASHION SHOP
-- =======================================================

-- 1. Tạo database nếu chưa có
CREATE DATABASE IF NOT EXISTS `healthy_store` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `healthy_store`;

-- Lưu ý: Sau khi bật Backend lần đầu tiên, Hibernate sẽ tự tạo các bảng (product, type, role, image,...).
-- Sau khi bảng đã được tạo, bạn hãy chạy toàn bộ các lệnh bên dưới trong HeidiSQL / MySQL:

-- -------------------------------------------------------
-- 2. TẠO ROLE MẶC ĐỊNH (Bắt buộc cho hệ thống Auth)
-- -------------------------------------------------------
INSERT INTO `role` (`role_name`, `description`) 
SELECT 'USER', 'Người dùng thông thường'
WHERE NOT EXISTS (SELECT 1 FROM `role` WHERE `role_name` = 'USER');

INSERT INTO `role` (`role_name`, `description`) 
SELECT 'ADMIN', 'Quản trị viên'
WHERE NOT EXISTS (SELECT 1 FROM `role` WHERE `role_name` = 'ADMIN');

-- -------------------------------------------------------
-- 3. TẠO DANH MỤC SẢN PHẨM (TYPES)
-- -------------------------------------------------------
INSERT INTO `type` (`type_id`, `type_name`, `image_url`) VALUES
(1, 'Thời Trang Nam', '/categories/men.jpg'),
(2, 'Thời Trang Nữ', '/categories/women.jpg'),
(3, 'Phụ Kiện & Giày Dép', '/categories/accessories.jpg'),
(4, 'Sản Phẩm Sức Khỏe', '/categories/wellness.jpg'),
(5, 'Mỹ Phẩm & Làm Đẹp', '/categories/cosmetics.jpg'),
(6, 'Đồ Gia Dụng Tiện Ích', '/categories/homeware.jpg')
ON DUPLICATE KEY UPDATE `type_name` = VALUES(`type_name`), `image_url` = VALUES(`image_url`);

-- -------------------------------------------------------
-- 4. TẠO SẢN PHẨM MẪU (PRODUCTS)
-- -------------------------------------------------------
INSERT INTO `product` (`product_id`, `product_name`, `original_price`, `sale_price`, `quantity`, `description`, `ingredients`, `usage_instructions`, `manufacture_date`) VALUES
(1, 'Áo Thun Cotton Unisex Form Rộng Thoáng Khí', 250000, 149000, 100, 'Áo thun cotton 100% co giãn 4 chiều mềm mịn, thấm hút mồ hôi cực tốt phù hợp mặc hàng ngày.', '100% Cotton tự nhiên', 'Giặt máy ở chế độ nhẹ, tránh chất tẩy mạnh.', '2026-01-01'),
(2, 'Váy Hoa Nhí Vintage Dáng Xòe Điệu Đà', 380000, 229000, 50, 'Đầm hoa nhí phong cách Hàn Quốc trẻ trung tôn dáng, chất liệu voan lụa mềm mại.', 'Vải voan lụa cao cấp 2 lớp', 'Giặt tay hoặc giặt túi lưới để giữ form váy.', '2026-01-15'),
(3, 'Túi Xách Da Đeo Chéo Nữ Thanh Lịch', 420000, 289000, 40, 'Thiết kế sang trọng, quai đeo điều chỉnh được, nhiều ngăn tiện lợi đi làm hoặc đi chơi.', 'Da PU cao cấp chống xước', 'Lau sạch bằng khăn ẩm mềm, tránh phơi nắng gắt.', '2026-02-01'),
(4, 'Combo Trà Thảo Mộc Thanh Nhiệt Dưỡng Nhan', 190000, 125000, 120, 'Trà thảo mộc tự nhiên giúp thanh lọc cơ thể, ngủ ngon và hỗ trợ làm đẹp da.', 'Hoa cúc, táo đỏ, kỷ tử, hoa nhài', 'Hãm với 300ml nước sôi trong 5-7 phút.', '2026-03-01'),
(5, 'Giày Sneaker Thể Thao Năng Động Êm Chân', 550000, 349000, 60, 'Giày sneaker phong cách tối giản, đế cao su đàn hồi êm ái thích hợp chạy bộ và dạo phố.', 'Vải dệt thoáng khí + đế cao su đúc', 'Vệ sinh bằng dung dịch vệ sinh giày chuyên dụng.', '2026-02-20'),
(6, 'Bình Giữ Nhiệt Inox 304 Cao Cấp 500ml', 210000, 135000, 85, 'Giữ nóng 8 tiếng, giữ lạnh lên đến 12 tiếng. Lớp sơn nhám mờ sang trọng không bám vân tay.', 'Inox 304 không gỉ an toàn thực phẩm', 'Rửa sạch trước khi dùng lần đầu, đậy chặt nắp.', '2026-03-10')
ON DUPLICATE KEY UPDATE `product_name` = VALUES(`product_name`);

-- -------------------------------------------------------
-- 5. LIÊN KẾT SẢN PHẨM VỚI DANH MỤC (PRODUCT_PRODUCT_TYPE)
-- -------------------------------------------------------
INSERT IGNORE INTO `product_product_type` (`product_id`, `type_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 3),
(6, 6);

-- -------------------------------------------------------
-- 6. HÌNH ẢNH SẢN PHẨM (IMAGES - Dùng ảnh nội bộ FE /public)
-- -------------------------------------------------------
INSERT INTO `image` (`image_id`, `image_name`, `link`, `product_id`) VALUES
(1, 'productDemo1.jpg', '/productDemo1.jpg', 1),
(2, 'productDemo2.jpg', '/productDemo2.jpg', 2),
(3, 'productDemo3.jpg', '/productDemo3.jpg', 3),
(4, 'productDemo4.jpg', '/productDemo4.jpg', 4),
(5, 'productDemo5.jpg', '/productDemo5.jpg', 5),
(6, 'productDemo6.jpg', '/productDemo6.jpg', 6)
ON DUPLICATE KEY UPDATE `link` = VALUES(`link`);

-- -------------------------------------------------------
-- 7. TẠO TÀI KHOẢN ADMIN MẪU
-- -------------------------------------------------------
-- Tạo cart nếu user chưa tồn tại
INSERT INTO `cart` (`user_id`) 
SELECT NULL WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `phone_number` = '0999999999');
SET @new_admin_cart_id = LAST_INSERT_ID();

INSERT INTO `users` (`phone_number`, `full_name`, `is_active`, `cart_id`) 
VALUES ('0999999999', 'Quản Trị Viên (Admin)', 1, @new_admin_cart_id)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

SELECT `user_id`, `cart_id` INTO @admin_user_id, @admin_cart_id FROM `users` WHERE `phone_number` = '0999999999' LIMIT 1;
UPDATE `cart` SET `user_id` = @admin_user_id WHERE `cart_id` = @admin_cart_id;

-- Gán quyền ADMIN (role_id = 2) và USER (role_id = 1)
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES 
(@admin_user_id, 1), 
(@admin_user_id, 2);

-- -------------------------------------------------------
-- 8. TẠO TÀI KHOẢN KHÁCH HÀNG (USER THƯỜNG)
-- -------------------------------------------------------
INSERT INTO `cart` (`user_id`) 
SELECT NULL WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `phone_number` = '0988888888');
SET @new_user_cart_id = LAST_INSERT_ID();

INSERT INTO `users` (`phone_number`, `full_name`, `is_active`, `cart_id`) 
VALUES ('0988888888', 'Khách Hàng Mẫu (User)', 1, @new_user_cart_id)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

SELECT `user_id`, `cart_id` INTO @normal_user_id, @user_cart_id FROM `users` WHERE `phone_number` = '0988888888' LIMIT 1;
UPDATE `cart` SET `user_id` = @normal_user_id WHERE `cart_id` = @user_cart_id;

-- Gán duy nhất quyền USER (role_id = 1)
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES 
(@normal_user_id, 1);

-- Thêm sẵn địa chỉ giao hàng mẫu cho user này
INSERT INTO `address` (`street_name`, `ward_name`, `district_name`, `province_name`, `user_id`)
SELECT '789 Đường Nguyễn Huệ', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', @normal_user_id
WHERE NOT EXISTS (SELECT 1 FROM `address` WHERE `user_id` = @normal_user_id);

-- -------------------------------------------------------
-- 9. THÊM SẢN PHẨM MẪU VÀO GIỎ HÀNG CHO USER 0988888888
-- -------------------------------------------------------
-- Xóa giỏ hàng cũ trước khi nạp lại mẫu (tránh duplicate khi chạy lại script)
DELETE FROM `cart_detail` WHERE `cart_id` = @user_cart_id;

INSERT INTO `cart_detail` (`cart_id`, `product_id`, `quantity`, `price`) VALUES
(@user_cart_id, 1, 2, 149000), -- 2 Áo thun cotton
(@user_cart_id, 3, 1, 289000), -- 1 Túi xách da
(@user_cart_id, 6, 1, 135000); -- 1 Bình giữ nhiệt inox

-- -------------------------------------------------------
-- 10. ĐƠN HÀNG MẪU (ORDERS & ORDER_DETAILS) CHO USER 0988888888
-- -------------------------------------------------------
-- Làm sạch đơn hàng cũ của user này trước khi nạp mới (đảm bảo tính idempotent)
DELETE FROM `order_detail` WHERE `order_id` IN (SELECT `order_id` FROM `orders` WHERE `user_id` = @normal_user_id);
DELETE FROM `orders` WHERE `user_id` = @normal_user_id;

-- Đơn 1: PENDING (Chưa xử lý, vừa đặt 2 tiếng trước, chưa thanh toán)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'PENDING', 509000, 0, 0, '789 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 2 HOUR));
SET @order_1_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_1_id, 2, 1, 229000), -- 1 Váy hoa nhí
(@order_1_id, 4, 2, 125000); -- 2 Combo trà thảo mộc

-- Đơn 2: SHIPPING (Đang vận chuyển, đặt hôm qua, đã thanh toán & đã in phiếu đóng gói)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `date_in_bild`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'SHIPPING', 647000, 1, 1, NOW(), '789 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 1 DAY));
SET @order_2_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_2_id, 5, 1, 349000), -- 1 Giày sneaker thể thao
(@order_2_id, 1, 2, 149000); -- 2 Áo thun cotton

-- Đơn 3: DELIVERED (Đã giao thành công, 5 ngày trước, đã xuất bill)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `date_in_bild`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'DELIVERED', 559000, 1, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), 'Tòa nhà Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 5 DAY));
SET @order_3_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_3_id, 3, 1, 289000), -- 1 Túi xách da
(@order_3_id, 6, 2, 135000); -- 2 Bình giữ nhiệt inox

-- Đơn 4: CANCELLED (Đã hủy đơn hàng, 1 tuần trước)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'CANCELLED', 179000, 0, 0, '789 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 7 DAY));
SET @order_4_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_4_id, 1, 1, 149000); -- 1 Áo thun cotton

-- -------------------------------------------------------
-- 11. ĐÁNH INDEX TỐI ƯU HÓA TRUY VẤN (QUERY PERFORMANCE TUNING)
-- -------------------------------------------------------
-- Tăng tốc truy vấn lọc đơn hàng theo trạng thái, người dùng, ngày tạo
CREATE INDEX IF NOT EXISTS `idx_orders_status` ON `orders` (`status`);
CREATE INDEX IF NOT EXISTS `idx_orders_user_created` ON `orders` (`user_id`, `create_at`);
CREATE INDEX IF NOT EXISTS `idx_order_detail_order` ON `order_detail` (`order_id`);
CREATE INDEX IF NOT EXISTS `idx_cart_detail_cart` ON `cart_detail` (`cart_id`);
CREATE INDEX IF NOT EXISTS `idx_product_name` ON `product` (`product_name`);



