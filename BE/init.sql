-- ==============================================================================
-- SCRIPT KHỞI TẠO VÀ NẠP DỮ LIỆU MẪU (SEED DATA) CHO DỰ ÁN FASHION SHOP
-- Hỗ trợ: MySQL 8.0+ / MariaDB / HeidiSQL / DBeaver / Spring Boot Hibernate
-- ==============================================================================

-- Tắt kiểm tra khóa ngoại tạm thời để nạp dữ liệu an toàn và idempotent
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. TẠO DATABASE NẾU CHƯA CÓ
-- (Tùy chọn cho local) CREATE DATABASE IF NOT EXISTS `healthy_store` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `healthy_store`;

-- Lưu ý: Sau khi bật Backend lần đầu tiên, Hibernate sẽ tự tạo các bảng (product, type, role, image,...).
-- Sau khi bảng đã được tạo, bạn hãy chạy toàn bộ các lệnh bên dưới trong HeidiSQL / DBeaver / MySQL CLI.

-- Đảm bảo các bảng liên kết ManyToMany tồn tại
CREATE TABLE IF NOT EXISTS `user_role` (
  `user_id` INT NOT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  KEY `fk_ur_role` (`role_id`),
  CONSTRAINT `fk_ur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ur_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `product_product_type` (
  `product_id` INT NOT NULL,
  `type_id` INT NOT NULL,
  PRIMARY KEY (`product_id`, `type_id`),
  KEY `fk_ppt_type` (`type_id`),
  CONSTRAINT `fk_ppt_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ppt_type` FOREIGN KEY (`type_id`) REFERENCES `type` (`type_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TẠO ROLE MẶC ĐỊNH (Bắt buộc cho hệ thống Auth Spring Security)
-- ------------------------------------------------------------------------------
INSERT INTO `role` (`role_name`, `description`) 
SELECT 'USER', 'Người dùng thông thường'
WHERE NOT EXISTS (SELECT 1 FROM `role` WHERE `role_name` = 'USER');

INSERT INTO `role` (`role_name`, `description`) 
SELECT 'ADMIN', 'Quản trị viên hệ thống'
WHERE NOT EXISTS (SELECT 1 FROM `role` WHERE `role_name` = 'ADMIN');

-- Lấy ID động của các vai trò (tránh hardcode sai lệch ID)
SET @role_user_id = (SELECT `role_id` FROM `role` WHERE `role_name` = 'USER' LIMIT 1);
SET @role_admin_id = (SELECT `role_id` FROM `role` WHERE `role_name` = 'ADMIN' LIMIT 1);

-- ------------------------------------------------------------------------------
-- 3. TẠO DANH MỤC SẢN PHẨM (TYPES)
-- ------------------------------------------------------------------------------
INSERT INTO `type` (`type_id`, `type_name`, `image_url`) VALUES
(1, 'Thời Trang Nam', '/categories/men.jpg'),
(2, 'Thời Trang Nữ', '/categories/women.jpg'),
(3, 'Áo Khoác & Blazer', '/categories/outerwear.jpg'),
(4, 'Quần & Jeans', '/categories/jeans.jpg'),
(5, 'Phụ Kiện Thời Trang', '/categories/accessories.jpg'),
(6, 'Giày Dép & Sneaker', '/categories/shoes.jpg')
ON DUPLICATE KEY UPDATE 
    `type_name` = VALUES(`type_name`), 
    `image_url` = VALUES(`image_url`);

-- ------------------------------------------------------------------------------
-- 4. TẠO SẢN PHẨM MẪU (PRODUCTS - TỔNG CỘNG 8 SẢN PHẨM THỜI TRANG ĐA DẠNG)
-- ------------------------------------------------------------------------------
INSERT INTO `product` (`product_id`, `product_name`, `original_price`, `sale_price`, `quantity`, `description`, `ingredients`, `usage_instructions`, `manufacture_date`) VALUES
(1, 'Áo Thun Cotton Unisex Form Rộng Thoáng Khí', 250000, 149000, 100, 
    'Áo thun cotton 100% co giãn 4 chiều mềm mịn, thấm hút mồ hôi cực tốt phù hợp mặc hàng ngày.', 
    '100% Cotton tự nhiên', 
    'Giặt máy ở chế độ nhẹ, tránh dùng chất tẩy mạnh.', 
    '2026-01-01'),

(2, 'Váy Hoa Nhí Vintage Dáng Xòe Điệu Đà', 380000, 229000, 50, 
    'Đầm hoa nhí phong cách Hàn Quốc trẻ trung tôn dáng, chất liệu voan lụa mềm mại thướt tha.', 
    'Vải voan lụa cao cấp 2 lớp', 
    'Giặt tay hoặc giặt túi lưới để giữ form váy luôn như mới.', 
    '2026-01-15'),

(3, 'Túi Xách Da Đeo Chéo Nữ Thanh Lịch', 420000, 289000, 40, 
    'Thiết kế sang trọng, quai đeo điều chỉnh được, nhiều ngăn tiện lợi đi làm hoặc đi chơi dạo phố.', 
    'Da PU cao cấp chống xước chống thấm', 
    'Lau sạch bằng khăn ẩm mềm, tránh phơi nắng gắt trực tiếp.', 
    '2026-02-01'),

(4, 'Áo Khoác Blazer Nam Nữ Phong Cách Hàn Quốc', 550000, 389000, 80, 
    'Áo khoác blazer form suông hiện đại, chất vải tuyết mưa cao cấp đứng form, dễ phối đồ đi làm hoặc đi chơi.', 
    'Vải tuyết mưa dệt cao cấp 2 lớp chống nhăn', 
    'Giặt hấp hoặc giặt tay nhẹ nhàng, ủi ở nhiệt độ trung bình.', 
    '2026-03-01'),

(5, 'Giày Sneaker Thể Thao Năng Động Êm Chân', 550000, 349000, 60, 
    'Giày sneaker phong cách tối giản, đế cao su đàn hồi êm ái thích hợp chạy bộ và dạo phố.', 
    'Vải dệt thoáng khí + đế cao su non đúc nguyên khối', 
    'Vệ sinh bằng bàn chải mềm và dung dịch vệ sinh giày chuyên dụng.', 
    '2026-02-20'),

(6, 'Quần Jean Slimfit Co Giãn Cao Cấp HALOKAKI', 450000, 299000, 85, 
    'Quần jean nam nữ dáng slimfit ôm vừa vặn, chất liệu denim co giãn 4 chiều mềm mại, bền màu sau nhiều lần giặt.', 
    '98% Cotton Denim dệt chéo, 2% Spandex co giãn', 
    'Giặt mặt trái bằng nước lạnh, phơi trong bóng râm tránh ánh nắng gắt.', 
    '2026-03-10'),

(7, 'Áo Khoác Gió Thể Thao Chống Nước Bomber HALOKAKI', 390000, 269000, 80, 
    'Áo khoác dù gió phong cách thể thao năng động, cản gió và trượt nước tốt, lót lưới thoáng khí mặc siêu nhẹ.', 
    'Vải dù Polyester tráng PU trượt nước, lót lưới thoáng khí', 
    'Giặt tay hoặc giặt máy chế độ nhẹ, không dùng chất tẩy clo.', 
    '2026-02-15'),

(8, 'Áo Sơ Mi Nam Oxford Trắng Dài Tay Cao Cấp', 420000, 289000, 70, 
    'Áo sơ mi nam Oxford chất vải dày dặn, đứng form chuẩn regular fit thanh lịch phù hợp cho công sở, hội họp và các sự kiện trang trọng.', 
    '100% Cotton Oxford dệt chải kỹ cao cấp chống nhăn nhẹ', 
    'Giặt máy ở nhiệt độ thường với đồ cùng tông màu, ủi ở nhiệt độ trung bình.', 
    '2026-03-05')
ON DUPLICATE KEY UPDATE 
    `product_name` = VALUES(`product_name`),
    `original_price` = VALUES(`original_price`),
    `sale_price` = VALUES(`sale_price`),
    `quantity` = VALUES(`quantity`),
    `description` = VALUES(`description`),
    `ingredients` = VALUES(`ingredients`),
    `usage_instructions` = VALUES(`usage_instructions`),
    `manufacture_date` = VALUES(`manufacture_date`);

-- ------------------------------------------------------------------------------
-- 5. LIÊN KẾT SẢN PHẨM VỚI DANH MỤC (PRODUCT_PRODUCT_TYPE)
-- ------------------------------------------------------------------------------
INSERT IGNORE INTO `product_product_type` (`product_id`, `type_id`) VALUES
(1, 1), -- Áo Thun Cotton -> Thời Trang Nam
(2, 2), -- Váy Hoa Nhí -> Thời Trang Nữ
(3, 5), -- Túi Xách Da -> Phụ Kiện Thời Trang
(4, 3), -- Áo Khoác Blazer -> Áo Khoác & Blazer
(5, 6), -- Giày Sneaker -> Giày Dép & Sneaker
(6, 4), -- Quần Jean -> Quần & Jeans
(7, 3), -- Áo Khoác Gió Bomber -> Áo Khoác & Blazer
(8, 1); -- Áo Sơ Mi Oxford -> Thời Trang Nam

-- ------------------------------------------------------------------------------
-- 6. HÌNH ẢNH SẢN PHẨM (IMAGES - Khớp với thư mục FE /public)
-- ------------------------------------------------------------------------------
INSERT INTO `image` (`image_id`, `image_name`, `link`, `product_id`) VALUES
(1, 'productDemo1.jpg', '/productDemo1.jpg', 1),
(2, 'productDemo2.jpg', '/productDemo2.jpg', 2),
(3, 'productDemo3.jpg', '/productDemo3.jpg', 3),
(4, 'productDemo4.jpg', '/productDemo4.jpg', 4),
(5, 'productDemo5.jpg', '/productDemo5.jpg', 5),
(6, 'productDemo6.jpg', '/productDemo6.jpg', 6),
(7, 'productDemo7.jpg', '/productDemo7.jpg', 7),
(8, 'productDemo8.jpg', '/productDemo8.jpg', 8)
ON DUPLICATE KEY UPDATE 
    `image_name` = VALUES(`image_name`),
    `link` = VALUES(`link`),
    `product_id` = VALUES(`product_id`);

-- ------------------------------------------------------------------------------
-- 7. TẠO TÀI KHOẢN ADMIN MẪU (0999999999)
-- ------------------------------------------------------------------------------
-- 7.1 Tạo Cart trước nếu User chưa tồn tại
INSERT INTO `cart` (`user_id`) 
SELECT NULL FROM DUAL 
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `phone_number` = '0999999999');

