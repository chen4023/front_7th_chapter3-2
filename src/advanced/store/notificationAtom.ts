// Notification Store (Jotai Atom)
// 알림 전역 상태

import { atom } from "jotai";
import { Notification } from "../types";

// Base Atom
/** 알림 목록 */
export const notificationsAtom = atom<Notification[]>([]);
