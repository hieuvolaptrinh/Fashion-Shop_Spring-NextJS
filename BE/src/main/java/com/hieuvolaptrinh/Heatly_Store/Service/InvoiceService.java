package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Repository.OrderRepository;
import com.hieuvolaptrinh.Heatly_Store.Response.InvoiceItemResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.InvoiceResponse;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import jakarta.transaction.Transactional;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.apache.pdfbox.multipdf.PDFMergerUtility;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@Service
public class InvoiceService {
    private final OrderRepository orderRepo;

    public InvoiceService(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    /**
     * Lấy dữ liệu hoá đơn chung
     */
    public InvoiceResponse getInvoiceData(Integer orderId) {
        Order o = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order không tồn tại: " + orderId));
        InvoiceResponse dto = new InvoiceResponse();
        dto.setOrderId(o.getOrderId());
        dto.setCreateAt(o.getCreateAt());
        dto.setCustomerName(o.getUser().getFullName());
        dto.setCustomerPhone(o.getPhoneNumber());
        dto.setShippingAddress(o.getShippingAddress().toString());
        List<InvoiceItemResponse> items = o.getOrderDetails().stream().map(d -> {
            InvoiceItemResponse it = new InvoiceItemResponse();
            it.setProductId(d.getProduct().getProductId());
            // Nếu có combo thì lấy tên combo, nếu không thì lấy tên sản phẩm
            if (d.getCombo() != null) {
                it.setProductName(d.getCombo().getComboDescription());
            } else {
                it.setProductName(d.getProduct().getProductName());
            }
            it.setQuantity(d.getQuantity());
            it.setUnitPrice(d.getPrice());
            it.setLineTotal(d.getQuantity() * d.getPrice());
            return it;
        }).collect(Collectors.toList());
        dto.setItems(items);
        dto.setTotalPrice(items.stream()
                .mapToDouble(InvoiceItemResponse::getLineTotal)
                .sum());
        return dto;
    }

    //  func lọc kí tự đặc biệt
    public String cleanText(String input, PDType0Font font) throws IOException {
        if (input == null) return "";
        //  Loại ký tự đặc biệt bằng regex
        String result = input.replaceAll("[^\\p{L}\\p{Nd}\\p{P}\\p{Z}]", "");
        return result.toString();
    }
    // random mã hoa đơn
    public String randomUpperLetters(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        StringBuilder sb = new StringBuilder();
        java.util.Random rand = new java.util.Random();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(rand.nextInt(chars.length())));
        }
        return sb.toString();
    }

    /**
     * Tạo PDF hóa đơn bán hàng
     */
    public byte[] renderProductInvoicePdf(InvoiceResponse inv) {
        try (PDDocument doc = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            InputStream fontRegularStream = getClass().getResourceAsStream("/fonts/FreeSans.ttf");
            InputStream fontBoldStream = getClass().getResourceAsStream("/fonts/FreeSansBold.ttf");
            PDType0Font fontRegular = PDType0Font.load(doc, fontRegularStream, true);
            PDType0Font fontBold = PDType0Font.load(doc, fontBoldStream, true);

            SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm");

            int stt = 1;
            int itemIndex = 0;
            List<InvoiceItemResponse> items = inv.getItems();

            float margin = 10;
            float minY = 60;
            float[] colWidths = {15, 75, 15, 35};
            String[] headers = {"STT", "TÊN SẢN PHẨM", "SL", "TỔNG TIỀN"};

            boolean isFirstPage = true;

            do {
                PDPage page = new PDPage(new PDRectangle(162, 283));
                doc.addPage(page);
                PDPageContentStream cs = new PDPageContentStream(doc, page);
                float y = 275;
                float centerX = 81;

                if (isFirstPage) {
                    y -= 5;
                    showTextCentered(cs, "LAN CHUYÊN HÀNG SALE", fontBold, 8, y, centerX);
                    y -= 10;
                    showTextCentered(cs, "Fapage: https://www.facebook.com/shopmonglan", fontRegular, 6, y, centerX);
                    y -= 8;
                    showTextCentered(cs, "Hotline: 0931133128", fontRegular, 6, y, centerX);
                    y -= 11;
                    showTextCentered(cs, "XỬ LÝ ĐƠN 0931133128 - 0819314893", fontRegular, 6, y, centerX);
                    y -= 8;
                    drawLine(cs, margin, y, 142, 0.5f, 0.7f);
                    y -= 12;
                    showTextCentered(cs, "HÓA ĐƠN BÁN HÀNG", fontBold, 9, y, centerX);
                    y -= 4;
                    drawLine(cs, margin, y, 142, 0.5f, 0.7f);
                    y -= 8;

                    float col1X = margin;
                    drawLabelValue(cs, "Mã HĐ:", "INV00" +randomUpperLetters(3) + inv.getOrderId(), col1X, y, fontBold, fontRegular, 25, 7);
                    y -= 8;
                    drawLabelValue(cs, "Ngày:", sdf.format(inv.getCreateAt()), col1X, y, fontBold, fontRegular, 25, 7);
                    y -= 8;
                    drawLabelValue(cs, "Khách:", inv.getCustomerName(), col1X, y, fontBold, fontRegular, 25, 7);
                    y -= 8;
                    y = drawWrappedLabelValue(cs, "ĐC:", inv.getShippingAddress(), col1X, y, fontBold, fontRegular, 25, 7, 140);
                    y -= 2;
                    drawLabelValue(cs, "ĐT:", inv.getCustomerPhone(), col1X, y, fontBold, fontRegular, 25, 7);
                    y -= 12;

                    cs.beginText();
                    cs.setFont(fontBold, 7);
                    cs.newLineAtOffset(margin, y);
                    cs.showText("* DANH SÁCH SẢN PHẨM");
                    cs.endText();
                    y -= 8;
                }

                // Header bảng
                cs.setNonStrokingColor(230, 230, 230);
                cs.addRect(margin, y - 10, 142, 10);
                cs.fill();
                cs.setNonStrokingColor(0, 0, 0);

                cs.beginText();
                cs.setFont(fontBold, 6);
                cs.newLineAtOffset(margin, y - 7);
                for (int i = 0; i < headers.length; i++) {
                    cs.showText(headers[i]);
                    cs.newLineAtOffset(colWidths[i], 0);
                }
                cs.endText();
                y -= 16;

                // Danh sách sản phẩm
                while (itemIndex < items.size()) {
                    InvoiceItemResponse it = items.get(itemIndex);
                    String cleanedProductName = cleanText(it.getProductName(), fontRegular);
                    List<String> productNameLines = wrapText(cleanedProductName, fontRegular, 6, colWidths[1]);
                    int linesCount = productNameLines.size();
                    float rowHeight = linesCount * 9 + 4;

                    if (y - rowHeight < minY)
                        break;

                    float x = margin;

                    cs.beginText();
                    cs.setFont(fontRegular, 6);
                    cs.newLineAtOffset(x, y);
                    cs.showText(String.valueOf(stt++));
                    x += colWidths[0];

                    cs.newLineAtOffset(colWidths[0], 0);
                    cs.showText(productNameLines.get(0));
                    x += colWidths[1];

                    cs.newLineAtOffset(colWidths[1], 0);
                    cs.showText(it.getQuantity().toString());
                    x += colWidths[2];

                    cs.newLineAtOffset(colWidths[2], 0);
                    cs.showText(String.format("%,.0f VNĐ", it.getLineTotal()));
                    cs.endText();

                    for (int i = 1; i < linesCount; i++) {
                        y -= 9;
                        cs.beginText();
                        cs.setFont(fontRegular, 6);
                        cs.newLineAtOffset(margin + colWidths[0], y);
                        cs.showText(productNameLines.get(i));
                        cs.endText();
                    }

                    drawLine(cs, margin, y - 4, 142, 0.3f, 0.8f);
                    y -= 12;
                    itemIndex++;
                }

                // Nếu in hết toàn bộ sản phẩm => in phần tổng kết
                if (itemIndex >= items.size()) {
                    drawLine(cs, margin, y - 5, 142, 0.5f, 0.7f);
                    y -= 14;

                    // Phí vận chuyển
                    double subtotal = inv.getTotalPrice();
                    double shippingFee = (subtotal > 500000 || subtotal == 0) ? 0 : 30000;

                    cs.beginText();
                    cs.setFont(fontBold, 5);
                    cs.newLineAtOffset(margin, y);
                    cs.showText("Phí vận chuyển:");
                    cs.endText();
                    showTextRightAligned(cs, shippingFee == 0 ? "0 VND (Miễn phí)" : String.format("%,.0f VND", shippingFee), fontBold, 5, 10, y);
                    y -= 12;

                    // Tổng cộng
                    cs.beginText();
                    cs.setFont(fontBold, 7);
                    cs.newLineAtOffset(margin, y);
                    cs.showText("TỔNG CỘNG:");
                    cs.endText();
                    showTextRightAligned(cs, String.format("%,.0f VND", subtotal + shippingFee), fontBold, 8, 10, y);
                    y -= 15;

                    showTextCentered(cs, "Cảm ơn quý khách!", fontRegular, 5, y, centerX);
                    y -= 6;
                    showTextCentered(cs, "Hóa đơn điện tử - Không cần ký", fontRegular, 5, y, centerX);
                    y -= 6;
                    showTextCentered(cs, "In lúc: " + sdf.format(new java.util.Date()), fontRegular, 5, y, centerX);
                }

                cs.close();
                isFirstPage = false;
            } while (itemIndex < items.size());

            doc.save(baos);
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tạo hóa đơn nhiều trang", e);
        }
    }

    // in 1 đơn
    public byte[] generatePdfAndMark(Integer orderId) {
        InvoiceResponse inv = getInvoiceData(orderId);
        byte[] pdf = renderProductInvoicePdf(inv);
        Order o = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order không tồn tại: " + orderId));
        o.setBill(true);
        orderRepo.save(o);
        return pdf;
    }

    // in nhiều đơn
    public byte[] generateMultipleInvoicesPdf(List<Integer> orderIds) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    System.out.println("Đang xử lý hóa đơn orderId = " + orderId);

                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        System.err.println("PDF rỗng cho orderId: " + orderId);
                        continue;
                    }

                    // merge bằng stream
                    merger.addSource(new java.io.ByteArrayInputStream(singlePdf));

                } catch (Exception ex) {
                    System.err.println("Lỗi orderId = " + orderId);
                    ex.printStackTrace();
                    // tiếp tục các hóa đơn còn lại
                }
            }

            merger.mergeDocuments(null); // merge tất cả vào baos
            return baos.toByteArray();

        } catch (IOException e) {
            System.err.println("Lỗi khi tạo PDF nhiều hóa đơn:");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // in tất cả các đơn
    public byte[] generateAllInvoicesPdf() {
        List<Integer> orderIds = orderRepo.findAll().stream()
                .map(Order::getOrderId)
                .collect(Collectors.toList());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    System.out.println("Đang xử lý hóa đơn orderId = " + orderId);

                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        System.err.println("PDF rỗng cho orderId: " + orderId);
                        continue;
                    }

                    // merge bằng stream
                    merger.addSource(new java.io.ByteArrayInputStream(singlePdf));

                } catch (Exception ex) {
                    System.err.println("Lỗi orderId = " + orderId);
                    ex.printStackTrace();
                    // tiếp tục các hóa đơn còn lại
                }
            }

            merger.mergeDocuments(null); // merge tất cả vào baos
            return baos.toByteArray();

        } catch (IOException e) {
            System.err.println("Lỗi khi tạo PDF nhiều hóa đơn:");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // in đơn hàng trạng thái delivered
    public byte[] generatebyDeliverInvoicesPdf() {
        List<Integer> orderIds = orderRepo.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatusEnum.DELIVERED)
                .map(Order::getOrderId)
                .collect(Collectors.toList());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    System.out.println("Đang xử lý hóa đơn orderId = " + orderId);

                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        System.err.println("PDF rỗng cho orderId: " + orderId);
                        continue;
                    }

                    // merge bằng stream
                    merger.addSource(new java.io.ByteArrayInputStream(singlePdf));

                } catch (Exception ex) {
                    System.err.println("Lỗi orderId = " + orderId);
                    ex.printStackTrace();
                    // tiếp tục các hóa đơn còn lại
                }
            }

            merger.mergeDocuments(null); // merge tất cả vào baos
            return baos.toByteArray();

        } catch (IOException e) {
            System.err.println("Lỗi khi tạo PDF nhiều hóa đơn:");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // in đơn hàng trạng thái shipping
    public byte[] generatebyShippingInvoicesPdf() {
        List<Integer> orderIds = orderRepo.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatusEnum.SHIPPING)
                .map(Order::getOrderId)
                .collect(Collectors.toList());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    System.out.println("⚙️ Đang xử lý hóa đơn orderId = " + orderId);

                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        System.err.println("PDF rỗng cho orderId: " + orderId);
                        continue;
                    }

                    // merge bằng stream
                    merger.addSource(new java.io.ByteArrayInputStream(singlePdf));

                } catch (Exception ex) {
                    System.err.println("Lỗi orderId = " + orderId);
                    ex.printStackTrace();
                    // tiếp tục các hóa đơn còn lại
                }
            }

            merger.mergeDocuments(null); // merge tất cả vào baos
            return baos.toByteArray();

        } catch (IOException e) {
            System.err.println(" Lỗi khi tạo PDF nhiều hóa đơn:");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // in đơn hàng trạng thái cancelled
    public byte[] generatebyCancleInvoicesPdf() {
        List<Integer> orderIds = orderRepo.findAll().stream()
                .filter(o -> o.getStatus() == OrderStatusEnum.CANCELLED)
                .map(Order::getOrderId)
                .collect(Collectors.toList());

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    System.out.println("⚙️ Đang xử lý hóa đơn orderId = " + orderId);

                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        System.err.println("PDF rỗng cho orderId: " + orderId);
                        continue;
                    }

                    // merge bằng stream
                    merger.addSource(new java.io.ByteArrayInputStream(singlePdf));

                } catch (Exception ex) {
                    System.err.println("Lỗi orderId = " + orderId);
                    ex.printStackTrace();
                    // tiếp tục các hóa đơn còn lại
                }
            }

            merger.mergeDocuments(null); // merge tất cả vào baos
            return baos.toByteArray();

        } catch (IOException e) {
            System.err.println(" Lỗi khi tạo PDF nhiều hóa đơn:");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // In đơn theo trạng thái đã in hay chưa in

    public byte[] generateInvoicesByPrintedStatus(boolean isbill) {
        List<Integer> orderIds = orderRepo.findAll().stream()
                .filter(o -> o.isBill() == isbill)
                .map(Order::getOrderId)
                .collect(Collectors.toList());
        // orderIds.forEach(o -> {
        // Order order = orderRepo.findById(o).get();
        // order.setBill(true);
        // orderRepo.save(order);
        // });
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    System.out.println("Đang xử lý hóa đơn orderId = " + orderId);
                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        System.err.println("PDF rỗng cho orderId: " + orderId);
                        continue;
                    }
                    merger.addSource(new ByteArrayInputStream(singlePdf));
                } catch (Exception ex) {
                    System.err.println("Lỗi orderId = " + orderId);
                    ex.printStackTrace();
                }
            }

            merger.mergeDocuments(null);
            return baos.toByteArray();
        } catch (IOException e) {
            System.err.println("Lỗi khi tạo PDF nhiều hóa đơn:");
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // helper method
    private float drawWrappedLabelValue(PDPageContentStream cs, String label, String value,
                                        float x, float y, PDType0Font labelFont, PDType0Font valueFont,
                                        float offsetX, float fontSize, float maxWidth) throws IOException {
        float valueMaxWidth = maxWidth - offsetX;
        List<String> wrappedLines = wrapText(value, valueFont, fontSize, valueMaxWidth);

        cs.beginText();
        cs.setFont(labelFont, fontSize);
        cs.newLineAtOffset(x, y);
        cs.showText(label);
        cs.endText();

        for (String line : wrappedLines) {
            cs.beginText();
            cs.setFont(valueFont, fontSize);
            cs.newLineAtOffset(x + offsetX, y);
            cs.showText(line);
            cs.endText();
            y -= fontSize + 1;
        }
        return y;
    }

    private List<String> wrapText(String text, PDType0Font font, float fontSize, float maxWidth) throws IOException {
        List<String> lines = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder line = new StringBuilder();
        for (String word : words) {
            String candidate = line.length() == 0 ? word : line + " " + word;
            float width = font.getStringWidth(candidate) / 1000 * fontSize;

            if (width > maxWidth) {
                if (line.length() > 0)
                    lines.add(line.toString());
                line = new StringBuilder(word);
            } else {
                line = new StringBuilder(candidate);
            }
        }
        if (line.length() > 0)
            lines.add(line.toString());

        return lines;
    }

    @Transactional
    public void updateBillStatus(List<Integer> orderIds) {
        List<Order> orders = orderRepo.findAllById(orderIds);
        if (orders.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng nào");
        }
        orders.forEach(o -> o.setBill(true));
        orderRepo.saveAll(orders);
    }

    // helper method vẽ giao diện hóa đơn
    private void showTextCentered(PDPageContentStream cs, String text,
                                  PDType0Font font, float fontSize, float y, float centerX) throws IOException {
        float textWidth = font.getStringWidth(text) / 1000 * fontSize;
        float startX = centerX - textWidth / 2;
        cs.beginText();
        cs.setFont(font, fontSize);
        cs.newLineAtOffset(startX, y);
        cs.showText(text);
        cs.endText();
    }

    private void showTextRightAligned(PDPageContentStream cs, String text,
                                      PDType0Font font, float fontSize, float rightMargin, float y) throws IOException {
        float textWidth = font.getStringWidth(text) / 1000 * fontSize;
        float startX = 162 - rightMargin - textWidth;
        cs.beginText();
        cs.setFont(font, fontSize);
        cs.newLineAtOffset(startX, y);
        cs.showText(text);
        cs.endText();
    }

    private void drawLabelValue(PDPageContentStream cs, String label, String value,
                                float x, float y, PDType0Font labelFont, PDType0Font valueFont,
                                float offsetX, float fontSize) throws IOException {
        cs.beginText();
        cs.setFont(labelFont, fontSize);
        cs.newLineAtOffset(x, y);
        cs.showText(label);
        cs.endText();

        cs.beginText();
        cs.setFont(valueFont, fontSize);
        cs.newLineAtOffset(x + offsetX, y);
        cs.showText(value);
        cs.endText();
    }

    private void drawLine(PDPageContentStream cs, float x, float y, float length, float thickness, float gray)
            throws IOException {
        cs.setLineWidth(thickness);
        cs.setStrokingColor(gray);
        cs.moveTo(x, y);
        cs.lineTo(x + length, y);
        cs.stroke();
        cs.setStrokingColor(0);
    }

}