// components/admin/AdminPage.tsx
import { useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminTabs, AdminTabType } from "./AdminTabs";
import { ProductSection } from "./product/ProductSection";
import { CouponSection } from "./coupon/CouponSection";
import { useProducts } from "../../../hooks/useProducts";
import { useCoupons } from "../../../hooks/useCoupons";
import { useNotifications } from "../../../hooks/useNotifications";

export function AdminPage() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState<AdminTabType>("products");

  // 전역 상태에서 직접 가져오기
  const { addNotification } = useNotifications();
  const productActions = useProducts({ onNotify: addNotification });
  const couponActions = useCoupons({ onNotify: addNotification });

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
