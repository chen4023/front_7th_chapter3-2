// ============================================
// Discount Model (순수 함수)
// ============================================
// 할인 계산 관련 비즈니스 로직

import { CartItem, Coupon } from "../types";

// ============================================
// 타입 정의
// ============================================

export interface Discount {
  quantity: number;
  rate: number;
}

// ============================================
// 상수
// ============================================

const BULK_PURCHASE_THRESHOLD = 10;
const BULK_PURCHASE_BONUS = 0.05;
const MAX_DISCOUNT_RATE = 0.5;

// ============================================
// 수량별 할인 계산 함수
// ============================================

/** 수량에 따른 기본 할인율 계산 */
export const getQuantityDiscount = (
  discounts: Discount[],
  quantity: number
): number => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

/** 대량 구매 여부 확인 */
export const hasBulkPurchase = (cart: CartItem[]): boolean => {
  return cart.some((item) => item.quantity >= BULK_PURCHASE_THRESHOLD);
};

/** 대량 구매 보너스 할인율 계산 */
export const applyBulkPurchaseBonus = (
  baseDiscount: number,
  isBulkPurchase: boolean
): number => {
  if (isBulkPurchase) {
    return Math.min(baseDiscount + BULK_PURCHASE_BONUS, MAX_DISCOUNT_RATE);
  }
  return baseDiscount;
};

/** 개별 아이템에 적용 가능한 최대 할인율 계산 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  const baseDiscount = getQuantityDiscount(discounts, quantity);
  const isBulkPurchase = hasBulkPurchase(cart);

  return applyBulkPurchaseBonus(baseDiscount, isBulkPurchase);
};

// ============================================
// 금액 계산 함수
// ============================================

/** 할인 적용 후 금액 계산 */
export const applyDiscount = (price: number, discountRate: number): number => {
  return Math.round(price * (1 - discountRate));
};

/** 개별 아이템의 할인 적용 후 총액 계산 */
export const calculateItemTotal = (item: CartItem, cart: CartItem[]): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  return applyDiscount(price * quantity, discount);
};

/** 장바구니 아이템들의 할인 전 총액 계산 */
export const calculateTotalBeforeDiscount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
};

/** 장바구니 아이템들의 할인 후 총액 계산 (쿠폰 제외) */
export const calculateTotalAfterItemDiscount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + calculateItemTotal(item, cart), 0);
};

// ============================================
// 쿠폰 할인 함수
// ============================================

/** 쿠폰 할인 적용 */
export const applyCouponDiscount = (
  total: number,
  coupon: Coupon | null
): number => {
  if (!coupon) {
    return total;
  }

  if (coupon.discountType === "amount") {
    return Math.max(0, total - coupon.discountValue);
  }

  return Math.round(total * (1 - coupon.discountValue / 100));
};

/** 장바구니 총액 계산 (할인 전/후, 할인액) */
export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
} => {
  const totalBeforeDiscount = calculateTotalBeforeDiscount(cart);
  const totalAfterItemDiscount = calculateTotalAfterItemDiscount(cart);
  const totalAfterDiscount = applyCouponDiscount(totalAfterItemDiscount, coupon);

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
};

// ============================================
// 할인 유효성 검증 함수
// ============================================

/** 할인 규칙 유효성 검증 */
export const validateDiscount = (
  discount: Discount
): { valid: boolean; error?: string } => {
  if (discount.quantity <= 0) {
    return { valid: false, error: "할인 적용 수량은 1 이상이어야 합니다." };
  }

  if (discount.rate <= 0 || discount.rate > 1) {
    return { valid: false, error: "할인율은 0~1 사이여야 합니다." };
  }

  return { valid: true };
};

// ============================================
// 포맷팅 함수
// ============================================

/** 할인율 포맷팅 (0.1 -> "10%") */
export const formatDiscountRate = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

/** 할인 금액 포맷팅 */
export const formatDiscountAmount = (amount: number): string => {
  return `${amount.toLocaleString()}원`;
};
