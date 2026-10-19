package com.hieuvolaptrinh.Heatly_Store.Service;

import com.hieuvolaptrinh.Heatly_Store.Model.Order;
import com.hieuvolaptrinh.Heatly_Store.Repository.OrderRepository;
import com.hieuvolaptrinh.Heatly_Store.Response.InvoiceItemResponse;
import com.hieuvolaptrinh.Heatly_Store.Response.InvoiceResponse;
import com.hieuvolaptrinh.Heatly_Store.Util.Enum.OrderStatusEnum;
import org.springframework.transaction.annotation.Transactional;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.server.ResponseStatusException;
import org.apache.pdfbox.multipdf.PDFMergerUtility;

import java.awt.Color;
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
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(InvoiceService.class);

    @Value("${app.store.name:HALOKAKI}")
    private String storeName;

    @Value("${app.store.hotline:0931133128}")
    private String storeHotline;

    @Value("${app.store.order-phones:0931133128 - 0819314893}")
    private String storeOrderPhones;

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
        return convertOrderToInvoiceResponse(o);
    }

    /**
     * Chuyển đổi Order entity sang InvoiceResponse (tái sử dụng, tránh query lặp lại)
     */
    public InvoiceResponse convertOrderToInvoiceResponse(Order o) {
        InvoiceResponse dto = new InvoiceResponse();
        dto.setOrderId(o.getOrderId());
        dto.setCreateAt(o.getCreateAt());
        dto.setCustomerName(o.getUser() != null ? o.getUser().getFullName() : "Khách hàng");
        dto.setCustomerPhone(o.getPhoneNumber());
        dto.setShippingAddress(o.getShippingAddress() != null ? o.getShippingAddress().toString() : "");
        List<InvoiceItemResponse> items = o.getOrderDetails() != null ? o.getOrderDetails().stream().map(d -> {
            InvoiceItemResponse it = new InvoiceItemResponse();
            if (d.getProduct() != null) {
                it.setProductId(d.getProduct().getProductId());
            }
            if (d.getCombo() != null) {
                it.setProductName(d.getCombo().getComboDescription());
            } else if (d.getProduct() != null) {
                it.setProductName(d.getProduct().getProductName());
            } else {
                it.setProductName("Sản phẩm");
            }
            it.setQuantity(d.getQuantity());
            it.setUnitPrice(d.getPrice());
            it.setLineTotal(d.getQuantity() * d.getPrice());
            return it;
        }).collect(Collectors.toList()) : new ArrayList<>();
        dto.setItems(items);
        dto.setTotalPrice(items.stream()
                .mapToDouble(InvoiceItemResponse::getLineTotal)
                .sum());
        return dto;
    }

    public String cleanText(String input, PDType0Font font) throws IOException {
        if (input == null) return "";
        String result = input.replaceAll("[^\\p{L}\\p{Nd}\\p{P}\\p{Z}]", "");
        return result.toString();
    }

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
                    showTextCentered(cs, storeName, fontBold, 8, y, centerX);
                    y -= 10;
                    showTextCentered(cs, "Hotline: " + storeHotline, fontRegular, 6, y, centerX);
                    y -= 8;
                    showTextCentered(cs, "XỬ LÝ ĐƠN: " + storeOrderPhones, fontRegular, 6, y, centerX);
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

                cs.setNonStrokingColor(new Color(230, 230, 230));
                cs.addRect(margin, y - 10, 142, 10);
                cs.fill();
                cs.setNonStrokingColor(Color.BLACK);

                cs.beginText();
                cs.setFont(fontBold, 6);
                cs.newLineAtOffset(margin, y - 7);
                for (int i = 0; i < headers.length; i++) {
                    cs.showText(headers[i]);
                    cs.newLineAtOffset(colWidths[i], 0);
                }
                cs.endText();
                y -= 16;

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

                if (itemIndex >= items.size()) {
                    drawLine(cs, margin, y - 5, 142, 0.5f, 0.7f);
                    y -= 14;

                    double subtotal = inv.getTotalPrice();
                    double shippingFee = (subtotal > 500000 || subtotal == 0) ? 0 : 30000;

                    cs.beginText();
                    cs.setFont(fontBold, 5);
                    cs.newLineAtOffset(margin, y);
                    cs.showText("Phí vận chuyển:");
                    cs.endText();
                    showTextRightAligned(cs, shippingFee == 0 ? "0 VND (Miễn phí)" : String.format("%,.0f VND", shippingFee), fontBold, 5, 10, y);
                    y -= 12;

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

    // in 1 đơn (truy vấn 1 lần duy nhất, tránh double findById)
    public byte[] generatePdfAndMark(Integer orderId) {
        Order o = orderRepo.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order không tồn tại: " + orderId));
        InvoiceResponse inv = convertOrderToInvoiceResponse(o);
        byte[] pdf = renderProductInvoicePdf(inv);
        o.setBill(true);
        orderRepo.save(o);
        return pdf;
    }

    public byte[] generateMultipleInvoicesPdf(List<Integer> orderIds) {
        if (orderIds == null || orderIds.isEmpty()) {
            return new byte[0];
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PDFMergerUtility merger = new PDFMergerUtility();
            merger.setDestinationStream(baos);

            for (Integer orderId : orderIds) {
                try {
                    log.info("Đang xử lý hóa đơn orderId = {}", orderId);

                    byte[] singlePdf = generatePdfAndMark(orderId);
                    if (singlePdf == null || singlePdf.length == 0) {
                        log.warn("PDF rỗng cho orderId: {}", orderId);
                        continue;
                    }

                    merger.addSource(new ByteArrayInputStream(singlePdf));
                } catch (Exception ex) {
                    log.error("Lỗi khi tạo hóa đơn cho orderId = {}: {}", orderId, ex.getMessage(), ex);
                }
            }

            merger.mergeDocuments(null);
            return baos.toByteArray();
        } catch (IOException e) {
            log.error("Lỗi khi tạo PDF nhiều hóa đơn:", e);
            throw new RuntimeException("Lỗi khi tạo PDF nhiều hóa đơn", e);
        }
    }

    // in tất cả các đơn (truy vấn DB chỉ lấy ID, chống kéo cả bảng về RAM)
    public byte[] generateAllInvoicesPdf() {
        return generateMultipleInvoicesPdf(orderRepo.findAllOrderIds());
    }

    public byte[] generatebyDeliverInvoicesPdf() {
        return generateMultipleInvoicesPdf(orderRepo.findOrderIdsByStatus(OrderStatusEnum.DELIVERED));
    }

    public byte[] generatebyShippingInvoicesPdf() {
        return generateMultipleInvoicesPdf(orderRepo.findOrderIdsByStatus(OrderStatusEnum.SHIPPING));
    }

    public byte[] generatebyCancleInvoicesPdf() {
        return generateMultipleInvoicesPdf(orderRepo.findOrderIdsByStatus(OrderStatusEnum.CANCELLED));
    }

    public byte[] generateInvoicesByPrintedStatus(boolean isbill) {
        List<Integer> orderIds = isbill
                ? orderRepo.findAll().stream().filter(o -> Boolean.TRUE.equals(o.isBill())).map(Order::getOrderId).collect(Collectors.toList())
                : orderRepo.findUnprintedOrderIds();
        return generateMultipleInvoicesPdf(orderIds);
    }

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
        cs.setStrokingColor(0f);
    }

}