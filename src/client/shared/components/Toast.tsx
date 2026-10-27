import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { hideToast } from "../../store/slices/toastSlice";
import styles from "./Toast.module.css";

const TOAST_DURATION_MS = 4000;

const Toast = () => {
  const dispatch = useDispatch();
  const { message, id } = useSelector((state: RootState) => state.toast);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => dispatch(hideToast()), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [dispatch, message, id]);

  if (!message) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Toast;
