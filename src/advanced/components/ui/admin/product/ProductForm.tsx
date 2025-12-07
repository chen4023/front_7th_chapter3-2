// components/admin/ProductForm.tsx

import { ProductFormHook } from "@/basic/hooks/useProductForm";
import { Button } from "../../common/button";

interface ProductFormProps {
  productForm: ProductFormHook;
  onNotify: (message: string, type: 'error' | 'success' | 'warning') => void;
}

export function ProductForm({ productForm, onNotify }: ProductFormProps) {
  if (!productForm.isOpen) return null;

  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50">
      <form onSubmit={productForm.submit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          {productForm.editingId ? '상품 수정' : '새 상품 추가'}
        </h3>

        {/* 기본 정보 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상품명
            </label>
            <input
              type="text"
              value={productForm.form.name}
              onChange={(e) =>
                productForm.setForm({ ...productForm.form, name: e.target.value })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <input
              type="text"
              value={productForm.form.description}
              onChange={(e) =>
                productForm.setForm({
                  ...productForm.form,
                  description: e.target.value,
                })
              }
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              가격
            </label>
            <input
              type="text"
              value={productForm.form.price === 0 ? '' : productForm.form.price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  productForm.setForm({
                    ...productForm.form,
                    price: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  productForm.setForm({ ...productForm.form, price: 0 });
                } else if (parseInt(value) < 0) {
                  onNotify('가격은 0보다 커야 합니다', 'error');
                  productForm.setForm({ ...productForm.form, price: 0 });
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재고
            </label>
            <input
              type="text"
              value={productForm.form.stock === 0 ? '' : productForm.form.stock}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  productForm.setForm({
                    ...productForm.form,
                    stock: value === '' ? 0 : parseInt(value),
                  });
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '') {
                  productForm.setForm({ ...productForm.form, stock: 0 });
                } else if (parseInt(value) < 0) {
                  onNotify('재고는 0보다 커야 합니다', 'error');
                  productForm.setForm({ ...productForm.form, stock: 0 });
                } else if (parseInt(value) > 9999) {
                  onNotify('재고는 9999개를 초과할 수 없습니다', 'error');
                  productForm.setForm({ ...productForm.form, stock: 9999 });
                }
              }}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-3 py-2 border"
              placeholder="숫자만 입력"
              required
            />
          </div>
        </div>

        {/* 할인 정책 */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            할인 정책
          </label>
          <div className="space-y-2">
            {productForm.form.discounts.map((discount, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <input
                  type="number"
                  value={discount.quantity}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.form.discounts];
                    newDiscounts[index].quantity = parseInt(e.target.value) || 0;
                    productForm.setForm({
                      ...productForm.form,
                      discounts: newDiscounts,
                    });
                  }}
                  className="w-20 px-2 py-1 border rounded"
                  min="1"
                  placeholder="수량"
                />
                <span className="text-sm">개 이상 구매 시</span>
                <input
                  type="number"
                  value={discount.rate * 100}
                  onChange={(e) => {
                    const newDiscounts = [...productForm.form.discounts];
                    newDiscounts[index].rate = (parseInt(e.target.value) || 0) / 100;
                    productForm.setForm({
                      ...productForm.form,
                      discounts: newDiscounts,
                    });
                  }}
                  className="w-16 px-2 py-1 border rounded"
                  min="0"
                  max="100"
                  placeholder="%"
                />
                <span className="text-sm">% 할인</span>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    const newDiscounts = productForm.form.discounts.filter(
                      (_, i) => i !== index
                    );
                    productForm.setForm({
                      ...productForm.form,
                      discounts: newDiscounts,
                    });
                  }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="link"
              onClick={() => {
                productForm.setForm({
                  ...productForm.form,
                  discounts: [
                    ...productForm.form.discounts,
                    { quantity: 10, rate: 0.1 },
                  ],
                });
              }}
            >
              + 할인 추가
            </Button>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={productForm.close}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            {productForm.editingId ? '수정' : '추가'}
          </Button>
        </div>
      </form>
    </div>
  );
}