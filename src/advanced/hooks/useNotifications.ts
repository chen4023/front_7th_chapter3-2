// useNotifications Hook (Jotai 기반)

import { useCallback } from "react";
import { useAtom } from "jotai";
import { Notification } from "../types";
import { notificationsAtom } from "../store";

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

export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const { autoRemoveDelay = 3000 } = options;

  const [notifications, setNotifications] = useAtom(notificationsAtom);

  // 직접 계산
  const notificationCount = notifications.length;

  const addNotification: NotifyFn = useCallback(
    (message, type = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      if (autoRemoveDelay > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, autoRemoveDelay);
      }
    },
    [setNotifications, autoRemoveDelay]
  );

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [setNotifications]
  );

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
