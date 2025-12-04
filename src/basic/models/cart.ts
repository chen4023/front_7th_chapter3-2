// TODO: 장바구니 비즈니스 로직 (순수 함수)
// 힌트: 모든 함수는 순수 함수로 구현 (부작용 없음, 같은 입력에 항상 같은 출력)
//
// 구현할 함수들:
// 1. calculateItemTotal(item): 개별 아이템의 할인 적용 후 총액 계산
// 2. getMaxApplicableDiscount(item): 적용 가능한 최대 할인율 계산
// 3. calculateCartTotal(cart, coupon): 장바구니 총액 계산 (할인 전/후, 할인액)
// 4. updateCartItemQuantity(cart, productId, quantity): 수량 변경
// 5. addItemToCart(cart, product): 상품 추가
// 6. removeItemFromCart(cart, productId): 상품 제거
// 7. getRemainingStock(product, cart): 남은 재고 계산
//
// 원칙:
// - UI와 관련된 로직 없음 => toast 연관짓지말것
// - 외부 상태에 의존하지 않음 => props로 데이터 내려받아서 변경
// - 모든 필요한 데이터는 파라미터로 전달받음

import { CartItem, Coupon, Product, ProductWithUI } from "@/types";

// ============================================
// 결과 타입 정의 (에러 처리를 위한 Result 패턴)
// ============================================
export type CartResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================
// 재고 관련 함수
// ============================================

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

// ============================================
// 할인 관련 함수
// ============================================

/**
 * 개별 아이템에 적용 가능한 최대 할인율 계산
 * - 수량별 할인 적용
 * - 대량 구매 보너스 (장바구니 내 10개 이상 아이템 존재 시 +5%, 최대 50%)
 */
export const getMaxApplicableDiscount = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { discounts } = item.product;
  const { quantity } = item;

  // 수량 조건을 만족하는 할인 중 최대값 찾기
  const baseDiscount = discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);

  // 대량 구매 보너스: 장바구니에 10개 이상인 아이템이 있으면 +5%
  const hasBulkPurchase = cart.some((cartItem) => cartItem.quantity >= 10);
  if (hasBulkPurchase) {
    return Math.min(baseDiscount + 0.05, 0.5); // 최대 50% 캡
  }

  return baseDiscount;
};

// ============================================
// 금액 계산 함수
// ============================================

/**
 * 개별 아이템의 할인 적용 후 총액 계산
 */
export const calculateItemTotal = (
  item: CartItem,
  cart: CartItem[]
): number => {
  const { price } = item.product;
  const { quantity } = item;
  const discount = getMaxApplicableDiscount(item, cart);
  return Math.round(price * quantity * (1 - discount));
};

/**
 * 장바구니 총액 계산 (할인 전/후, 할인액)
 */
export const calculateCartTotal = (
  cart: CartItem[],
  coupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
} => {
  // 할인 전 총액
  const totalBeforeDiscount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 아이템별 할인 적용 후 총액
  let totalAfterDiscount = cart.reduce(
    (sum, item) => sum + calculateItemTotal(item, cart),
    0
  );

  // 쿠폰 적용
  if (coupon) {
    if (coupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - coupon.discountValue
      );
    } else {
      totalAfterDiscount = Math.round(
        totalAfterDiscount * (1 - coupon.discountValue / 100)
      );
    }
  }

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalBeforeDiscount - totalAfterDiscount),
  };
};

/**
 * 장바구니 아이템 총 개수 계산
 */
export const calculateTotalItemCount = (cart: CartItem[]): number => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
};

// ============================================
// 장바구니 조작 함수 (불변성 유지, 새 배열 반환)
// ============================================

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
  // 0 이하면 제거
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

// ============================================
// 쿠폰 관련 함수
// ============================================

/**
 * 쿠폰 적용 가능 여부 검증
 */
export const validateCouponApplication = (
  coupon: Coupon | null,
  cart: CartItem[]
): CartResult<true> => {
  const { totalAfterDiscount } = calculateCartTotal(cart, null);

  if (totalAfterDiscount < 10000 && coupon?.discountType === "percentage") {
    return {
      success: false,
      error: "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
    };
  }

  return { success: true, data: true };
};

// ============================================
// 검색/필터 함수
// ============================================

/**
 * 상품 검색 (이름, 설명 기준)
 */
export const filterProductsBySearch = <T extends ProductWithUI>(
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

// ============================================
// 포맷팅 함수 (순수 함수)
// ============================================

/**
 * 가격 포맷팅
 */
export const formatPrice = (
  price: number,
  options?: {
    product?: Product;
    cart?: CartItem[];
    isAdmin?: boolean;
  }
): string => {
  const { product, cart = [], isAdmin = false } = options ?? {};

  // 상품이 주어지고 재고가 없으면 SOLD OUT
  if (product && getRemainingStock(product, cart) <= 0) {
    return "SOLD OUT";
  }

  // 관리자 모드
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};