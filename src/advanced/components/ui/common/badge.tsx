import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/basic/lib/utils"
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-transparent",
  {
    variants: {
      variant: {
        stockHigh: "bg-green-100 text-green-800",
        stockLow: "bg-yellow-100 text-yellow-800",
        stockOut: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "stockHigh",
    },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
