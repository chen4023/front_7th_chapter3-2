import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/basic/lib/utils"


const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // 기본 검정 버튼 - 주요 액션 (새 상품 추가, 장바구니 담기)
        default: "bg-gray-900 text-white hover:bg-gray-800",
        
        // 인디고 강조 버튼 - 폼 제출 (추가/수정/생성)
        primary: "bg-indigo-600 text-white hover:bg-indigo-700",
        
        // 테두리 버튼 - 보조 액션 (취소)
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
        
        // 텍스트 버튼 - 최소 강조 (토글, 네비게이션)
        ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        
        // 삭제/위험 액션
        destructive: "text-red-600 hover:text-red-900",
        
        // 링크 스타일 - 인라인 액션 (수정)
        link: "text-indigo-600 hover:text-indigo-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 py-1.5 text-sm",
        lg: "h-11 px-6 py-3",
        icon: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
