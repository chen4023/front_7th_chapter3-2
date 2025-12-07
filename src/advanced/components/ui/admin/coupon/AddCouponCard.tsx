import { Button } from "../../common/button";
import { Card } from "../../common/card";


interface AddCouponCardProps {
  onClick: () => void;
}

export function AddCouponCard({ onClick }: AddCouponCardProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors gap-0">
      <Button
        onClick={onClick}
        variant="ghost"
        className="flex flex-col items-center h-auto text-gray-400 hover:text-gray-600"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <p className="mt-2 text-sm font-medium">새 쿠폰 추가</p>
      </Button>
    </Card>
  );
}

