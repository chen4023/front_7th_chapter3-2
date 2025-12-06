// TODO: 장바구니 관리 Hook
// 힌트:
// 1. 장바구니 상태 관리 (localStorage 연동)
// 2. 상품 추가/삭제/수량 변경
// 3. 쿠폰 적용
// 4. 총액 계산
// 5. 재고 확인
//
// 사용할 모델 함수:
// - cartModel.addItemToCart
// - cartModel.removeItemFromCart
// - cartModel.updateCartItemQuantity
// - cartModel.calculateCartTotal
// - cartModel.getRemainingStock
//
// 반환할 값:
// - cart: 장바구니 아이템 배열
// - selectedCoupon: 선택된 쿠폰
// - addToCart: 상품 추가 함수
// - removeFromCart: 상품 제거 함수
// - updateQuantity: 수량 변경 함수
// - applyCoupon: 쿠폰 적용 함수
// - calculateTotal: 총액 계산 함수
// - getRemainingStock: 재고 확인 함수
// - clearCart: 장바구니 비우기 함수


// TODO: 구현
import { useState, useCallback, useMemo } from "react";
import { CartItem, Coupon, Product } from "@/types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import * as cartModel from "../models/cart";

// ============================================
// 타입 정의
// ============================================
type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

interface UseCartOptions {
  /** 알림 함수 (선택적) */
  onNotify?: NotifyFn;
  /** localStorage 키 */
  storageKey?: string;
}

interface UseCartReturn {
  // 상태
  cart: CartItem[];
  selectedCoupon: Coupon | null;

  // 계산된 값
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  totalItemCount: number;

  // 장바구니 액션
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;

  // 쿠폰 액션
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;

  // 주문 액션
  clearCart: () => void;
  completeOrder: () => string;

  // 조회
  getRemainingStock: (product: Product) => number;
}

// ============================================
// useCart Hook
// ============================================
export function useCart(options: UseCartOptions = {}): UseCartReturn {
  const { onNotify, storageKey = "cart" } = options;

  // === 상태 ===
  const [cart, setCart] = useLocalStorage<CartItem[]>(storageKey, [], {
    removeWhenEmpty: true,
  });
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // === 헬퍼: 안전한 알림 호출 ===
  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning") => {
      onNotify?.(message, type);
    },
    [onNotify]
  );

  // === 장바구니 액션: 추가 ===
  const addToCart = useCallback(
    (product: Product) => {
      const result = cartModel.addItemToCart(product, cart);

      if (!result.success) {
        notify(result.error, "error");
        return;
      }

      setCart(result.data);
      notify("장바구니에 담았습니다", "success");
    },
    [cart, setCart, notify]
  );

  // === 장바구니 액션: 제거 ===
  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = cartModel.removeItemFromCart(productId, cart);
      setCart(newCart);
    },
    [cart, setCart]
  );

  // === 장바구니 액션: 수량 변경 ===
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      const result = cartModel.updateCartItemQuantity(
        productId,
        newQuantity,
        cart
      );

      if (!result.success) {
        notify(result.error, "error");
        return;
      }

      setCart(result.data);
    },
    [cart, setCart, notify]
  );

  // === 쿠폰 액션: 적용 ===
const applyCoupon: (coupon: Coupon) => void = useCallback(
  (coupon: Coupon) => {
    const validationResult = cartModel.validateCouponApplication(coupon, cart);

    if (!validationResult.success) {
      notify(validationResult.error, "error");
      return;
    }

    setSelectedCoupon(coupon);
    notify("쿠폰이 적용되었습니다.", "success");
  },
  [cart, notify]
);

  // === 쿠폰 액션: 제거 ===
  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, []);

  // === 주문 액션: 장바구니 비우기 ===
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart]);

  // === 주문 액션: 주문 완료 ===
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    notify(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
    return orderNumber;
  }, [setCart, notify]);

  // === 조회: 남은 재고 ===
  const getRemainingStock = useCallback(
    (product: Product) => {
      return cartModel.getRemainingStock(product, cart);
    },
    [cart]
  );

  // === 파생 상태: 총액 ===
  const totals = useMemo(
    () => cartModel.calculateCartTotal(cart, selectedCoupon),
    [cart, selectedCoupon]
  );

  // === 파생 상태: 총 아이템 수 ===
  const totalItemCount = useMemo(
    () => cartModel.calculateTotalItemCount(cart),
    [cart]
  );

  return {
    // 상태
    cart,
    selectedCoupon,

    // 계산된 값
    totals,
    totalItemCount,

    // 장바구니 액션
    addToCart,
    removeFromCart,
    updateQuantity,

    // 쿠폰 액션
    applyCoupon,
    removeCoupon,

    // 주문 액션
    clearCart,
    completeOrder,

    // 조회
    getRemainingStock,
  };
}