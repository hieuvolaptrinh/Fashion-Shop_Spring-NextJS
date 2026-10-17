import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import {
  AboutInfoContactCard,
  AboutInfoPaymentCard,
  AboutInfoPolicyCard,
} from "./info";

export const AboutInfo = () => {
  return (
    <section className="py-8 sm:py-12">
      <ScrollReveal direction="up" distance={20} duration={600}>
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Thông Tin Liên Hệ & Chính Sách
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-pretty text-xs text-muted-foreground sm:text-sm md:text-base">
            Mọi thông tin liên hệ và chính sách hỗ trợ luôn rõ ràng để bảo vệ tối đa quyền lợi của bạn
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Kênh hỗ trợ trực tiếp */}
        <ScrollReveal direction="up" distance={24} duration={600} delay={0} className="h-full">
          <AboutInfoContactCard />
        </ScrollReveal>

        {/* Card 2: Thời gian hoạt động & Chính sách bán hàng */}
        <ScrollReveal direction="up" distance={24} duration={600} delay={120} className="h-full">
          <AboutInfoPolicyCard />
        </ScrollReveal>

        {/* Card 3: Thanh toán & Cam kết vàng */}
        <ScrollReveal direction="up" distance={24} duration={600} delay={240} className="h-full">
          <AboutInfoPaymentCard />
        </ScrollReveal>
      </div>
    </section>
  );
};
