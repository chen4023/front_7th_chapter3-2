// components/admin/AdminPage.tsx
import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminTabs, AdminTabType } from "./AdminTabs";
import { ProductSection } from "./product/ProductSection";
import { CouponSection } from "./coupon/CouponSection";
import { NotifyFn, UseProductsReturn } from "@/basic/hooks/useProducts";
import { UseCouponsReturn } from "@/basic/hooks/useCoupons";

// 타입 import

interface AdminPageProps {
  productActions: UseProductsReturn;
  couponActions: UseCouponsReturn;
  addNotification: NotifyFn;
}

export function AdminPage({
  productActions,
  couponActions,
  addNotification,
}: AdminPageProps) {
  // 🔹 탭 상태 추가
  const [activeTab, setActiveTab] = useState<AdminTabType>("products");

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <AdminHeader
          title="관리자 대시보드"
          description="상품과 쿠폰을 관리할 수 있습니다"
        />

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "products" ? (
          <ProductSection
            productActions={productActions}
            onNotify={addNotification}
          />
        ) : (
          <CouponSection
            couponActions={couponActions}
            onNotify={addNotification}
          />
        )}
      </div>
    </main>
  );
}