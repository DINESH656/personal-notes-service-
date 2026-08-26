import {
    Eye,
    ExternalLink,
    Trash2,
    FileText,
    Image,
    File,
    Music,
    Video,
    FileCode,
} from "lucide-react";

const formatFileSize = (bytes) => {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1204)).toFixed(2)}MB`;
};
const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
        return <Image size={24} style={{ color: '#ec4899' }} />
    }
    if (fileType.startsWith('audio/')) {
        return <Music size={24} style={{ color: '#f59e0b' }} />
    }
    if (fileType.startsWith('video/')) {
        return <Video size={24} style={{ color: '#ef4444' }} />
    }
    if (fileType === 'application/pdf' || fileType.includes('pdf')) {
        return <FileText size={24} style={{ color: '#ef4444' }} />
    }
    if (fileType.includes('word') || fileType.includes('document')) {
        return <FileText size={24} style={{ color: '#3b82f6' }} />
    }
    if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('python')) {
        return <FileCode size={24} style={{ color: '#8b5cf6' }} />
    }
    return <File size={24} style={{ color: '#6b7280' }} />
};
const AttachmentsCard = ({
    attachment, onDelete, onDownload, onPreview,
}) => {
    return (
        <div className="attachment-card">

            <div className="attachment-info">

                {attachment.previewUrl ? (
                    <img
                        src={attachment.previewUrl}
                        alt={attachment.original_file_name}
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
                    />
                ) : (
                    getFileIcon(attachment.file_type)
                )}

                <div>
                    <h4 title={attachment.original_file_name}>{attachment.original_file_name}</h4>

                    <p>
                        {formatFileSize(Number(attachment.file_size))}
                    </p>

                    <small>
                        {new Date(
                            attachment.created_at
                        ).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        })}
                    </small>

                </div>

            </div>

            <div className="attachment-actions">

                <button
                    onClick={() => onPreview(attachment)}
                    title="Preview file"
                    aria-label="Preview"
                >
                    <Eye size={18} />
                </button>

                <button
                    onClick={() => onDownload(attachment.attachment_id)}
                    title="Open file in new tab"
                    aria-label="Open in new tab"
                >
                    <ExternalLink size={18} />
                </button>

                <button
                    onClick={() => onDelete(attachment.attachment_id)}
                    title="Delete file"
                    aria-label="Delete"
                >
                    <Trash2 size={18} />
                </button>

            </div>

        </div>
    );

}
export default AttachmentsCard;