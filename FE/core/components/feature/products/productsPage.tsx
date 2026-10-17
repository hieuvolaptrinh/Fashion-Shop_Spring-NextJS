'use client';

import ProductCard from '@/core/components/feature/products/ProductCard';
import Pagination from '@/core/components/ui/pagination';
import { ROUTES } from '@/core/constants/routes';
import { useProductsPresenter } from '@/core/hooks/useProductsPresenter';
import { ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { ProductsFilterBar } from './ProductsFilterBar';
import ShoppingGuide from './ShoppingGuide';

function ProductsContent() {
  const p = useProductsPresenter();

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="container mx-auto px-3 pt-6 sm:px-4 sm:pt-8">
        {/* Header với Breadcrumb & Tiêu đề */}
        <div className="mb-6 border-b border-border/60 pb-5">
          <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href={ROUTES.USER.HOME} className="transition-colors hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className={p.typeParam ? 'hover:text-primary' : 'font-medium text-foreground'}>
              Sản phẩm
            </span>
            {p.typeParam && p.selectedCategory && (
              <>
                <ChevronRight className="size-3 text-muted-foreground/60" />
                <span className="font-semibold text-primary">
                  {p.selectedCategory.typeName}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {p.selectedCategory ? p.selectedCategory.typeName : 'Tất Cả Sản Phẩm'}
              </h1>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Khám phá những sản phẩm chất lượng cao với mức giá ưu đãi nhất
              </p>
            </div>
            {!p.loading && (
              <div className="mt-2 text-xs text-muted-foreground sm:mt-0 sm:text-sm">
                Tổng số:{' '}
                <strong className="font-semibold text-foreground">
                  {p.totalElements}
                </strong>{' '}
                sản phẩm
              </div>
            )}
          </div>
        </div>

        {/* Thanh tìm kiếm & bộ lọc */}
        <ProductsFilterBar
          searchTerm={p.searchTerm}
          onSearchChange={p.handleSearchChange}
          categories={p.categories}
          selectedTypeId={p.typeParam}
          onSelectCategory={p.handleCategorySelect}
          selectedPriceRange={p.selectedPriceRange}
          onSelectPriceRange={p.handlePriceRangeChange}
          sortBy={p.sortBy}
          onSelectSort={p.handleSortChange}
          onClearFilters={p.handleClearFilters}
          hasActiveFilters={p.hasActiveFilters}
        />

        {/* Lưới sản phẩm */}
        <div className="grid min-h-[360px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {p.products.map((product) => (
            <ProductCard key={product.productId} product={product} variant="compact" />
          ))}
        </div>

        {/* Trạng thái Loading */}
        {p.loading && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span>Đang tải danh sách sản phẩm...</span>
            </div>
          </div>
        )}

        {/* Trạng thái không có kết quả */}
        {!p.loading && p.products.length === 0 && (
          <div className="my-14 text-center">
            <p className="text-base font-medium text-foreground sm:text-lg">
              Không tìm thấy sản phẩm nào phù hợp
            </p>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc
            </p>
          </div>
        )}

        {/* Phân trang */}
        {!p.loading && p.products.length > 0 && (
          <div className="mt-8 mb-6">
            <Pagination
              currentPage={p.page + 1}
              totalPages={p.totalPages}
              totalItems={p.totalElements}
              itemsPerPage={p.pageSize}
              itemName="sản phẩm"
              onPageChange={p.handlePageChange}
              disabled={p.loading}
            />
          </div>
        )}

        <ShoppingGuide />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted-foreground">Đang tải trang...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
