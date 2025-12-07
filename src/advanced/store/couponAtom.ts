// ============================================
// Coupon Store (Jotai Atom)
// ============================================
// 쿠폰 전역 상태 - 순수하게 상태만 정의
//
// 아키텍처:
// constants (초기값) → store (상태) → hooks (액션+알림) → Component

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../types";
import { initialCoupons } from "../constants";
import * as couponModel from "../models/coupon";

// ============================================
// Base Atoms
// ============================================

/** 쿠폰 목록 (localStorage 동기화) */
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);

// ============================================
// Derived Atoms (읽기 전용)
// ============================================

/** 쿠폰 개수 */
export const couponCountAtom = atom((get) => get(couponsAtom).length);

/** 코드로 쿠폰 찾기 함수 */
export const getCouponByCodeAtom = atom((get) => {
  const coupons = get(couponsAtom);
  return (code: string) => couponModel.findCouponByCode(code, coupons);
});
