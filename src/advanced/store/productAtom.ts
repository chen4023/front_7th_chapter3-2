
// Product Store (Jotai Atom)

// 상품 전역 상태 - 순수하게 상태만 정의
//
// 아키텍처:
// constants (초기값) → store (상태) → hooks (액션+알림) → Component

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../types";
import { initialProducts } from "../constants";
import * as productModel from "../models/product";


// Base Atoms


/** 상품 목록 (localStorage 동기화) */
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);


// Derived Atoms (읽기 전용)


/** 상품 개수 */
export const productCountAtom = atom((get) => get(productsAtom).length);

/** ID로 상품 찾기 함수 */
export const getProductByIdAtom = atom((get) => {
  const products = get(productsAtom);
  return (productId: string) => productModel.findProductById(productId, products);
});
