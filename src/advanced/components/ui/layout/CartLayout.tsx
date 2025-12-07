// components/ui/layout/CartLayout.tsx
import { useState } from 'react';

import { CartButton } from '../feature/CartButton';
import { ModeSwitchButton } from '../feature/ModeSwitchButton';
import { SearchInput } from '../feature/SearchInput';
import { GlobalHeader } from './GlobalHeader';
import { useDebounce } from '@/basic/utils/hooks/useDebounce';

interface CartLayoutRenderProps {
  debouncedSearchTerm: string;
}

interface CartLayoutProps {
  children: (props: CartLayoutRenderProps) => React.ReactNode;
  cartItemCount: number;
  onToggleAdmin: () => void;
}

export function CartLayout({
  children,
  cartItemCount,
  onToggleAdmin,
}: CartLayoutProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <>
      <GlobalHeader
        center={
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
          />
        }
        right={
          <>
            <ModeSwitchButton isAdmin={false} onToggle={onToggleAdmin} />
            <CartButton itemCount={cartItemCount} />
          </>
        }
      />
      {children({ debouncedSearchTerm })}
    </>
  );
}