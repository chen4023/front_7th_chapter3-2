// Coupon Store (Jotai Atom)
// 쿠폰 전역 상태

import { atomWithStorage } from "jotai/utils";
import { Coupon } from "../types";
import { initialCoupons } from "../constants";

// Base Atom
/** 쿠폰 목록 (localStorage 동기화) */
export const couponsAtom = atomWithStorage<Coupon[]>("coupons", initialCoupons);
