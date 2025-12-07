interface GlobalHeaderProps {
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export function GlobalHeader({ center, right }: GlobalHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 1. Logo Section: 항상 고정 */}
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-semibold text-gray-800">SHOP</h1>

            {/* 2. Center Slot: 검색창 등 */}
            {center && <div className="ml-8 flex-1 max-w-md">{center}</div>}
          </div>

          {/* 3. Right Slot: 버튼, 카트 등 */}
          <nav className="flex items-center space-x-4">{right}</nav>
        </div>
      </div>
    </header>
  );
}

