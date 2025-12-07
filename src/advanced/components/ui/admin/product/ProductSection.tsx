// components/admin/product/ProductSection.tsx
import { useCallback } from "react";
import { Button } from "../../common/button";
import { ProductTable } from "./ProductTable";
import { ProductForm } from "./ProductForm";
import { useProductForm } from "@/basic/hooks/useProductForm";
import { NotifyFn, UseProductsReturn } from "@/basic/hooks/useProducts";

interface ProductSectionProps {
  productActions: UseProductsReturn;
  onNotify: NotifyFn; // (message, type) => void
}

export function ProductSection({
  productActions,
  onNotify,
}: ProductSectionProps) {
  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
  } = productActions;

  const productForm = useProductForm({
    addProduct,
    updateProduct,
  });

  const onDeleteProduct = useCallback(
    (id: string) => {
      const success = removeProduct(id);
      // useProducts에서 이미 notify를 하고 있다면 이 부분은 빼도 되지만,
      // UI용으로 한 번 더 알리고 싶다면 남겨도 괜찮습니다.
      if (success) {
        onNotify("상품이 삭제되었습니다.", "success");
      }
    },
    [removeProduct, onNotify]
  );

  // 🔹 가격 포맷터
  const formatPrice = (price: number) =>
    `${price.toLocaleString("ko-KR")}원`;

  return (
    <section className="bg-white rounded-lg border border-gray-200">
      {/* 섹션 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <Button onClick={productForm.open}>새 상품 추가</Button>
        </div>
      </div>

      {/* 상품 테이블 */}
      <div className="overflow-x-auto">
        <ProductTable
          products={products}
          onStartEditProduct={productForm.openEdit}
          onDeleteProduct={onDeleteProduct}
          formatPrice={formatPrice}
        />
      </div>

      {/* 상품 추가/수정 폼 */}
      <ProductForm productForm={productForm} onNotify={onNotify} />
    </section>
  );
}