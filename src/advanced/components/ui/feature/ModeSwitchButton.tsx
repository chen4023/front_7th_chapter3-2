import { Button } from "../common/button";

interface ModeSwitchButtonProps {
  isAdmin: boolean;
  onToggle: () => void;
}

export function ModeSwitchButton({ isAdmin, onToggle }: ModeSwitchButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant={isAdmin ? 'default' : 'ghost'}
      size="sm"
    >
      {isAdmin ? '쇼핑몰로 돌아가기' : '관리자 페이지로'}
    </Button>
  );
}

