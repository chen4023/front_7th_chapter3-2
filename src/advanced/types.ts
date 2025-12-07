
// 기본 타입


export interface Discount {
  quantity: number;
  rate: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}


// 결과 타입 (Result 패턴)


export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
