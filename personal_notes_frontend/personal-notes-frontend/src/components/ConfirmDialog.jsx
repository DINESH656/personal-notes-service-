import { FiAlertTriangle } from "react-icons/fi";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "danger-btn",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">
          <FiAlertTriangle />
        </div>

        <h2>{title}</h2>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="secondary-btn" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>

          <button className={confirmButtonClass} onClick={onConfirm} disabled={loading}>
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
