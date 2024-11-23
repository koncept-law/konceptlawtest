import { useContext } from "react";
import { UploadContext } from "../common/uploads/UploadProvider";

const useUpload = () => {
    const {
        upload,
        progress,
        progressTitle,
        showUpload,
        setUpload,
        setProgress,
        setProgressTitle,
        setShowUpload,
        uploadOpen,
    } = useContext(UploadContext);

    return {
        upload,
        progress,
        progressTitle,
        showUpload,
        setUpload,
        setProgress,
        setProgressTitle,
        setShowUpload,
        uploadOpen,
    }
}

export default useUpload;