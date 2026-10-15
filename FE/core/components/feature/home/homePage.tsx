"use client";

import ProductCategories from "./_components/product-categories";
import Products from "./_components/products";
import SlideShow from "./_components/slide-show";

export default function homePage() {
  return (
    <main className="container mx-auto space-y-10 px-4 md:space-y-20">
      <div className="hidden md:block">
        <SlideShow />
      </div>
      <ProductCategories />
      <Products />
    </main>
  );
}
