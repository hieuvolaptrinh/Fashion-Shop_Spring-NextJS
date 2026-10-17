import { API_ENDPOINTS } from '@/core/constants';
import apiClient, { http } from '@/core/lib/apiClient';
import type { CommentResponse, CreateCommentRequest } from '@/core/lib/type';

/**
 * Lấy danh sách bình luận/đánh giá thực tế theo ID sản phẩm từ Backend
 */
export const getCommentsByProduct = async (
  productId: number | string
): Promise<CommentResponse[]> => {
  try {
    const res = await http.get<any>(
      API_ENDPOINTS.COMMENTS.BY_PRODUCT(productId)
    );
    const data = res?.data ?? res;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Lỗi khi tải bình luận sản phẩm:', error);
    return [];
  }
};

/**
 * Gửi đánh giá/bình luận mới cho sản phẩm đã mua thành công
 */
export const createComment = async (
  data: CreateCommentRequest
): Promise<CommentResponse[]> => {
  try {
    const res = await apiClient.post<any>(
      API_ENDPOINTS.COMMENTS.BASE,
      data
    );
    const result = res?.data?.data ?? res?.data ?? res;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error('Lỗi khi gửi bình luận:', error);
    throw error;
  }
};
