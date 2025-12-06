// models/product.ts
// 상품 비즈니스 로직 (순수 함수)
//
// 아키텍처:
// productModel (순수 함수) → useProducts (훅) → App (컴포넌트)
//
// 원칙:
// - UI와 관련된 로직 없음 (toast, notification 등 없음)
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { ProductWithUI } from "@/types";

// ============================================
// 타입 정의
// ============================================
export interface Discount {
  quantity: number;
  rate: number;
}

export type ProductResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// 상품 조회 함수
// ============================================

/**
 * ID로 상품 찾기
 */
export const findProductById = (
  productId: string,
  products: ProductWithUI[]
): ProductWithUI | undefined => {
  return products.find((product) => product.id === productId);
};

/**
 * 상품 존재 여부 확인
 */
export const isProductExists = (
  productId: string,
  products: ProductWithUI[]
): boolean => {
  return products.some((product) => product.id === productId);
};

// ============================================
// 상품 CRUD 함수 (불변성 유지)
// ============================================

/**
 * 상품 추가
 */
export const addProduct = (
  newProduct: Omit<ProductWithUI, "id">,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  // 기본 유효성 검사
  if (!newProduct.name.trim()) {
    return { success: false, error: "상품 이름을 입력해주세요." };
  }

  if (newProduct.price < 0) {
    return { success: false, error: "가격은 0 이상이어야 합니다." };
  }

  if (newProduct.stock < 0) {
    return { success: false, error: "재고는 0 이상이어야 합니다." };
  }

  const product: ProductWithUI = {
    ...newProduct,
    id: `p${Date.now()}`,
  };

  return { success: true, data: [...products, product] };
};

/**
 * 상품 수정
 */
export const updateProduct = (
  productId: string,
  updates: Partial<Omit<ProductWithUI, "id">>,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  if (!isProductExists(productId, products)) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  // 유효성 검사
  if (updates.name !== undefined && !updates.name.trim()) {
    return { success: false, error: "상품 이름을 입력해주세요." };
  }

  if (updates.price !== undefined && updates.price < 0) {
    return { success: false, error: "가격은 0 이상이어야 합니다." };
  }

  if (updates.stock !== undefined && updates.stock < 0) {
    return { success: false, error: "재고는 0 이상이어야 합니다." };
  }

  const newProducts = products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );

  return { success: true, data: newProducts };
};

/**
 * 상품 삭제
 */
export const removeProduct = (
  productId: string,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  if (!isProductExists(productId, products)) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  const newProducts = products.filter((product) => product.id !== productId);
  return { success: true, data: newProducts };
};

// ============================================
// 재고 관련 함수
// ============================================

/**
 * 재고 수정
 */
export const updateProductStock = (
  productId: string,
  newStock: number,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  if (newStock < 0) {
    return { success: false, error: "재고는 0 이상이어야 합니다." };
  }

  return updateProduct(productId, { stock: newStock }, products);
};

/**
 * 재고 증가
 */
export const increaseStock = (
  productId: string,
  amount: number,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  const product = findProductById(productId, products);

  if (!product) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  if (amount < 0) {
    return { success: false, error: "증가량은 0 이상이어야 합니다." };
  }

  return updateProductStock(productId, product.stock + amount, products);
};

/**
 * 재고 감소
 */
export const decreaseStock = (
  productId: string,
  amount: number,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  const product = findProductById(productId, products);

  if (!product) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  if (amount < 0) {
    return { success: false, error: "감소량은 0 이상이어야 합니다." };
  }

  const newStock = product.stock - amount;
  if (newStock < 0) {
    return { success: false, error: "재고가 부족합니다." };
  }

  return updateProductStock(productId, newStock, products);
};

// ============================================
// 할인 규칙 관련 함수
// ============================================

/**
 * 할인 규칙 추가
 */
export const addProductDiscount = (
  productId: string,
  discount: Discount,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  const product = findProductById(productId, products);

  if (!product) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  // 유효성 검사
  if (discount.quantity <= 0) {
    return { success: false, error: "할인 적용 수량은 1 이상이어야 합니다." };
  }

  if (discount.rate <= 0 || discount.rate > 1) {
    return {
      success: false,
      error: "할인율은 0~1 사이여야 합니다. (예: 0.1 = 10%)",
    };
  }

  // 중복 수량 체크
  const existingDiscount = product.discounts.find(
    (d) => d.quantity === discount.quantity
  );
  if (existingDiscount) {
    return {
      success: false,
      error: `${discount.quantity}개 수량에 대한 할인이 이미 존재합니다.`,
    };
  }

  const newDiscounts = [...product.discounts, discount].sort(
    (a, b) => a.quantity - b.quantity
  );

  return updateProduct(productId, { discounts: newDiscounts }, products);
};

/**
 * 할인 규칙 삭제
 */
export const removeProductDiscount = (
  productId: string,
  discountIndex: number,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  const product = findProductById(productId, products);

  if (!product) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  if (discountIndex < 0 || discountIndex >= product.discounts.length) {
    return { success: false, error: "존재하지 않는 할인 규칙입니다." };
  }

  const newDiscounts = product.discounts.filter(
    (_, index) => index !== discountIndex
  );

  return updateProduct(productId, { discounts: newDiscounts }, products);
};

/**
 * 할인 규칙 수정
 */
export const updateProductDiscount = (
  productId: string,
  discountIndex: number,
  newDiscount: Discount,
  products: ProductWithUI[]
): ProductResult<ProductWithUI[]> => {
  const product = findProductById(productId, products);

  if (!product) {
    return { success: false, error: "존재하지 않는 상품입니다." };
  }

  if (discountIndex < 0 || discountIndex >= product.discounts.length) {
    return { success: false, error: "존재하지 않는 할인 규칙입니다." };
  }

  // 유효성 검사
  if (newDiscount.quantity <= 0) {
    return { success: false, error: "할인 적용 수량은 1 이상이어야 합니다." };
  }

  if (newDiscount.rate <= 0 || newDiscount.rate > 1) {
    return { success: false, error: "할인율은 0~1 사이여야 합니다." };
  }

  const newDiscounts = product.discounts.map((d, index) =>
    index === discountIndex ? newDiscount : d
  );

  return updateProduct(productId, { discounts: newDiscounts }, products);
};
