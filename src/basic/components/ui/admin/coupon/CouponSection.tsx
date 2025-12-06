import { useCouponForm } from "@/basic/hooks/useCouponForm";
import { UseCouponsReturn } from "@/basic/hooks/useCoupons";
import { CouponCard } from "./CouponCard";
import { AddCouponCard } from "./AddCouponCard";
import { CouponForm } from "./CouponForm";


type NotifyFn = (message: string, type: 'error' | 'success' | 'warning') => void;

interface CouponSectionProps {
  couponActions: UseCouponsReturn;
  onNotify: NotifyFn;
}

export function CouponSection({
  couponActions,
  onNotify,
}: CouponSectionProps) {
  const { coupons, addCoupon, removeCoupon } = couponActions;
  const couponForm = useCouponForm({ addCoupon });

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 섹션 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">쿠폰 관리</h2>
      </div>

      {/* 쿠폰 목록 */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((coupon) => (
            <CouponCard
              key={coupon.code}
              coupon={coupon}
              onDelete={() => removeCoupon(coupon.code)}
            />
          ))}
          <AddCouponCard
            onClick={() =>
              couponForm.isOpen ? couponForm.close() : couponForm.open()
            }
          />
        </div>

        {/* 쿠폰 추가 폼 */}
        <CouponForm couponForm={couponForm} onNotify={onNotify} />
      </div>
    </section>
  );
}