import { Coupon } from '@/types';
import { Card, CardContent } from '../../common/card';
import { Button } from '../../common/button';


interface CouponCardProps {
  coupon: Coupon;
  onDelete: () => void;
}

export function CouponCard({ coupon, onDelete }: CouponCardProps) {
  return (
    <Card className="relative bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200 gap-0">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{coupon.name}</h3>
            <p className="text-sm text-gray-600 mt-1 font-mono">{coupon.code}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-indigo-700">
                {coupon.discountType === 'amount'
                  ? `${coupon.discountValue.toLocaleString()}원 할인`
                  : `${coupon.discountValue}% 할인`}
              </span>
            </div>
          </div>
          <Button
            onClick={onDelete}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-red-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

