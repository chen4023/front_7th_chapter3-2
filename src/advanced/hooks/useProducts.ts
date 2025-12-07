// useProducts Hook (Jotai 기반)

import { useCallback } from "react";
import { useAtom } from "jotai";
import { ProductWithUI } from "../types";
import { productsAtom } from "../store";
import * as productModel from "../models/product";

export type NotifyFn = (
  message: string,
  type: "error" | "success" | "warning"
) => void;

interface UseProductsOptions {
  onNotify?: NotifyFn;
}

export interface UseProductsReturn {
  products: ProductWithUI[];
  productCount: number;
  addProduct: (product: Omit<ProductWithUI, "id">) => boolean;
  updateProduct: (
    productId: string,
    updates: Partial<Omit<ProductWithUI, "id">>
  ) => boolean;
  removeProduct: (productId: string) => boolean;
  updateProductStock: (productId: string, newStock: number) => boolean;
  addProductDiscount: (
    productId: string,
    discount: productModel.Discount
  ) => boolean;
  removeProductDiscount: (productId: string, discountIndex: number) => boolean;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const { onNotify } = options;

  const [products, setProducts] = useAtom(productsAtom);

  // 직접 계산
  const productCount = products.length;

  const notify = useCallback(
    (message: string, type: "error" | "success" | "warning") => {
      onNotify?.(message, type);
    },
    [onNotify]
  );

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

  const updateProduct = useCallback(
    (productId: string, updates: Partial<Omit<ProductWithUI, "id">>): boolean => {
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

  const updateProductStock = useCallback(
    (productId: string, newStock: number): boolean => {
      const result = productModel.updateProductStock(productId, newStock, products);
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

  const addProductDiscount = useCallback(
    (productId: string, discount: productModel.Discount): boolean => {
      const result = productModel.addProductDiscount(productId, discount, products);
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

  const removeProductDiscount = useCallback(
    (productId: string, discountIndex: number): boolean => {
      const result = productModel.removeProductDiscount(productId, discountIndex, products);
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
    productCount,
    addProduct,
    updateProduct,
    removeProduct,
    updateProductStock,
    addProductDiscount,
    removeProductDiscount,
  };
}
