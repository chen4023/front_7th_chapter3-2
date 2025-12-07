// ============================================
// useCart Hook (Jotai 기반)
// ============================================
// 역할: store의 atom과 models 사이의 중간 계층
// - store에서 상태 읽기
// - models로 비즈니스 로직 위임
// - 알림 처리 (부수효과)

import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { CartItem, Coupon, Product } from "../types";
import {
  cartAtom,
  selectedCouponAtom,
  totalItemCountAtom,
  cartTotalsAtom,
  getRemainingStockAtom,
} from "../store";
import * as cartModel from "../models/cart";

// ============================================
// 타입 정의
// ============================================

type NotifyFn = (message: string, type: "error" | "success" | "warning") => void;

interface UseCartOptions {
  onNotify?: NotifyFn;
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
  const { onNotify } = options;

  // === store에서 상태 읽기 ===
  const [cart, setCart] = useAtom(cartAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);
  const totals = useAtomValue(cartTotalsAtom);
  const getRemainingStockFn = useAtomValue(getRemainingStockAtom);

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
      const result = cartModel.updateCartItemQuantity(productId, newQuantity, cart);

      if (!result.success) {
        notify(result.error, "error");
        return;
      }

      setCart(result.data);
    },
    [cart, setCart, notify]
  );

  // === 쿠폰 액션: 적용 ===
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const validationResult = cartModel.validateCouponApplication(coupon, cart);

      if (!validationResult.success) {
        notify(validationResult.error, "error");
        return;
      }

      setSelectedCoupon(coupon);
      notify("쿠폰이 적용되었습니다.", "success");
    },
    [cart, setSelectedCoupon, notify]
  );

  // === 쿠폰 액션: 제거 ===
  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  // === 주문 액션: 장바구니 비우기 ===
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart, setSelectedCoupon]);

  // === 주문 액션: 주문 완료 ===
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    notify(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
    return orderNumber;
  }, [setCart, setSelectedCoupon, notify]);

  // === 조회: 남은 재고 ===
  const getRemainingStock = useCallback(
    (product: Product) => getRemainingStockFn(product),
    [getRemainingStockFn]
  );

  return {
    cart,
    selectedCoupon,
    totals,
    totalItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    completeOrder,
    getRemainingStock,
  };
}