-- 7.2 Lấy ID Cart của Admin
SET @admin_cart_id = (SELECT `cart_id` FROM `users` WHERE `phone_number` = '0999999999');
SET @admin_cart_id = COALESCE(@admin_cart_id, LAST_INSERT_ID());

-- 7.3 Tạo hoặc cập nhật thông tin Admin (Mật khẩu mặc định: 123456)
INSERT INTO `users` (`phone_number`, `full_name`, `password`, `is_active`, `cart_id`) 
VALUES ('0999999999', 'Quản Trị Viên (Admin)', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGPEWiSGQ8PQxCV.e', 1, @admin_cart_id)
ON DUPLICATE KEY UPDATE 
    `full_name` = VALUES(`full_name`),
    `password` = VALUES(`password`),
    `is_active` = VALUES(`is_active`);

SET @admin_user_id = (SELECT `user_id` FROM `users` WHERE `phone_number` = '0999999999' LIMIT 1);
UPDATE `cart` SET `user_id` = @admin_user_id WHERE `cart_id` = @admin_cart_id;

-- 7.4 Gán quyền USER và ADMIN cho tài khoản Admin
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES 
(@admin_user_id, @role_user_id), 
(@admin_user_id, @role_admin_id);

-- ------------------------------------------------------------------------------
-- 8. TẠO TÀI KHOẢN KHÁCH HÀNG (0988888888 - Mật khẩu mặc định: 123456)
-- ------------------------------------------------------------------------------
-- 8.1 Tạo Cart trước nếu User chưa tồn tại
INSERT INTO `cart` (`user_id`) 
SELECT NULL FROM DUAL 
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE `phone_number` = '0988888888');

