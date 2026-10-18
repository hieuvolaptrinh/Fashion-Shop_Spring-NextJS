import { Card, CardContent } from "@/core/components/ui/card";
import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { CONTACT_DATA } from "@/core/constants/contact";
import { ArrowUpRight } from "lucide-react";

export const ContactChannels = () => {
  const { channels } = CONTACT_DATA;

  return (
    <section className="container mx-auto px-4 pb-12 sm:pb-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {channels.map((channel, index) => {
          const Icon = channel.icon;
          const CardBody = (
            <Card
              className="group relative h-full overflow-hidden border border-border/70 bg-card/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-lg"
            >
              <CardContent className="flex flex-col items-center p-6 text-center">
                {/* Channel Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {channel.title}
                </h3>

                {/* Main Value */}
                <p className="mb-2 text-xs font-bold text-foreground sm:text-sm">
                  {channel.value}
                </p>

                {/* Subtitle / Description */}
                <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
                  {channel.description}
                </p>

                {/* Action Link Text */}
                {channel.href ? (
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary group-hover:underline">
                    {channel.actionText}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                ) : (
                  <span className="mt-auto inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                    {channel.actionText}
                  </span>
                )}
              </CardContent>
            </Card>
          );

          return (
            <ScrollReveal
              key={channel.id}
              direction="up"
              distance={20}
              delay={index * 100}
              duration={500}
            >
              {channel.href ? (
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                >
                  {CardBody}
                </a>
              ) : (
                <div className="h-full">{CardBody}</div>
              )}
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
