// ============================================
// useCoupons Hook (Jotai 기반)
// ============================================
// 역할: store의 atom과 models 사이의 중간 계층
// - store에서 상태 읽기
// - models로 비즈니스 로직 위임
// - 알림 처리 (부수효과)

import { useCallback } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Coupon } from "../types";
import { couponsAtom, couponCountAtom, selectedCouponAtom } from "../store";
import * as couponModel from "../models/coupon";

// ============================================
// 타입 정의
// ============================================

type NotifyFn = (message: string, type: "error" | "success" | "warning") => void;

interface UseCouponsOptions {
  onNotify?: NotifyFn;
  onCouponRemoved?: (couponCode: string) => void;
}

export interface UseCouponsReturn {
  coupons: Coupon[];
  couponCount: number;
  addCoupon: (coupon: Coupon) => boolean;
  removeCoupon: (couponCode: string) => boolean;
}

// ============================================
// useCoupons Hook
// ============================================

export function useCoupons(options: UseCouponsOptions = {}): UseCouponsReturn {
  const { onNotify, onCouponRemoved } = options;

  // === store에서 상태 읽기 ===
  const [coupons, setCoupons] = useAtom(couponsAtom);
  const couponCount = useAtomValue(couponCountAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);

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
      const result = couponModel.addCoupon(newCoupon, coupons);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setCoupons(result.data);
      notify("쿠폰이 추가되었습니다.", "success");
      return true;
    },
    [coupons, setCoupons, notify]
  );

  // === 액션: 쿠폰 삭제 ===
  const removeCoupon = useCallback(
    (couponCode: string): boolean => {
      const result = couponModel.removeCoupon(couponCode, coupons);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setCoupons(result.data);

      // 선택된 쿠폰이 삭제되면 선택 해제
      setSelectedCoupon((prev) => (prev?.code === couponCode ? null : prev));

      onCouponRemoved?.(couponCode);
      notify("쿠폰이 삭제되었습니다.", "success");
      return true;
    },
    [coupons, setCoupons, setSelectedCoupon, notify, onCouponRemoved]
  );

  return {
    coupons,
    couponCount,
    addCoupon,
    removeCoupon,
  };
}
