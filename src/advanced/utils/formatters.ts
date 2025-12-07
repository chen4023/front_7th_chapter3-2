// TODO: 포맷팅 유틸리티 함수들
// 구현할 함수:
// - formatPrice(price: number): string - 가격을 한국 원화 형식으로 포맷
// - formatDate(date: Date): string - 날짜를 YYYY-MM-DD 형식으로 포맷
// - formatPercentage(rate: number): string - 소수를 퍼센트로 변환 (0.1 → 10%)

type PriceNotation = "text" | "symbol";

/** 가격 포맷팅 */
export const formatPrice = (price: number, type?: PriceNotation): string => {
  if (type === "text") return `${price.toLocaleString()}원`;
  return `₩${price.toLocaleString()}`;
};

/** 할인율 포맷팅 (0.1 -> "10%") */
export const formatPercentage = (rate: number): string => {
  return `${Math.round(rate * 100)}%`;
};

/** 날짜 포맷팅 (YYYY-MM-DD) */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
