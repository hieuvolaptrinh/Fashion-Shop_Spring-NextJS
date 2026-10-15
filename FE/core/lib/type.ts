export type ListImages = {
  imageId: string;
  link: string;
};

export type ListTypes = {
  typeId: string;
  typeName: string;
};

export type Product = {
  productId: string;
  productName: string;
  originalPrice: number;
  usageInstructions: string;
  description: string;
  ingredients: string;
  salePrice: number;
  quantity: number;
  manufactureDate: Date;
  listImages: ListImages[];
  listTypes: ListTypes[];
  listCombo?: Combo[];
};
export type Combo = {
  comboId?: number;
  quantityInCombo: number;
  comboPrice: number;
  comboDescription?: string;
};
export type CategoryItem = {
  typeId: number;
  typeName: string;
};

export type ProductRequest = {
  productId: number;
  productName: string;
  description: string;
  originalPrice: number;
  usageInstructions?: string;
  ingredients?: string;
  salePrice: number;
  quantity: number;
  manufactureDate?: string;
  listTypes?: number[];
  deletedImageIds?: number[];
  listCombo?: Combo[];
  deletedComboIds?: number[];
};

// xài cùng được , không thì thôi khỏi kiểu dữ liệu cho khỏe
export enum OrderStatusEnum {
  PENDING = "PENDING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export type OrderDetailResponse = {
  orderDetailId: number;
  product: Product;
  quantity: number;
  price: number;
};

export const OrderStatusLabels: Record<OrderStatusEnum, string> = {
  [OrderStatusEnum.PENDING]: "Chưa xử lý",
  [OrderStatusEnum.SHIPPING]: "Đang giao",
  [OrderStatusEnum.DELIVERED]: "Đã giao",
  [OrderStatusEnum.CANCELLED]: "Đã hủy",
};
export type OrderResponse = {
  orderId: number;
  createAt: string; // ISO date string
  status: OrderStatusEnum;
  totalPrice: number;
  isPay: boolean;
  isBill: boolean;
  userId: number;
  shippingAddress: string;
  phoneNumber: string;
  items: OrderDetailResponse[];
};
export type UserResponse = {
  userId: number;
  isActive: boolean;
  phoneNumber: string;
  fullName: string;
  listAddress: AddressResponse[];
};

export type AddressResponse = {
  addressId: number;
  addressName: string;
  districtName: string;
  provinceName: string;
  wardName: string;
};
