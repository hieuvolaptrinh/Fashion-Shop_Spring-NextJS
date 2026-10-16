/**
 * Utility hỗ trợ in trực tiếp file PDF từ Blob dữ liệu bằng iframe ẩn
 */
export function printPdfBlob(blob: Blob, onLoaded?: () => void): void {
  if (typeof window === "undefined") return;

  const pdfUrl = URL.createObjectURL(blob);
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = pdfUrl;

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      onLoaded?.();
    } catch (err) {
      console.error("printPdfBlob: Lỗi khi kích hoạt cửa sổ in:", err);
    }
  };

  document.body.appendChild(iframe);
}

export default printPdfBlob;
