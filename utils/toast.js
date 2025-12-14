import { showMessage } from "react-native-flash-message";

export const toast = {
  success: (message, description = "") =>
    showMessage({
      message,
      description,
      type: "success",
      icon: "success",
    }),

  error: (message, description = "") =>
    showMessage({
      message,
      description,
      type: "danger",
      icon: "danger",
    }),

  info: (message, description = "") =>
    showMessage({
      message,
      description,
      type: "info",
      icon: "info",
    }),

  warning: (message, description = "") =>
    showMessage({
      message,
      description,
      type: "warning",
      icon: "warning",
    }),
};
