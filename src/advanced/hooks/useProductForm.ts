// hooks/useProductForm.ts
// 상품 폼 관리 Hook

import { useState, useCallback } from "react";
import { ProductWithUI } from "@/types";

// ============================================
// 타입 & 상수
// ============================================
export interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  description: string;
  discounts: Array<{ quantity: number; rate: number }>;
}

const INITIAL_FORM: ProductFormData = {
  name: "",
  price: 0,
  stock: 0,
  description: "",
  discounts: [],
};

interface UseProductFormOptions {
  addProduct: (product: Omit<ProductWithUI, "id">) => boolean;
  updateProduct: (
    productId: string,
    updates: Partial<Omit<ProductWithUI, "id">>
  ) => boolean;
}

export interface ProductFormHook {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  isOpen: boolean;
  editingId: string | null;
  open: () => void;
  openEdit: (product: ProductWithUI) => void;
  close: () => void;
  submit: (e: React.FormEvent) => void;
}

// ============================================
// Hook
// ============================================
export function useProductForm({
  addProduct,
  updateProduct,
}: UseProductFormOptions): ProductFormHook {
  const [form, setForm] = useState<ProductFormData>(INITIAL_FORM);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const open = useCallback(() => {
    setForm(INITIAL_FORM);
    setEditingId(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((product: ProductWithUI) => {
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      discounts: product.discounts || [],
    });
    setEditingId(product.id);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
  }, []);

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const success = editingId
        ? updateProduct(editingId, form)
        : addProduct(form);

      if (success) close();
    },
    [form, editingId, addProduct, updateProduct, close]
  );

  return {
    form,
    setForm,
    isOpen,
    editingId,
    open,
    openEdit,
    close,
    submit,
  };
}
