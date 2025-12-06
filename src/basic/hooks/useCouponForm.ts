// hooks/useCouponForm.ts
// 쿠폰 폼 관리 Hook

import { useState, useCallback } from "react";
import { Coupon } from "@/types";

// ============================================
// 타입 & 상수
// ============================================
export interface CouponFormData {
  name: string;
  code: string;
  discountType: "amount" | "percentage";
  discountValue: number;
}

const INITIAL_FORM: CouponFormData = {
  name: "",
  code: "",
  discountType: "amount",
  discountValue: 0,
};

interface UseCouponFormOptions {
  addCoupon: (coupon: Coupon) => boolean;
}

export interface CouponFormHook {
  form: CouponFormData;
  setForm: React.Dispatch<React.SetStateAction<CouponFormData>>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  submit: (e: React.FormEvent) => void;
}

// ============================================
// Hook
// ============================================
export function useCouponForm({
  addCoupon,
}: UseCouponFormOptions): CouponFormHook {
  const [form, setForm] = useState<CouponFormData>(INITIAL_FORM);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setForm(INITIAL_FORM);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setForm(INITIAL_FORM);
  }, []);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const success = addCoupon(form);
      if (success) close();
    },
    [form, addCoupon, close]
  );

  return {
    form,
    setForm,
    isOpen,
    open,
    close,
    submit,
  };
}
