// ============================================
// Notification Store (Jotai Atom)
// ============================================
// 알림 전역 상태 - 순수하게 상태만 정의

import { atom } from "jotai";
import { Notification } from "../types";

// ============================================
// Base Atoms
// ============================================

/** 알림 목록 */
export const notificationsAtom = atom<Notification[]>([]);

// ============================================
// Derived Atoms (읽기 전용)
// ============================================

/** 알림 개수 */
export const notificationCountAtom = atom((get) => get(notificationsAtom).length);

/** 알림 존재 여부 */
export const hasNotificationsAtom = atom((get) => get(notificationsAtom).length > 0);
