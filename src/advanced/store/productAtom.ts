// Product Store (Jotai Atom)
// 상품 전역 상태

import { atomWithStorage } from "jotai/utils";
import { ProductWithUI } from "../types";
import { initialProducts } from "../constants";

// Base Atom
/** 상품 목록 (localStorage 동기화) */
export const productsAtom = atomWithStorage<ProductWithUI[]>(
  "products",
  initialProducts
);
