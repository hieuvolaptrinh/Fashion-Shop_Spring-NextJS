import { getCommentsByProduct } from '@/core/apis/comments';
import { getProductById } from '@/core/apis/products';
import { ROUTES } from '@/core/constants';
import type { Combo, CommentResponse, Product } from '@/core/lib/type';
import { useCartStore } from '@/core/store/cartStore';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export type PurchaseOption = {
  type: 'single' | 'combo';
  data?: Combo;
};

export function useProductDetail(productId: string) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedOption, setSelectedOption] = useState<PurchaseOption>({
    type: 'single',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);

  // Tải chi tiết sản phẩm
  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(Number(productId));
        if (isMounted) {
          setProduct(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
    return () => {
      isMounted = false;
    };
  }, [productId]);

  // Tải danh sách đánh giá/bình luận thực tế từ Backend
  const refreshComments = useCallback(async () => {
    if (!productId) return;
    setLoadingComments(true);
    try {
      const data = await getCommentsByProduct(productId);
      setComments(data);
    } catch (error) {
      console.error('Lỗi khi tải bình luận sản phẩm:', error);
    } finally {
      setLoadingComments(false);
    }
  }, [productId]);

  useEffect(() => {
    refreshComments();
  }, [refreshComments]);

  // Đặt lại số lượng về 1 trực tiếp khi người dùng chọn combo / mua lẻ (tránh re-render kép bằng useEffect)
  const handleSelectOption = useCallback((option: PurchaseOption) => {
    setSelectedOption(option);
    setQuantity(1);
  }, []);

  const maxQuantity = useMemo(() => {
    if (!product) return 0;
    if (selectedOption.type === 'combo' && selectedOption.data) {
      return Math.floor(product.quantity / selectedOption.data.quantityInCombo);
    }
    return product.quantity;
  }, [product, selectedOption]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    if (selectedOption.type === 'combo' && selectedOption.data) {
      return selectedOption.data.comboPrice;
    }
    return product.salePrice;
  }, [product, selectedOption]);

  const currentOriginalPrice = useMemo(() => {
    if (!product) return 0;
    if (selectedOption.type === 'combo' && selectedOption.data) {
      return product.originalPrice * selectedOption.data.quantityInCombo;
    }
    return product.originalPrice;
  }, [product, selectedOption]);

  const handleAddToCart = async () => {
    if (!product || isSubmitting) return;

    if (maxQuantity <= 0) {
      toast.error('Sản phẩm hiện đang tạm hết hàng');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(
        `Không thể đặt hàng nhiều hơn số lượng hiện có (${maxQuantity} ${
          selectedOption.type === 'combo' ? 'combo' : 'sản phẩm'
        })`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const combo =
        selectedOption.type === 'combo' ? selectedOption.data : undefined;
      const result = await useCartStore
        .getState()
        .addToCart(product, quantity, combo);

      if (result.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng!');
      } else {
        toast.error(result.message || 'Thêm vào giỏ hàng thất bại');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product || isSubmitting) return;

    if (maxQuantity <= 0) {
      toast.error('Sản phẩm hiện đang tạm hết hàng');
      return;
    }

    if (quantity > maxQuantity) {
      toast.error(
        `Không thể đặt hàng nhiều hơn số lượng hiện có (${maxQuantity} ${
          selectedOption.type === 'combo' ? 'combo' : 'sản phẩm'
        })`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const combo =
        selectedOption.type === 'combo' ? selectedOption.data : undefined;
      const result = await useCartStore
        .getState()
        .addToCart(product, quantity, combo);

      if (result.success) {
        router.push(ROUTES.USER.CART);
      } else {
        toast.error(result.message || 'Không thể thực hiện mua ngay');
      }
    } catch {
      toast.error('Có lỗi xảy ra khi xử lý mua ngay');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = (newQty: number) => {
    const clamped = Math.max(1, Math.min(newQty, maxQuantity));
    setQuantity(clamped);
  };

  const averageRating = useMemo(() => {
    if (comments.length === 0) return 5;
    const total = comments.reduce((sum, c) => sum + (c.rating || 5), 0);
    return Math.round((total / comments.length) * 10) / 10;
  }, [comments]);

  return {
    product,
    loading,
    selectedImage,
    setSelectedImage,
    quantity,
    handleQuantityChange,
    selectedOption,
    setSelectedOption: handleSelectOption,
    maxQuantity,
    currentPrice,
    currentOriginalPrice,
    isSubmitting,
    handleAddToCart,
    handleBuyNow,
    comments,
    loadingComments,
    averageRating,
    totalReviews: comments.length,
    refreshComments,
  };
}
