// useCart Hook (Jotai 기반)

import { useCallback, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { CartItem, Coupon, Product } from "../types";
import { cartAtom, selectedCouponAtom, totalItemCountAtom } from "../store";
import * as cartModel from "../models/cart";
import { calculateCartTotal } from "../models/discount";

type NotifyFn = (message: string, type: "error" | "success" | "warning") => void;

interface UseCartOptions {
  onNotify?: NotifyFn;
}

interface UseCartReturn {
  cart: CartItem[];
  selectedCoupon: Coupon | null;
  totals: {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
    totalDiscount: number;
  };
  totalItemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  completeOrder: () => string;
  getRemainingStock: (product: Product) => number;
}

export function useCart(options: UseCartOptions = {}): UseCartReturn {
  const { onNotify } = options;

  // store에서 상태 읽기
  const [cart, setCart] = useAtom(cartAtom);
  const [selectedCoupon, setSelectedCoupon] = useAtom(selectedCouponAtom);
  const totalItemCount = useAtomValue(totalItemCountAtom);

  // 직접 계산 (이 hook에서만 사용)
  const totals = useMemo(
    () => calculateCartTotal(cart, selectedCoupon),
    [cart, selectedCoupon]
  );

  const getRemainingStock = useCallback(
    (product: Product) => cartModel.getRemainingStock(product, cart),
    [cart]
  );

  // 헬퍼
  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning") => {
      onNotify?.(message, type);
    },
    [onNotify]
  );

  // 장바구니 액션
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

  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = cartModel.removeItemFromCart(productId, cart);
      setCart(newCart);
    },
    [cart, setCart]
  );

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

  // 쿠폰 액션
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

  const removeCoupon = useCallback(() => {
    setSelectedCoupon(null);
  }, [setSelectedCoupon]);

  // 주문 액션
  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedCoupon(null);
  }, [setCart, setSelectedCoupon]);

  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    notify(`주문이 완료되었습니다. 주문번호: ${orderNumber}`, "success");
    setCart([]);
    setSelectedCoupon(null);
    return orderNumber;
  }, [setCart, setSelectedCoupon, notify]);

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
