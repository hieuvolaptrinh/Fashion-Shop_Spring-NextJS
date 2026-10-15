import { getCategories } from "@/core/apis/products";
import { Card, CardContent } from "@/core/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/core/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

type CategoryItem = {
  typeId: number;
  typeName: string;
};

export default function ProductCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Hàm tạo số ổn định dựa trên index để tránh hydration mismatch
  const getImageNumber = (index: number) => {
    return (index % 6) + 1;
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="space-y-5 md:space-y-10">
      <h1 className="text-center text-2xl font-bold">Danh mục sản phẩm</h1>
      <Carousel>
        <CarouselContent>
          {categories.map((item, index) => (
            <CarouselItem
              key={item.typeId}
              className="basis-1/2 cursor-pointer lg:basis-1/4"
              onClick={() => {
                window.location.href = `/products?typeId=${item.typeId}`; // Navigate to the products page with the category type name as a query parameter
              }}
            >
              <Card className="relative transition-shadow hover:shadow-lg">
                <CardContent className="group relative aspect-square scale-3d p-6 transition-transform duration-300 md:hover:scale-105">
                  <Image
                    className="md:opacity-60 md:group-hover:opacity-100"
                    src={`/productDemo${getImageNumber(index)}.jpg`}
                    width={600}
                    height={600}
                    alt={item.typeName}
                  />
                  <div className="absolute top-2/3 left-1/2 flex h-1/4 w-full -translate-x-1/2 flex-col justify-center bg-red-800 text-center text-xl font-semibold text-white md:bg-white/90 md:text-black md:group-hover:scale-95 md:group-hover:bg-red-800 md:group-hover:text-white">
                    <p>{item.typeName}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
