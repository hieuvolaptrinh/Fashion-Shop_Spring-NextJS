import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { ABOUT_DATA } from "@/core/constants/about";
import { Quote } from "lucide-react";

export const AboutBento = () => {
  const { story, coreValues } = ABOUT_DATA;
  const p = story.paragraphs;

  const p0 = p[0]!;
  const p1 = p[1]!;
  const p2 = p[2]!;
  const p3 = p[3]!;

  return (
    <section className="py-8 sm:py-12">
      <ScrollReveal direction="up" distance={20} duration={600}>
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Hành Trình & Giá Trị Cốt Lõi
          </h2>
          <p className="mx-auto mt-2 max-w-3xl text-pretty text-xs text-muted-foreground sm:text-sm md:text-base">
            10+ năm xây dựng niềm tin với phương châm mang lại giá trị thật cho khách hàng
          </p>
        </div>
      </ScrollReveal>

      <div className="space-y-6">
        {/* Khối 1: Thẻ Câu Chuyện Thương Hiệu (2 cột cân đối) */}
        <ScrollReveal direction="up" distance={24} duration={700} delay={100}>
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
              {/* Cột trái: Tiêu đề, Châm ngôn nổi bật & Callout */}
              <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Quote className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {story.title}
                    </span>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-1">
                    <p className="text-base font-semibold leading-relaxed text-foreground sm:text-lg md:text-xl">
                      "Ai cũng xứng đáng có được những món đồ tốt mà không cần phải chi quá nhiều tiền."
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs font-medium text-foreground sm:p-5 sm:text-sm">
                  {p3.text}
                </div>
              </div>

              {/* Cột phải: 3 đoạn văn chi tiết về hành trình */}
              <div className="space-y-3 text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base lg:col-span-7">
                <p>
                  <strong className="font-semibold text-foreground">
                    {p0.highlight}
                  </strong>
                  {p0.text}
                  <strong className="font-semibold text-foreground">
                    {p0.boldHighlight}
                  </strong>
                  {p0.ending}
                </p>

                <p>
                  {p1.lead}
                  <strong className="font-semibold text-foreground">
                    {p1.boldLead}
                  </strong>
                  {p1.text}
                  <strong className="font-semibold text-foreground">
                    {p1.highlight}
                  </strong>
                  {p1.ending}
                </p>

                <p>
                  {p2.lead}
                  <strong className="font-semibold text-foreground">
                    {p2.highlight}
                  </strong>
                  {p2.text}
                  <strong className="font-semibold text-foreground">
                    {p2.boldEnding}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Khối 2: 4 Thẻ Giá Trị Cốt Lõi phong cách Editorial thời trang */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {coreValues.map((value, index) => {
            return (
              <ScrollReveal
                key={index}
                direction="up"
                distance={24}
                duration={600}
                delay={index * 100}
                className="h-full"
              >
                <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card via-card to-muted/25 p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:p-7">
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="font-mono text-2xl font-black tracking-tighter text-muted-foreground/25 transition-colors duration-300 group-hover:text-primary sm:text-3xl">
                        0{index + 1}
                      </span>
                      <div className="h-1.5 w-1.5 rounded-full bg-border transition-colors duration-300 group-hover:bg-primary" />
                    </div>

                    <h3 className="mb-2 text-base font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-lg">
                      {value.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {value.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

