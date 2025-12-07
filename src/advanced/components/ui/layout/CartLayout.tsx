// components/ui/layout/CartLayout.tsx
import { useState } from "react";
import { useAtomValue } from "jotai";

import { CartButton } from "../feature/CartButton";
import { ModeSwitchButton } from "../feature/ModeSwitchButton";
import { SearchInput } from "../feature/SearchInput";
import { GlobalHeader } from "./GlobalHeader";
import { useDebounce } from "../../../utils/hooks/useDebounce";
import { totalItemCountAtom } from "../../../store";
import { CartPage } from "../cart/CartPage";

interface CartLayoutProps {
  onToggleAdmin: () => void;
}

export function CartLayout({ onToggleAdmin }: CartLayoutProps) {
  // 검색어는 이 페이지에서만 사용 → 로컬 상태
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 장바구니 개수는 전역 상태
  const cartItemCount = useAtomValue(totalItemCountAtom);

  return (
    <>
      <GlobalHeader
        center={<SearchInput value={searchTerm} onChange={setSearchTerm} />}
        right={
          <>
            <ModeSwitchButton isAdmin={false} onToggle={onToggleAdmin} />
            <CartButton itemCount={cartItemCount} />
          </>
        }
      />
      <CartPage debouncedSearchTerm={debouncedSearchTerm} />
    </>
  );
}
