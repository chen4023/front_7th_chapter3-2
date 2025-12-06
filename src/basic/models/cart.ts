// models/cart.ts
// 장바구니 비즈니스 로직 (순수 함수)
//
// 아키텍처:
// cartModel (순수 함수) → useCart (훅) → App (컴포넌트)
//
// 원칙:
// - UI와 관련된 로직 없음
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { CartItem, Coupon, Product, ProductWithUI } from "@/types";

// discount 모듈에서 할인 관련 함수 import
import {
  getMaxApplicableDiscount,
  calculateItemTotal,
  calculateCartTotal,
  validateDiscount,
  formatDiscountRate,
  formatDiscountAmount,
  Discount,
} from "./discount";

// discount 모듈 함수들 re-export
export {
  getMaxApplicableDiscount,
  calculateItemTotal,
  calculateCartTotal,
  validateDiscount,
  formatDiscountRate,
  formatDiscountAmount,
};
export type { Discount };

// 결과 타입 정의 (에러 처리를 위한 Result 패턴)
export type CartResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 재고 관련 함수

/**
 * 남은 재고 수량 계산
 */
export const getRemainingStock = (
  product: Product,
  cart: CartItem[]
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity ?? 0);
};

// 장바구니 아이템 수 계산

/**
 * 장바구니 아이템 총 개수 계산
 */
export const calculateTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// 장바구니 조작 함수 (불변성 유지, 새 배열 반환)

/**
 * 장바구니에 상품 추가
 * - 이미 있으면 수량 +1
 * - 없으면 새로 추가
 */
export const addItemToCart = (
  product: Product,
  cart: CartItem[]
): CartResult<CartItem[]> => {
  const remainingStock = getRemainingStock(product, cart);

  if (remainingStock <= 0) {
    return { success: false, error: "재고가 부족합니다!" };
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + 1;
    if (newQuantity > product.stock) {
      return {
        success: false,
        error: `재고는 ${product.stock}개까지만 있습니다.`,
      };
    }

    const newCart = cart.map((item) =>
      item.product.id === product.id ? { ...item, quantity: newQuantity } : item
    );
    return { success: true, data: newCart };
  }

  return { success: true, data: [...cart, { product, quantity: 1 }] };
};

/**
 * 장바구니에서 상품 제거
 */
export const removeItemFromCart = (
  productId: string,
  cart: CartItem[]
): CartItem[] => {
  return cart.filter((item) => item.product.id !== productId);
};

/**
 * 장바구니 아이템 수량 변경
 * - 0 이하면 제거
 * - 재고 초과 시 에러
 */
export const updateCartItemQuantity = (
  productId: string,
  newQuantity: number,
  cart: CartItem[]
): CartResult<CartItem[]> => {
  if (newQuantity <= 0) {
    return { success: true, data: removeItemFromCart(productId, cart) };
  }

  const item = cart.find((i) => i.product.id === productId);

  if (!item) {
    return { success: false, error: "장바구니에 해당 상품이 없습니다." };
  }

  if (newQuantity > item.product.stock) {
    return {
      success: false,
      error: `재고는 ${item.product.stock}개까지만 있습니다.`,
    };
  }

  const newCart = cart.map((i) =>
    i.product.id === productId ? { ...i, quantity: newQuantity } : i
  );

  return { success: true, data: newCart };
};

// 쿠폰 관련 함수

/**
 * 쿠폰 적용 가능 여부 검증
 */
export const validateCouponApplication = (
  coupon: Coupon,
  cart: CartItem[]
): CartResult<true> => {
  const { totalAfterDiscount } = calculateCartTotal(cart, null);

  if (totalAfterDiscount < 10000 && coupon.discountType === "percentage") {
    return {
      success: false,
      error: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
    };
  }

  return { success: true, data: true };
};

// 검색/필터 함수

/**
 * 상품 검색 (이름, 설명 기준)
 */
export const filterProductsBySearch = <T extends ProductWithUI >(
  products: T[],
  searchTerm: string
): T[] => {
  if (!searchTerm.trim()) {
    return products;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerSearchTerm) ||
      (product.description?.toLowerCase().includes(lowerSearchTerm) ?? false)
  );
};


