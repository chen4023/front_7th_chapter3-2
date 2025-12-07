import { ModeSwitchButton } from '../feature/ModeSwitchButton';
import { GlobalHeader } from './GlobalHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
  onToggleAdmin: () => void;
}

export function AdminLayout({ children, onToggleAdmin }: AdminLayoutProps) {
  return (
    <>
      <GlobalHeader
        right={<ModeSwitchButton isAdmin={true} onToggle={onToggleAdmin} />}
      />
      {children}
    </>
  );
}