-- 8.2 Lấy ID Cart của Khách hàng
SET @user_cart_id = (SELECT `cart_id` FROM `users` WHERE `phone_number` = '0988888888');
SET @user_cart_id = COALESCE(@user_cart_id, LAST_INSERT_ID());

-- 8.3 Tạo hoặc cập nhật thông tin Khách hàng
INSERT INTO `users` (`phone_number`, `full_name`, `password`, `is_active`, `cart_id`) 
VALUES ('0988888888', 'Khách Hàng Mẫu (User)', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGPEWiSGQ8PQxCV.e', 1, @user_cart_id)
ON DUPLICATE KEY UPDATE 
    `full_name` = VALUES(`full_name`),
    `password` = VALUES(`password`),
    `is_active` = VALUES(`is_active`);

SET @normal_user_id = (SELECT `user_id` FROM `users` WHERE `phone_number` = '0988888888' LIMIT 1);
UPDATE `cart` SET `user_id` = @normal_user_id WHERE `cart_id` = @user_cart_id;

-- 8.4 Gán quyền USER cho Khách hàng
INSERT IGNORE INTO `user_role` (`user_id`, `role_id`) VALUES 
(@normal_user_id, @role_user_id);

-- 8.5 Thêm địa chỉ giao hàng mặc định cho Khách hàng
INSERT INTO `address` (`street_name`, `ward_name`, `district_name`, `province_name`, `user_id`)
SELECT '789 Đường Nguyễn Huệ', 'Phường Bến Nghé', 'Quận 1', 'TP. Hồ Chí Minh', @normal_user_id
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `address` WHERE `user_id` = @normal_user_id);

