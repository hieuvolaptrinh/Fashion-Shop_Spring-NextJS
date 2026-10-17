import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { CONTACT_DATA } from "@/core/constants/contact";

export const ContactHero = () => {
  const { title, description } = CONTACT_DATA.hero;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-16 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20">
      {/* Ambient background glow decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container mx-auto px-4 text-center">
        <ScrollReveal direction="up" distance={20} duration={600}>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </ScrollReveal>

        <ScrollReveal
          direction="up"
          distance={24}
          delay={150}
          duration={600}
        >
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base md:text-lg">
            {description}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};
