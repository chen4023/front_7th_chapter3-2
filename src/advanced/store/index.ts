
// Store Index - 모든 Atom export

// 아키텍처:
// store (상태만) → hooks (액션+알림) → Component

// Product Store
export { productsAtom, productCountAtom, getProductByIdAtom } from "./productAtom";

// Cart Store
export {
  cartAtom,
  selectedCouponAtom,
  totalItemCountAtom,
  cartTotalsAtom,
  getRemainingStockAtom,
} from "./cartAtom";

// Coupon Store
export { couponsAtom, couponCountAtom, getCouponByCodeAtom } from "./couponAtom";

// Notification Store
export {
  notificationsAtom,
  notificationCountAtom,
  hasNotificationsAtom,
} from "./notificationAtom";
