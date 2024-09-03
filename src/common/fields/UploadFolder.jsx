import React from "react";

const UploadFolder = ({ folderRef, onChange = () => {} }) => {
    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        const fileArray = Array.from(selectedFiles); // Convert FileList to Array
        onChange(fileArray); // Pass files to the parent component
    };

    return (
        <>
            <input 
                ref={folderRef}
                type="file" 
                webkitdirectory="true" 
                onChange={handleFileChange} // Handle folder selection
                style={{ display: 'block', margin: '20px 0' }}
            />
        </>
    );
};

export default UploadFolder;
