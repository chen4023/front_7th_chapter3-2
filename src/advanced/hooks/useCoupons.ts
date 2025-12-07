// useCoupons Hook (Jotai 기반)

import { useCallback } from "react";
import { useAtom, useSetAtom } from "jotai";
import { Coupon } from "../types";
import { couponsAtom, selectedCouponAtom } from "../store";
import * as couponModel from "../models/coupon";

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

export function useCoupons(options: UseCouponsOptions = {}): UseCouponsReturn {
  const { onNotify, onCouponRemoved } = options;

  const [coupons, setCoupons] = useAtom(couponsAtom);
  const setSelectedCoupon = useSetAtom(selectedCouponAtom);

  // 직접 계산
  const couponCount = coupons.length;

  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning") => {
      onNotify?.(message, type);
    },
    [onNotify]
  );

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

  const removeCoupon = useCallback(
    (couponCode: string): boolean => {
      const result = couponModel.removeCoupon(couponCode, coupons);
      if (!result.success) {
        notify(result.error, "error");
        return false;
      }
      setCoupons(result.data);
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
