import React, { createContext, useState } from "react";
import Uploader from "./Uploader";

export const UploadContext = createContext();

const UploadProvider = ({ children }) => {
    const [upload, setUpload] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressTitle, setProgressTitle] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return <>
        <UploadContext.Provider value={{
            upload,
            progress,
            progressTitle,
            showUpload,
            setUpload,
            setProgress,
            setProgressTitle,
            setShowUpload,
            uploadOpen: setIsOpen,
        }}>
            {children}
            {
                showUpload ? <>
                    <Uploader
                        upload={upload}
                        progress={progress}
                        progressTitle={progressTitle}
                        isOpen={isOpen}
                    />
                </> : null
            }
        </UploadContext.Provider>
    </>
}

export default UploadProvider;