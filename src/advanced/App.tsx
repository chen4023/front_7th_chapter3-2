import { useState } from "react";
import { CartLayout } from "./components/ui/layout/CartLayout";
import { AdminPage } from "./components/ui/admin";
import { AdminLayout } from "./components/ui/layout/AdminLayout";
import { NotificationList } from "./components/ui/common/NotificationList";

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationList />
      {isAdmin ? (
        <AdminLayout onToggleAdmin={() => setIsAdmin(false)}>
          <AdminPage />
        </AdminLayout>
      ) : (
        <CartLayout onToggleAdmin={() => setIsAdmin(true)} />
      )}
    </div>
  );
};

export default App;
