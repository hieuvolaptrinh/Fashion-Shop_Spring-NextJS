import { ScrollReveal } from '@/core/components/ui/scroll-reveal'
import ProductCategories from './_components/ProductCategories'
import Products from './_components/ProductsSection'
import SlideShow from './_components/SlideShow'

export default function HomePage() {
  return (
    <main className="container mx-auto space-y-12 px-4 py-6 sm:space-y-16 md:space-y-20 md:py-8">
      <ScrollReveal direction="up" distance={20} duration={700}>
        <SlideShow />
      </ScrollReveal>
      <ProductCategories />
      <Products />
    </main>
  )
}
