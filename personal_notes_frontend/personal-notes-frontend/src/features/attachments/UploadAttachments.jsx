import { useRef, useState } from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import Loader from '../../components/loader';
import { uploadAttachments } from './attachments.service';

const UploadAttachments = ({ noteId, onUploadSuccess }) => {
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        setSelectedFile(file);
        setError('');
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('please select a file');
            return;
        }
        try {
            setUploading(true);
            setError('');

            await uploadAttachments(noteId, selectedFile);
            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (error) {
            setError(
                error.response?.data?.message || 'failed to upload attachments'
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='attachment-upload-container'>
            <input
                ref={fileInputRef}
                type='file'
                onChange={handleFileChange}
                disabled={uploading}
                id="file-input"
            />
            
            {!selectedFile && !uploading && (
                <label 
                    htmlFor="file-input" 
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Upload size={32} style={{ color: '#4f46e5' }} />
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>Choose a file to upload</span>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>or drag and drop</span>
                </label>
            )}

            {selectedFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <FileUp size={20} style={{ color: '#4f46e5' }} />
                    <p style={{ margin: 0 }}>
                        <strong>Selected:</strong> {selectedFile.name}
                    </p>
                </div>
            )}

            {error && (
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', margin: '0.5rem 0' }}>
                    <AlertCircle size={18} />
                    <span className='error-message'>{error}</span>
                </p>
            )}

            <button
                type='button'
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                style={{ minWidth: '150px' }}
            >
                {uploading ? '⏳ Uploading...' : '📤 Upload File'}
            </button>

            {uploading && <Loader />}
        </div>
    );

};
export default UploadAttachments;