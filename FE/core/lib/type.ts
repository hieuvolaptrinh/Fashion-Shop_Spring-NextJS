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

export interface ProductFiltersState {
  productName: string;
  minSalePrice: string;
  maxSalePrice: string;
  typeId: number[];
}

// xài cùng được , không thì thôi khỏi kiểu dữ liệu cho khỏe
export enum OrderStatusEnum {
  PENDING = "PENDING",
  SHIPPING = "SHIPPING",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export type OrderDetailProduct = {
  productId: number | string;
  productName: string;
  originalPrice: number;
  salePrice: number;
  listImages?: Array<{ imageId: number | string; link: string }>;
  [key: string]: any;
};

export type OrderDetailResponse = {
  orderDetailId: number;
  product: OrderDetailProduct;
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
  status: OrderStatusEnum | string;
  totalPrice: number;
  isPay?: boolean;
  isBill?: boolean;
  pay?: boolean;
  bill?: boolean;
  userId: number;
  shippingAddress: string;
  phoneNumber: string;
  items: OrderDetailResponse[];
};

// Aliases for clean semantic usage across feature components
export type Order = OrderResponse;
export type OrderItem = OrderDetailResponse;
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

export type JwtTokenPayload = {
  sub: string;
  roles: string[];
  exp: number;
  iat?: number;
  [key: string]: any;
};

