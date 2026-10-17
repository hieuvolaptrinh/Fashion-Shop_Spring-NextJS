'use client';

import { ROUTES } from '@/core/constants';
import type { Product } from '@/core/lib/type';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface ProductBreadcrumbProps {
  product: Product;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const primaryCategory = product.listTypes?.[0];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
        <li className="inline-flex items-center">
          <Link
            href={ROUTES.USER.HOME}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span>Trang chủ</span>
          </Link>
        </li>

        <li className="inline-flex items-center text-muted-foreground/60">
          <ChevronRight className="size-3.5" />
        </li>

        <li className="inline-flex items-center">
          <Link
            href={ROUTES.USER.PRODUCTS}
            className="transition-colors hover:text-foreground"
          >
            Sản phẩm
          </Link>
        </li>

        {primaryCategory && (
          <>
            <li className="inline-flex items-center text-muted-foreground/60">
              <ChevronRight className="size-3.5" />
            </li>
            <li className="inline-flex items-center">
              <Link
                href={`${ROUTES.USER.PRODUCTS}?typeId=${primaryCategory.typeId}`}
                className="transition-colors hover:text-foreground"
              >
                {primaryCategory.typeName}
              </Link>
            </li>
          </>
        )}

        <li className="inline-flex items-center text-muted-foreground/60">
          <ChevronRight className="size-3.5" />
        </li>

        <li className="inline-flex items-center font-medium text-foreground truncate max-w-[180px] sm:max-w-[280px] md:max-w-md" aria-current="page">
          <span className="truncate">{product.productName}</span>
        </li>
      </ol>
    </nav>
  );
}