-- ------------------------------------------------------------------------------
-- 9. THÊM SẢN PHẨM MẪU VÀO GIỎ HÀNG CHO USER 0988888888
-- ------------------------------------------------------------------------------
-- Làm sạch giỏ hàng cũ trước khi nạp mới (đảm bảo idempotent)
DELETE FROM `cart_detail` WHERE `cart_id` = @user_cart_id;

INSERT INTO `cart_detail` (`cart_id`, `product_id`, `quantity`, `price`) VALUES
(@user_cart_id, 1, 2, 149000), -- 2 Áo thun cotton
(@user_cart_id, 3, 1, 289000), -- 1 Túi xách da
(@user_cart_id, 7, 1, 259000), -- 1 Serum Aurora cấp ẩm
(@user_cart_id, 8, 1, 289000); -- 1 Áo sơ mi nam Oxford

-- ------------------------------------------------------------------------------
-- 10. ĐƠN HÀNG MẪU (ORDERS & ORDER_DETAILS) CHO USER 0988888888
-- Quy tắc tính cước: Subtotal >= 500k -> Freeship; Subtotal < 500k -> +30,000đ
-- ------------------------------------------------------------------------------
-- Xóa sạch chi tiết đơn và đơn cũ của user mẫu
DELETE od FROM `order_detail` od
JOIN `orders` o ON od.`order_id` = o.`order_id`
WHERE o.`user_id` = @normal_user_id;

DELETE FROM `orders` WHERE `user_id` = @normal_user_id;

-- Đơn 1: PENDING (Chưa xử lý, đặt 2 giờ trước, COD, chưa thanh toán)
-- Subtotal: 229,000 + 259,000 = 488,000 (< 500k => +30k ship = 518,000)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'PENDING', 518000, 0, 0, '789 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 2 HOUR));
SET @order_1_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_1_id, 2, 1, 229000), -- 1 Váy hoa nhí
(@order_1_id, 7, 1, 259000); -- 1 Serum Aurora

-- Đơn 2: SHIPPING (Đang vận chuyển, đặt hôm qua, đã thanh toán & đã in phiếu đóng gói)
-- Subtotal: 349,000 + 289,000 = 638,000 (>= 500k => Freeship = 638,000)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `date_in_bild`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'SHIPPING', 638000, 1, 1, NOW(), '789 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 1 DAY));
SET @order_2_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_2_id, 5, 1, 349000), -- 1 Giày sneaker thể thao
(@order_2_id, 8, 1, 289000); -- 1 Áo sơ mi nam Oxford

