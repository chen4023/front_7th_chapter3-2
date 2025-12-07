import { useState } from 'react';
import { CartLayout } from './components/ui/layout/CartLayout';
import { AdminPage } from './components/ui/admin';
import { AdminLayout } from './components/ui/layout/AdminLayout';
import { CartPage } from './components/ui/cart/CartPage';

// 커스텀 훅
import { useCart } from './hooks/useCart';
import { useCoupons } from './hooks/useCoupons';
import { useProducts } from './hooks/useProducts';
import { useNotifications } from './hooks/useNotifications';
import { NotificationList } from './components/ui/common/NotificationList';

const App = () => {
  // === Notifications ===
  const { notifications, addNotification, removeNotification } = useNotifications();

  // === 도메인 훅 (actions로 그룹화) ===
  const productActions = useProducts({ onNotify: addNotification });
  const couponActions = useCoupons({ onNotify: addNotification });
  const cartActions = useCart({ onNotify: addNotification });

  // === UI State ===
  const [isAdmin, setIsAdmin] = useState(false);

  // === Render ===
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList notifications={notifications} onRemove={removeNotification} />

      {/* Page Content */}
      {isAdmin ? (
        <AdminLayout onToggleAdmin={() => setIsAdmin(false)}>
          <AdminPage
            addNotification={addNotification}
            productActions={productActions}
            couponActions={couponActions}
          />
        </AdminLayout>
      ) : (
        <CartLayout
          cartItemCount={cartActions.totalItemCount}
          onToggleAdmin={() => setIsAdmin(true)}
        >
          {({ debouncedSearchTerm }) => (
            <CartPage
              products={productActions.products}
              coupons={couponActions.coupons}
              cartActions={cartActions}
              debouncedSearchTerm={debouncedSearchTerm}
            />
          )}
        </CartLayout>
      )}
    </div>
  );
};

export default App;