// ============================================
// Cart Store (Jotai Atom)
// ============================================
// 장바구니 전역 상태 - 순수하게 상태만 정의
//
// 아키텍처:
// models (순수함수) → store (상태) → hooks (액션+알림) → Component

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Coupon, Product } from "../types";
import * as cartModel from "../models/cart";

// ============================================
// Base Atoms
// ============================================

/** 장바구니 아이템 (localStorage 동기화) */
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

/** 선택된 쿠폰 */
export const selectedCouponAtom = atom<Coupon | null>(null);

// ============================================
// Derived Atoms (읽기 전용) - models 함수 활용
// ============================================

/** 총 아이템 개수 */
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cartModel.calculateTotalItemCount(cart);
});

/** 장바구니 총액 (할인 전/후) */
export const cartTotalsAtom = atom((get) => {
  const cart = get(cartAtom);
  const coupon = get(selectedCouponAtom);
  return cartModel.calculateCartTotal(cart, coupon);
});

/** 남은 재고 계산 함수 */
export const getRemainingStockAtom = atom((get) => {
  const cart = get(cartAtom);
  return (product: Product) => cartModel.getRemainingStock(product, cart);
});
