// models/coupon.ts
// 쿠폰 비즈니스 로직 (순수 함수)
//
// 아키텍처:
// couponModel (순수 함수) → useCoupons (훅) → App (컴포넌트)
//
// 원칙:
// - UI와 관련된 로직 없음 (toast, notification 등 없음)
// - 외부 상태에 의존하지 않음
// - 모든 필요한 데이터는 파라미터로 전달받음

import { Coupon } from "@/types";

// 결과 타입 정의 (에러 처리를 위한 Result 패턴)
export type CouponResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// 쿠폰 조회 함수
/**
 * 코드로 쿠폰 찾기
 */
export const findCouponByCode = (
  code: string,
  coupons: Coupon[]
): Coupon | undefined => {
  return coupons.find((coupon) => coupon.code === code);
};

/**
 * 쿠폰 존재 여부 확인
 */
export const isCouponCodeExists = (
  code: string,
  coupons: Coupon[]
): boolean => {
  return coupons.some((coupon) => coupon.code === code);
};

// ============================================
// 쿠폰 CRUD 함수 (불변성 유지)
// ============================================

/**
 * 쿠폰 추가
 */
export const addCoupon = (
  newCoupon: Coupon,
  coupons: Coupon[]
): CouponResult<Coupon[]> => {
  // 중복 코드 검사
  if (isCouponCodeExists(newCoupon.code, coupons)) {
    return { success: false, error: "이미 존재하는 쿠폰 코드입니다." };
  }

  return { success: true, data: [...coupons, newCoupon] };
};

/**
 * 쿠폰 삭제
 */
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
