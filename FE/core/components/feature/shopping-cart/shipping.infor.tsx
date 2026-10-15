import { Card, CardContent } from "@/core/components/ui/card";

const ShippingInfor = () => {
  return (
    <>
      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2 font-medium">Thông tin vận chuyển:</p>
            <ul className="space-y-1">
              <li>• Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
              <li>• Giao hàng trong 2-3 ngày làm việc</li>
              <li>• Hỗ trợ đổi trả trong 30 ngày</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export default ShippingInfor;
