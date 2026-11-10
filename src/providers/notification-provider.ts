import type { NotificationProvider } from "@refinedev/core";
import { toast } from "sonner";

export const notificationProvider: NotificationProvider = {
  open: ({
    key,
    message,
    description,
    type,
    undoableTimeout,
    cancelMutation,
  }) => {
    const id = key ?? String(Date.now());
    const action = cancelMutation
      ? { label: "Undo", onClick: cancelMutation }
      : undefined;

    if (type === "progress") {
      toast.loading(message, {
        id,
        description,
        duration: undoableTimeout ? undoableTimeout * 1000 : undefined,
      });
      return;
    }

    toast[type](message, {
      id,
      description,
      action,
      duration: 5000,
    });
  },

  close: (key) => {
    toast.dismiss(key);
  },
};
