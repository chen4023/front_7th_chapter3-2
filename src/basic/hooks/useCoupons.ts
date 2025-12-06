// TODO: 쿠폰 관리 Hook


// hooks/useCoupons.ts
// 쿠폰 관리 Hook
//
// 역할: 순수 함수(couponModel)와 컴포넌트 사이의 중간 계층
// - 상태 관리 (coupons)
// - 부작용 처리 (알림, localStorage)
// - couponModel 함수 호출 및 결과 처리
//
// 반환할 값:
// - coupons: 쿠폰 배열
// - addCoupon: 새 쿠폰 추가
// - removeCoupon: 쿠폰 삭제

import { useCallback } from "react";
import { Coupon } from "@/types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialCoupons } from "../constants";
import * as couponModel from "../models/coupon";

// ============================================
// 타입 정의
// ============================================
type NotifyFn = (message: string, type: "error" | "success" | "warning") => void;

interface UseCouponsOptions {
  /** 알림 함수 (선택적) */
  onNotify?: NotifyFn;
  /** localStorage 키 */
  storageKey?: string;
  /** 쿠폰 삭제 시 호출되는 콜백 */
  onCouponRemoved?: (couponCode: string) => void;
}

export interface UseCouponsReturn {
  // 상태
  coupons: Coupon[];

  // 액션
  addCoupon: (coupon: Coupon) => boolean;
  removeCoupon: (couponCode: string) => boolean;
}

// ============================================
// useCoupons Hook
// ============================================
export function useCoupons(options: UseCouponsOptions = {}): UseCouponsReturn {
  const { onNotify, storageKey = "coupons", onCouponRemoved } = options;

  // === 상태 (localStorage 연동) ===
  const [coupons, setCoupons] = useLocalStorage<Coupon[]>(
    storageKey,
    initialCoupons
  );

  // === 헬퍼: 안전한 알림 호출 ===
  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning") => {
      onNotify?.(message, type);
    },
    [onNotify]
  );

  // === 액션: 쿠폰 추가 ===
  const addCoupon = useCallback(
    (newCoupon: Coupon): boolean => {
      // 순수 함수 호출
      const result = couponModel.addCoupon(newCoupon, coupons);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      // 상태 업데이트 + 알림
      setCoupons(result.data);
      notify("쿠폰이 추가되었습니다.", "success");
      return true;
    },
    [coupons, setCoupons, notify]
  );

  // === 액션: 쿠폰 삭제 ===
  const removeCoupon = useCallback(
    (couponCode: string): boolean => {
      // 순수 함수 호출
      const result = couponModel.removeCoupon(couponCode, coupons);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      // 상태 업데이트 + 콜백 + 알림
      setCoupons(result.data);
      onCouponRemoved?.(couponCode);
      notify("쿠폰이 삭제되었습니다.", "success");
      return true;
    },
    [coupons, setCoupons, notify, onCouponRemoved]
  );

  return {
    coupons,
    addCoupon,
    removeCoupon,
  };
}