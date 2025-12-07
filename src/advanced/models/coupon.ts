// Coupon Model (순수 함수)
// 역할: 쿠폰 CRUD

import { Coupon } from "../types";

// Result 패턴
export type CouponResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 쿠폰 조회 함수

/** 코드로 쿠폰 찾기 */
export const findCouponByCode = (
  code: string,
  coupons: Coupon[]
): Coupon | undefined => {
  return coupons.find((coupon) => coupon.code === code);
};

/** 쿠폰 존재 여부 확인 */
export const isCouponCodeExists = (code: string, coupons: Coupon[]): boolean => {
  return coupons.some((coupon) => coupon.code === code);
};

// 쿠폰 CRUD 함수 (불변성 유지)

/** 쿠폰 추가 */
export const addCoupon = (
  newCoupon: Coupon,
  coupons: Coupon[]
): CouponResult<Coupon[]> => {
  if (isCouponCodeExists(newCoupon.code, coupons)) {
    return { success: false, error: "이미 존재하는 쿠폰 코드입니다." };
  }

  return { success: true, data: [...coupons, newCoupon] };
};

/** 쿠폰 삭제 */
export const removeCoupon = (
  couponCode: string,
  coupons: Coupon[]
): CouponResult<Coupon[]> => {
  if (!isCouponCodeExists(couponCode, coupons)) {
    return { success: false, error: "존재하지 않는 쿠폰입니다." };
  }

  const newCoupons = coupons.filter((coupon) => coupon.code !== couponCode);
  return { success: true, data: newCoupons };
};
