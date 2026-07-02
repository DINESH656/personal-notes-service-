import { X } from "lucide-react";

const PreviewDialog = ({ isOpen, fileType, fileName, fileUrl, onClose }) => {
  if (!isOpen || !fileUrl) return null;

  const isImage = fileType?.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  return (
    <div className="modal-overlay">
      <div className="preview-dialog">
        <div className="preview-dialog-header">
          <div>
            <h2>{fileName}</h2>
            <p>{fileType}</p>
          </div>
          <button onClick={onClose} aria-label="Close preview">
            <X size={20} />
          </button>
        </div>

        <div className="preview-dialog-content">
          {isImage ? (
            <img src={fileUrl} alt={fileName} className="preview-image" />
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              title={fileName}
              className="preview-iframe"
            />
          ) : (
            <div className="preview-fallback">
              <p>
                Preview is not available for this file type. You can download it instead.
              </p>
              <a href={fileUrl} target="_blank" rel="noreferrer">
                Open file in new tab
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewDialog;
