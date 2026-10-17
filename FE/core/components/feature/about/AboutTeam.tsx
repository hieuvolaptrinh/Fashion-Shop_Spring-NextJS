import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { ABOUT_DATA } from "@/core/constants/about";
import Image from "next/image";

export const AboutTeam = () => {
  return (
    <section className="py-8 sm:py-12">
      <ScrollReveal direction="up" distance={20} duration={600}>
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-pretty text-xs text-muted-foreground sm:text-sm md:text-base">
            Những con người thầm lặng mang đến trải nghiệm mua sắm an tâm và trọn vẹn mỗi ngày
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ABOUT_DATA.teamMembers.map((member, index) => {
          return (
            <ScrollReveal
              key={index}
              direction="up"
              distance={24}
              duration={600}
              delay={index * 120}
              className="h-full"
            >
              <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl">
                {/* Ảnh chữ nhật tràn viền 16:9 không bị cắt xén góc cảnh */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Nội dung thông tin đội ngũ */}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  {/* Badge chức danh dạng pill tag tinh tế */}
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                      {member.role}
                    </span>
                  </div>

                  {/* Tên bộ phận / thành viên */}
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {member.name}
                  </h3>

                  {/* Mô tả nhiệm vụ */}
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {member.description}
                  </p>

                  {/* Thanh điểm nhấn chân thẻ */}
                  <div className="mt-auto pt-6">
                    <div className="w-10 border-t-2 border-primary/20 transition-all duration-300 group-hover:w-16 group-hover:border-primary" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
