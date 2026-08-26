import { useEffect, useState, useCallback } from "react";

import Loader from "../../components/loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import PreviewDialog from "../../components/PreviewDialog.jsx";

import AttachmentsCard from "./AttachmentsCard.jsx";

import {
    getAttachments,
    deleteAttachments,
    getAttachmentDownloadUrl,
} from "./attachments.service";

const AttachmentList = ({ noteId, refreshTrigger }) => {
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState(null);

    const loadAttachments = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAttachments(noteId);

            const attachmentsWithPreviewUrls = await Promise.all(
                response.map(async (attachment) => {
                    if (!attachment.file_type?.startsWith("image/")) {
                        return attachment;
                    }

                    try {
                        const preview = await getAttachmentDownloadUrl(
                            attachment.attachment_id,
                        );
                        return { ...attachment, previewUrl: preview.signedUrl };
                    } catch {
                        return attachment;
                    }
                }),
            );

            setAttachments(attachmentsWithPreviewUrls);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load attachments."
            );
        } finally {
            setLoading(false);
        }
    }, [noteId]);

    useEffect(() => {
        if (noteId) {
            loadAttachments();
        }
    }, [noteId, refreshTrigger, loadAttachments]);

    const handleDeleteClick = (attachmentId) => {
        setSelectedAttachmentId(attachmentId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await deleteAttachments(selectedAttachmentId);

            setAttachments((previous) =>
                previous.filter(
                    (attachment) =>
                        attachment.attachment_id !== selectedAttachmentId
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to delete attachment."
            );
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setSelectedAttachmentId(null);
        }
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setSelectedAttachmentId(null);
    };

    const handleDownload = async (attachmentId) => {
        try {
            const response = await getAttachmentDownloadUrl(attachmentId);

            window.open(response.signedUrl, "_blank");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to download attachment."
            );
        }
    };

    const handlePreview = async (attachment) => {
        try {
            const response = await getAttachmentDownloadUrl(attachment.attachment_id);
            setPreviewFile({
                fileUrl: response.signedUrl,
                fileType: attachment.file_type,
                fileName: attachment.original_file_name,
            });
            setPreviewOpen(true);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to open attachment preview."
            );
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <p className="error-message">
                {error}
            </p>
        );
    }

    if (attachments.length === 0) {
        return (
            <EmptyState
                title="No Attachments"
                description="Upload your first attachment."
            />
        );
    }

    return (
        <>
            <div className="attachment-list">
                {attachments.map((attachment) => (
                    <AttachmentsCard
                        key={attachment.attachment_id}
                        attachment={attachment}
                        onDelete={handleDeleteClick}
                        onDownload={handleDownload}
                        onPreview={() => handlePreview(attachment)}
                    />
                ))}
            </div>

            <ConfirmDialog
                isOpen={deleteDialogOpen}
                title="Delete Attachment"
                message="Are you sure you want to delete this attachment?"
                confirmText="Delete"
                cancelText="Cancel"
                loading={deleting}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />

            <PreviewDialog
                isOpen={previewOpen}
                fileType={previewFile?.fileType}
                fileName={previewFile?.fileName}
                fileUrl={previewFile?.fileUrl}
                onClose={() => setPreviewOpen(false)}
            />
        </>
    );
};

export default AttachmentList;