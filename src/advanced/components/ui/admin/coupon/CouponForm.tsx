// components/admin/CouponForm.tsx

import { CouponFormHook } from "@/basic/hooks/useCouponForm";
import { Button } from "../../common/button";

interface CouponFormProps {
  couponForm: CouponFormHook;
  onNotify: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function CouponForm({ couponForm, onNotify }: CouponFormProps) {
  if (!couponForm.isOpen) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <form onSubmit={couponForm.submit} className="space-y-4">
        <h3 className="text-md font-medium text-gray-900">새 쿠폰 생성</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰명
            </label>
            <input
              type="text"
              value={couponForm.form.name}
              onChange={(e) =>
                couponForm.setForm({ ...couponForm.form, name: e.target.value })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder="신규 가입 쿠폰"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              쿠폰 코드
            </label>
            <input
              type="text"
              value={couponForm.form.code}
              onChange={(e) =>
                couponForm.setForm({
                  ...couponForm.form,
                  code: e.target.value.toUpperCase(),
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm font-mono"
              placeholder="WELCOME2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              할인 타입
            </label>
            <select
              value={couponForm.form.discountType}
              onChange={(e) =>
                couponForm.setForm({
                  ...couponForm.form,
                  discountType: e.target.value as 'amount' | 'percentage',
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
            >
              <option value="amount">정액 할인</option>
              <option value="percentage">정률 할인</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {couponForm.form.discountType === 'amount'
                ? '할인 금액'
                : '할인율(%)'}
            </label>
            <input
              type="text"
              value={
                couponForm.form.discountValue === 0
                  ? ''
                  : couponForm.form.discountValue
              }
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  couponForm.setForm({
                    ...couponForm.form,
                    discountValue: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (couponForm.form.discountType === 'percentage') {
                  if (value > 100) {
                    onNotify('할인율은 100%를 초과할 수 없습니다', 'error');
                    couponForm.setForm({
                      ...couponForm.form,
                      discountValue: 100,
                    });
                  } else if (value < 0) {
                    couponForm.setForm({
                      ...couponForm.form,
                      discountValue: 0,
                    });
                  }
                } else {
                  if (value > 100000) {
                    onNotify(
                      '할인 금액은 100,000원을 초과할 수 없습니다',
                      'error'
                    );
                    couponForm.setForm({
                      ...couponForm.form,
                      discountValue: 100000,
                    });
                  } else if (value < 0) {
                    couponForm.setForm({
                      ...couponForm.form,
                      discountValue: 0,
                    });
                  }
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border text-sm"
              placeholder={
                couponForm.form.discountType === 'amount' ? '5000' : '10'
              }
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={couponForm.close}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            쿠폰 생성
          </Button>
        </div>
      </form>
    </div>
  );
}