-- Đơn 3: DELIVERED (Đã giao thành công, 5 ngày trước, đã thanh toán & đã in bill)
-- Subtotal: 289,000 + (2 x 135,000) = 559,000 (>= 500k => Freeship = 559,000)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `date_in_bild`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'DELIVERED', 559000, 1, 1, DATE_SUB(NOW(), INTERVAL 4 DAY), 'Tòa nhà Bitexco, 2 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 5 DAY));
SET @order_3_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_3_id, 3, 1, 289000), -- 1 Túi xách da
(@order_3_id, 6, 2, 135000); -- 2 Bình giữ nhiệt inox

-- Đơn 4: CANCELLED (Đã hủy đơn hàng, 1 tuần trước)
-- Subtotal: 149,000 (< 500k => +30k ship = 179,000)
INSERT INTO `orders` (`user_id`, `status`, `total_price`, `is_pay`, `is_bill`, `shipping_address`, `phone_number`, `create_at`) 
VALUES (@normal_user_id, 'CANCELLED', 179000, 0, 0, '789 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', '0988888888', DATE_SUB(NOW(), INTERVAL 7 DAY));
SET @order_4_id = LAST_INSERT_ID();

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `price`) VALUES
(@order_4_id, 1, 1, 149000); -- 1 Áo thun cotton

-- ------------------------------------------------------------------------------
-- 11. ĐÁNH GIÁ & BÌNH LUẬN MẪU (COMMENTS / REVIEWS)
-- Giúp trang chi tiết sản phẩm hiển thị sống động ngay khi khởi động
-- ------------------------------------------------------------------------------
DELETE FROM `comment` WHERE `user_id` = @normal_user_id;

INSERT INTO `comment` (`user_id`, `product_id`, `rating`, `content`, `created_at`, `updated_at`) VALUES
(@normal_user_id, 1, 5, 'Áo chất cotton cực kỳ mềm mát, form rộng mặc rất thoải mái và chuẩn style unisex!', DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(@normal_user_id, 2, 5, 'Váy hoa nhí mặc lên dáng rất xinh xắn, vải voan 2 lớp kín đáo, đường kim mũi chỉ chắc chắn.', DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),
(@normal_user_id, 7, 5, 'Serum cấp ẩm và thấm rất nhanh, không hề bết rít da. Sau 1 tuần sử dụng da căng mướt rõ rệt!', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(@normal_user_id, 8, 5, 'Áo sơ mi Oxford chất vải dệt đứng form, màu trắng sáng thanh lịch, mặc đi làm rất ưng ý.', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- ------------------------------------------------------------------------------
-- 12. ĐÁNH INDEX TỐI ƯU HÓA TRUY VẤN (QUERY PERFORMANCE TUNING)
-- ------------------------------------------------------------------------------
CREATE INDEX `idx_orders_status` ON `orders` (`status`);
CREATE INDEX `idx_orders_user_created` ON `orders` (`user_id`, `create_at`);
CREATE INDEX `idx_order_detail_order` ON `order_detail` (`order_id`);
CREATE INDEX `idx_cart_detail_cart` ON `cart_detail` (`cart_id`);
-- Với cột kiểu TEXT (product_name), bắt buộc chỉ định prefix length (191) để tương thích triệt để MySQL utf8mb4
CREATE INDEX `idx_product_name` ON `product` (`product_name`(191));
CREATE INDEX `idx_comment_product` ON `comment` (`product_id`);

-- Bật lại kiểm tra khóa ngoại sau khi hoàn tất
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 13. KIỂM TRA TỔNG QUAN DỮ LIỆU ĐÃ NẠP
-- ------------------------------------------------------------------------------
SELECT 
    (SELECT COUNT(*) FROM `product`) AS total_products,
    (SELECT COUNT(*) FROM `type`) AS total_categories,
    (SELECT COUNT(*) FROM `image`) AS total_images,
    (SELECT COUNT(*) FROM `users`) AS total_users,
    (SELECT COUNT(*) FROM `orders`) AS total_orders,
    (SELECT COUNT(*) FROM `comment`) AS total_reviews;
