
// useNotifications Hook (Jotai 기반)

// 역할: 알림 상태 관리 + 자동 제거

import { useCallback } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Notification } from "../types";
import { notificationsAtom, notificationCountAtom } from "../store";


// 타입 정의


export type NotifyFn = (
  message: string,
  type?: "error" | "success" | "warning"
) => void;

interface UseNotificationsOptions {
  autoRemoveDelay?: number;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  notificationCount: number;
  addNotification: NotifyFn;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}


// useNotifications Hook


export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { autoRemoveDelay = 3000 } = options;

  // === store에서 상태 읽기 ===
  const [notifications, setNotifications] = useAtom(notificationsAtom);
  const notificationCount = useAtomValue(notificationCountAtom);

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
    [setNotifications, autoRemoveDelay]
  );

  // === 알림 제거 ===
  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications]
  );

  // === 모든 알림 제거 ===
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, [setNotifications]);

  return {
    notifications,
    notificationCount,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}
