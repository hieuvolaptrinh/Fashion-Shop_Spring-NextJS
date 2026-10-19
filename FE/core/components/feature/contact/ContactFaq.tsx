"use client";

import { Card, CardContent } from "@/core/components/ui/card";
import { ScrollReveal } from "@/core/components/ui/scroll-reveal";
import { CONTACT_DATA } from "@/core/constants/contact";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const ContactFaq = () => {
  const { faqs } = CONTACT_DATA;
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="container mx-auto px-4 py-12 sm:py-16">
      <ScrollReveal direction="up" distance={20} duration={600}>
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Câu Hỏi Thường Gặp
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
            Những thông tin cần biết về quy trình mua sắm, nhận hàng và chính sách đổi trả tại HALOKAKI
          </p>
        </div>
      </ScrollReveal>

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openId === faq.id;

          return (
            <ScrollReveal
              key={faq.id}
              direction="up"
              distance={16}
              delay={index * 60}
              duration={400}
            >
              <Card
                className={`overflow-hidden border transition-all duration-200 ${
                  isOpen
                    ? "border-border bg-card shadow-sm"
                    : "border-border/70 bg-card/60 hover:border-border hover:bg-card"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between p-4 text-left sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                >
                  <span className="text-sm font-semibold text-foreground sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 bg-muted text-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <CardContent className="px-4 pb-5 pt-0 sm:px-5">
                    <div className="border-t border-border/40 pt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {faq.answer}
                    </div>
                  </CardContent>
                )}
              </Card>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
