package com.hieuvolaptrinh.Heatly_Store.Controller;

import com.hieuvolaptrinh.Heatly_Store.Request.ListOrderRequest;
import com.hieuvolaptrinh.Heatly_Store.Response.InvoiceResponse;
import com.hieuvolaptrinh.Heatly_Store.Service.InvoiceService;
import com.hieuvolaptrinh.Heatly_Store.Util.ApiMessage;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bills")
public class BillController {
    private final InvoiceService invoiceService;

    public BillController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    /**
     * Helper method to generate meaningful filename
     */
    private String generateFileName(String condition) {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String timestamp = now.format(formatter);

        if (condition != null && !condition.isEmpty()) {
            return String.format("DanhSachBill_%s_%s.pdf", timestamp, condition);
        } else {
            return String.format("DanhSachBill_%s.pdf", timestamp);
        }
    }

    @GetMapping("getInvoice/{orderId}")
    @ApiMessage("Get invoice information successfully")
    public ResponseEntity<InvoiceResponse> getInfoInvoice(@PathVariable Integer orderId) {
        InvoiceResponse invoiceData = invoiceService.getInvoiceData(orderId);
        return ResponseEntity.ok(invoiceData);
    }

    @GetMapping(value = "/{orderId}", produces = MediaType.APPLICATION_PDF_VALUE)
    public void printInvoice(
            @PathVariable Integer orderId,
            HttpServletResponse response) {
        byte[] pdf = invoiceService.generatePdfAndMark(orderId);

        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        response.setHeader(
                HttpHeaders.CONTENT_DISPOSITION,
                "inline; filename=invoice-" + orderId + ".pdf");
        try (ServletOutputStream os = response.getOutputStream()) {
            os.write(pdf);
            os.flush();
        } catch (IOException ex) {
            throw new UncheckedIOException("Lỗi khi ghi PDF ra response", ex);
        }
    }

    /**
     * xuất PDF cho nhiều order,
     */
    @PostMapping("/export-multiple")
    public void exportMultipleInvoicesRaw(
            @RequestBody List<Integer> orderIds,
            HttpServletResponse response) {
        if (orderIds == null || orderIds.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            try {
                response.setContentType("text/plain;charset=UTF-8");
                response.getWriter().write("Danh sách orderIds không được để trống.");
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
            return;
        }
        byte[] pdf = invoiceService.generateMultipleInvoicesPdf(orderIds);
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        String fileName = generateFileName("NhieuDon");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        try (ServletOutputStream os = response.getOutputStream()) {
            os.write(pdf);
            os.flush();
        } catch (IOException e) {
            throw new UncheckedIOException("Lỗi khi ghi PDF ra response", e);
        }
    }

    @GetMapping("/export-all-invoice")
    public void exportAllInvoices(
            @RequestParam(name = "printed", required = false) Boolean printed,
            HttpServletResponse response) {

        byte[] pdf;
        if (printed == null) {
            // cả hai: đã in + chưa in
            pdf = invoiceService.generateAllInvoicesPdf();
        } else if (printed) {
            // chỉ những đơn đã in
            pdf = invoiceService.generateInvoicesByPrintedStatus(true);
        } else {
            // chỉ những đơn chưa in
            pdf = invoiceService.generateInvoicesByPrintedStatus(false);
        }

        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        String fileName = generateFileName("TatCaDon_" + (printed == null ? "All" : (printed ? "Printed" : "NotPrinted")));
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        try (ServletOutputStream os = response.getOutputStream()) {
            os.write(pdf);
            os.flush();
        } catch (IOException e) {
            throw new UncheckedIOException("Lỗi khi ghi PDF ra response", e);
        }
    }


    // in đơn hàng theo trạng thái shipping
    @GetMapping("/export-all-invoice-shipping")
    public void exportAllInvoicesByshipping(
            HttpServletResponse response) {
        byte[] pdf = invoiceService.generatebyShippingInvoicesPdf();
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        String fileName = generateFileName("DangGiao");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        try (ServletOutputStream os = response.getOutputStream()) {
            os.write(pdf);
            os.flush();
        } catch (IOException e) {
            throw new UncheckedIOException("Lỗi khi ghi PDF ra response", e);
        }
    }

    // in hóa đơn trạng thái đã giao
    @GetMapping("/export-all-invoice-delivered")
    public void exportAllInvoicesByDeliver(
            HttpServletResponse response) {
        byte[] pdf = invoiceService.generatebyDeliverInvoicesPdf();
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        String fileName = generateFileName("DaGiao");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        try (ServletOutputStream os = response.getOutputStream()) {
            os.write(pdf);
            os.flush();
        } catch (IOException e) {
            throw new UncheckedIOException("Lỗi khi ghi PDF ra response", e);
        }
    }

    // in hóa đơn trạng thái đã hủy
    @GetMapping("/export-all-invoice-cancle")
    public void exportAllInvoicesByCancle(
            HttpServletResponse response) {
        byte[] pdf = invoiceService.generatebyCancleInvoicesPdf();
        response.setContentType(MediaType.APPLICATION_PDF_VALUE);
        String fileName = generateFileName("DaHuy");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        try (ServletOutputStream os = response.getOutputStream()) {
            os.write(pdf);
            os.flush();
        } catch (IOException e) {
            throw new UncheckedIOException("Lỗi khi ghi PDF ra response", e);
        }
    }
    @PostMapping("/confirm-status")
    public ResponseEntity<String> confirmStatus(
            @RequestBody ListOrderRequest req) {

        List<Integer> ids = req.getOrderIds();
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Vui lòng cung cấp danh sách orderId");
        }

        invoiceService.updateBillStatus(ids);
        return ResponseEntity
                .ok("Đã cập nhật trường bill = true cho các đơn hàng: " + ids);
    }
}