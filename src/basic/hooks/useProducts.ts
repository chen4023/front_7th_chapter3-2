// TODO: 상품 관리 Hook
// 힌트:
// 1. 상품 목록 상태 관리 (localStorage 연동 고려)
// 2. 상품 CRUD 작업
// 3. 재고 업데이트
// 4. 할인 규칙 추가/삭제
//
// 반환할 값:
// - products: 상품 배열
// - updateProduct: 상품 정보 수정
// - addProduct: 새 상품 추가
// - updateProductStock: 재고 수정
// - addProductDiscount: 할인 규칙 추가
// - removeProductDiscount: 할인 규칙 삭제

import { useCallback } from "react";
import { ProductWithUI } from "@/types";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { initialProducts } from "../constants";
import * as productModel from "../models/product";

// 타입 정의
export type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

interface UseProductsOptions {
  /** 알림 함수 (선택적) */
  onNotify?: NotifyFn;
  /** localStorage 키 */
  storageKey?: string;
}

export interface UseProductsReturn {
  // 상태
  products: ProductWithUI[];

  // CRUD 액션
  addProduct: (product: Omit<ProductWithUI, "id">) => boolean;
  updateProduct: (
    productId: string,
    updates: Partial<Omit<ProductWithUI, "id">>
  ) => boolean;
  removeProduct: (productId: string) => boolean;

  // 재고 액션
  updateProductStock: (productId: string, newStock: number) => boolean;

  // 할인 액션
  addProductDiscount: (
    productId: string,
    discount: productModel.Discount
  ) => boolean;
  removeProductDiscount: (productId: string, discountIndex: number) => boolean;
}
// useProducts Hook
export function useProducts(
  options: UseProductsOptions = {}
): UseProductsReturn {
  const { onNotify, storageKey = "products" } = options;

  // === 상태 (localStorage 연동) ===
  const [products, setProducts] = useLocalStorage<ProductWithUI[]>(
    storageKey,
    initialProducts
  );

  // === 헬퍼: 안전한 알림 호출 ===
  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning") => {
      onNotify?.(message, type);
    },
    [onNotify]
  );

  // === 액션: 상품 추가 ===
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">): boolean => {
      const result = productModel.addProduct(newProduct, products);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setProducts(result.data);
      notify("상품이 추가되었습니다.", "success");
      return true;
    },
    [products, setProducts, notify]
  );

  // === 액션: 상품 수정 ===
  const updateProduct = useCallback(
    (
      productId: string,
      updates: Partial<Omit<ProductWithUI, "id">>
    ): boolean => {
      const result = productModel.updateProduct(productId, updates, products);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setProducts(result.data);
      notify("상품이 수정되었습니다.", "success");
      return true;
    },
    [products, setProducts, notify]
  );

  // === 액션: 상품 삭제 ===
  const removeProduct = useCallback(
    (productId: string): boolean => {
      const result = productModel.removeProduct(productId, products);

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setProducts(result.data);
      notify("상품이 삭제되었습니다.", "success");
      return true;
    },
    [products, setProducts, notify]
  );

  // === 액션: 재고 수정 ===
  const updateProductStock = useCallback(
    (productId: string, newStock: number): boolean => {
      const result = productModel.updateProductStock(
        productId,
        newStock,
        products
      );

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setProducts(result.data);
      notify("재고가 수정되었습니다.", "success");
      return true;
    },
    [products, setProducts, notify]
  );

  // === 액션: 할인 규칙 추가 ===
  const addProductDiscount = useCallback(
    (productId: string, discount: productModel.Discount): boolean => {
      const result = productModel.addProductDiscount(
        productId,
        discount,
        products
      );

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setProducts(result.data);
      notify("할인 규칙이 추가되었습니다.", "success");
      return true;
    },
    [products, setProducts, notify]
  );

  // === 액션: 할인 규칙 삭제 ===
  const removeProductDiscount = useCallback(
    (productId: string, discountIndex: number): boolean => {
      const result = productModel.removeProductDiscount(
        productId,
        discountIndex,
        products
      );

      if (!result.success) {
        notify(result.error, "error");
        return false;
      }

      setProducts(result.data);
      notify("할인 규칙이 삭제되었습니다.", "success");
      return true;
    },
    [products, setProducts, notify]
  );

  return {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
