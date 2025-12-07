// components/admin/AdminTabs.tsx

export type AdminTabType = 'products' | 'coupons';

interface Tab {
  key: AdminTabType;
  label: string;
}

const TABS: Tab[] = [
  { key: 'products', label: '상품 관리' },
  { key: 'coupons', label: '쿠폰 관리' },
];

interface AdminTabsProps {
  activeTab: AdminTabType;
  onTabChange: (tab: AdminTabType) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}