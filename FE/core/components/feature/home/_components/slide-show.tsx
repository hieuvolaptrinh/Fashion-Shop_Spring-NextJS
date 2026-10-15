import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/core/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

export default function SlideShow() {
  const SLIDE_SHOW_ITEMS = [
    { id: 1, content: "Slide 1", image: "/banner2.png" },
    { id: 2, content: "Slide 2", image: "/banner1.png" },
  ];

  return (
    <Carousel
      orientation="horizontal"
      plugins={[
        Autoplay({
          delay: 5000,
        }),
      ]}
    >
      <CarouselContent>
        {SLIDE_SHOW_ITEMS.map((item) => (
          <CarouselItem key={item.id}>
            <div className="mt-10 flex items-center justify-center rounded-md border p-6 shadow-md">
              <div className="relative h-[400px] w-full overflow-hidden rounded-md">
                <Image
                  src={item.image}
                  fill
                  className="object-cover"
                  alt={item.content}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
