// Cart Store (Jotai Atom)
// 장바구니 전역 상태

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { CartItem, Coupon } from "../types";

// Base Atoms
/** 장바구니 아이템 (localStorage 동기화) */
export const cartAtom = atomWithStorage<CartItem[]>("cart", []);

/** 선택된 쿠폰 */
export const selectedCouponAtom = atom<Coupon | null>(null);

// Derived Atom (여러 컴포넌트에서 사용)
/** 총 아이템 개수 - CartLayout, CartPage에서 사용 */
export const totalItemCountAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
});
