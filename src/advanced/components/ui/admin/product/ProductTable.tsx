import { Product, ProductWithUI } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../common/table";
import { Badge } from "../../common/badge";
import { Button } from "../../common/button";

// Props 타입 정의 (필요시)
interface ProductTableProps {
  products: ProductWithUI[]; // Product 타입은 별도 정의되었다고 가정
  onStartEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  formatPrice: (price: number, id: string) => string;
}

export function ProductTable({
  products,
  onStartEditProduct,
  onDeleteProduct,
  formatPrice
}: ProductTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[120px] pl-6">상품명</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>재고</TableHead>
            <TableHead className="hidden md:table-cell">설명</TableHead>
            <TableHead className="text-right">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: ProductWithUI) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium text-gray-900 pl-6">
                {product.name}
              </TableCell>

              <TableCell className="text-gray-500">
                {formatPrice(product.price, product.id)}
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    product.stock > 10
                      ? 'stockHigh' 
                      : product.stock > 0
                        ? 'stockLow'
                        : 'stockHigh'
                  }
                >
                  {product.stock}개
                </Badge>
              </TableCell>

              <TableCell className="max-w-xs truncate text-gray-500 hidden md:table-cell">
                {product.description || '-'}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  onClick={() => onStartEditProduct(product)}
                  variant="ghost" 
                  size="sm"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  수정
                </Button>
                <Button
                  onClick={() => onDeleteProduct(product.id)}
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-900"
                >
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* 데이터가 없을 때 처리 */}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                등록된 상품이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}