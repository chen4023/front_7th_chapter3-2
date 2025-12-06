// hooks/useNotifications.ts
// 알림(Toast) 관리 Hook
//
// 역할:
// - 알림 상태 관리
// - 알림 추가/제거
// - 자동 제거 타이머
//
// 반환할 값:
// - notifications: 알림 배열
// - addNotification: 알림 추가
// - removeNotification: 알림 제거

import { useState, useCallback } from "react";

// ============================================
// 타입 정의
// ============================================
export interface Notification {
  id: string;
  message: string;
  type: "error" | "success" | "warning";
}

export type NotifyFn = (
  message: string,
  type?: "error" | "success" | "warning"
) => void;

interface UseNotificationsOptions {
  /** 자동 제거 시간 (ms), 0이면 자동 제거 안함 */
  autoRemoveDelay?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  addNotification: NotifyFn;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ============================================
// useNotifications Hook
// ============================================
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { autoRemoveDelay = 3000 } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // === 알림 추가 ===
  const addNotification: NotifyFn = useCallback(
    (message, type = "success") => {
      const id = Date.now().toString();

      setNotifications((prev) => [...prev, { id, message, type }]);

      // 자동 제거
      if (autoRemoveDelay > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, autoRemoveDelay);
      }
    },
    [autoRemoveDelay]
  );

  // === 알림 제거 ===
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // === 모든 알림 제거 ===
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
