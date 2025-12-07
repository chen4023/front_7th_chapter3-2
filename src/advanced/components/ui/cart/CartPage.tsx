// components/CartPage.tsx
import { useMemo } from 'react';
import { Product, Coupon } from '@/types';
import { ProductCard } from './ProductCard';
import { Button } from '../common/button';
import { useCart } from '../../../hooks/useCart';
import { calculateItemTotal, filterProductsBySearch } from '../../../models/cart';
// TODO: UI 분리 필요
interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

interface CartPageProps {
  products: ProductWithUI[];
  coupons: Coupon[];
  cartActions: ReturnType<typeof useCart>;
  debouncedSearchTerm: string;
}

export function CartPage({
  products,
  coupons,
  cartActions,
  debouncedSearchTerm,
}: CartPageProps) {
  const {
    cart,
    selectedCoupon,
    totals,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    completeOrder,
    getRemainingStock,
  } = cartActions;

  // 필터링된 상품 목록
  const filteredProducts = useMemo(
    () => filterProductsBySearch(products, debouncedSearchTerm),
    [products, debouncedSearchTerm]
  );

  // 아이템 총액 계산
  const getItemTotal = (item: { product: Product; quantity: number }) =>
    calculateItemTotal(item, cart);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* 상품 목록 */}
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">전체 상품</h2>
              <div className="text-sm text-gray-600">
                총 {products.length}개 상품
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => {
                  const remainingStock = getRemainingStock(product);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      remainingStock={remainingStock}
                      onAddToCart={() => addToCart(product)}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* 장바구니 섹션 */}
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                장바구니
              </h2>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="text-gray-500 text-sm">장바구니가 비어있습니다</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const itemTotal = getItemTotal(item);
                    const originalPrice = item.product.price * item.quantity;
                    const hasDiscount = itemTotal < originalPrice;
                    const discountRate = hasDiscount
                      ? Math.round((1 - itemTotal / originalPrice) * 100)
                      : 0;

                    return (
                      <div
                        key={item.product.id}
                        className="border-b pb-3 last:border-b-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-sm font-medium text-gray-900 flex-1">
                            {item.product.name}
                          </h4>
                          <Button
                            onClick={() => removeFromCart(item.product.id)}
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 ml-2"
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              variant="outline"
                              size="icon"
                            >
                              <span className="text-xs">−</span>
                            </Button>
                            <span className="mx-3 text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              variant="outline"
                              size="icon"
                            >
                              <span className="text-xs">+</span>
                            </Button>
                          </div>
                          <div className="text-right">
                            {hasDiscount && (
                              <span className="text-xs text-red-500 font-medium block">
                                -{discountRate}%
                              </span>
                            )}
                            <p className="text-sm font-medium text-gray-900">
                              {Math.round(itemTotal).toLocaleString()}원
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {cart.length > 0 && (
              <>
                {/* 쿠폰 섹션 */}
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      쿠폰 할인
                    </h3>
                    <Button
                      variant="link"
                      className="text-xs text-blue-600 h-auto p-0"
                    >
                      쿠폰 등록
                    </Button>
                  </div>
                  {coupons.length > 0 && (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={selectedCoupon?.code || ''}
                      onChange={(e) => {
                        const coupon = coupons.find(
                          (c) => c.code === e.target.value
                        );
                        if (coupon) applyCoupon(coupon);
                        else removeCoupon();
                      }}
                    >
                      <option value="">쿠폰 선택</option>
                      {coupons.map((coupon) => (
                        <option key={coupon.code} value={coupon.code}>
                          {coupon.name} (
                          {coupon.discountType === 'amount'
                            ? `${coupon.discountValue.toLocaleString()}원`
                            : `${coupon.discountValue}%`}
                          )
                        </option>
                      ))}
                    </select>
                  )}
                </section>

                {/* 결제 정보 섹션 */}
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">상품 금액</span>
                      <span className="font-medium">
                        {totals.totalBeforeDiscount.toLocaleString()}원
                      </span>
                    </div>
                    {totals.totalDiscount > 0 && (
                      <div className="flex justify-between text-red-500">
                        <span>할인 금액</span>
                        <span>-{totals.totalDiscount.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t border-gray-200">
                      <span className="font-semibold">결제 예정 금액</span>
                      <span className="font-bold text-lg text-gray-900">
                        {totals.totalAfterDiscount.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={completeOrder}
                    size="lg"
                    className="w-full mt-4 bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                  >
                    {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                  </Button>

                  <div className="mt-3 text-xs text-gray-500 text-center">
                    <p>* 실제 결제는 이루어지지 않습니다</p>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}