import React, { useRef, useState } from "react";
import { Modal } from "antd";
import { Button, Spinner } from "@material-tailwind/react";
import { RxCross2, RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";
import { toastify } from "../../toast";
import createAxiosInstance from "../../../config/axiosConfig";

import { RiBracesFill } from "react-icons/ri";
import { FaRegFolderOpen } from "react-icons/fa";
import JSZip from "jszip";

const Converter = ({ open = false, setOpen = () => { } }) => {
    const handleOpen = () => setOpen(!open);
    const [showSpinner, setShowSpinner] = useState(false);
    const fileRef = useRef(null);
    const axios = createAxiosInstance();
    const [fileName, setFileName] = useState(null);

    const SelectEvent = (e) => {
        // let file = e.target.files[0];
        // if(file){
        //     setFileName(file.name);
        // }else {
        //     setFileName(null);
        //     fileRef.current.value = "";
        // }
        let file = e.target.files;
        if (file) {
            setFileName(Object.keys(file).length);
        } else {
            setFileName(null);
            fileRef.current.value = "";
        }
    }

    const startConverting = async () => {
        // let file = fileRef.current.files[0];
        // if(file){
        //     const formData = new FormData();
        //     formData.append("file", file);
        //     setShowSpinner(true); 
        //     const response = await axios.postForm("/tools/convertV2", formData, {
        //         responseType: 'blob'
        //     }); 

        //     if(response.status === 200){
        //         setShowSpinner(false);
        //         const blob = response.data;
        //         const url = window.URL.createObjectURL(blob);
        //         const a = document.createElement('a');
        //         a.style.display = 'none';
        //         a.href = url;
        //         a.download = file?.name ? file.name: 'convertDocx.docx';
        //         document.body.appendChild(a);
        //         a.click();
        //         window.URL.revokeObjectURL(url);
        //         toastify({ msg: "File merged and downloaded successfully!", type: "success" })
        //         fileRef.current.value = "";
        //         setFileName(null);
        //         handleOpen();
        //     }
        // }else {
        //     toastify({ msg: "No File Selected", type: "error" })
        // }
        // let files = fileRef.current.files;
        // // console.log(files);
        // if (files) {
        //     // const formData = new FormData();
        //     // Object.keys(files)?.map((file)=> (
        //     //     formData.append('file', files[file])
        //     // ))

        //     // setShowSpinner(true); 
        //     // const response = await axios.postForm("/tools/convertV2", formData, {
        //     //     responseType: 'blob'
        //     // }); 

        //     // console.log(response);

        //     // if(response.status === 200){
        //     //     setShowSpinner(false);
        //     //     const blob = response.data;
        //     //     const url = window.URL.createObjectURL(blob);
        //     //     const a = document.createElement('a');
        //     //     a.style.display = 'none';
        //     //     a.href = url;
        //     //     // a.download = file?.name ? file.name: 'convertDocx.docx';
        //     //     a.download = "convertDocx.docx";
        //     //     document.body.appendChild(a);
        //     //     a.click();
        //     //     window.URL.revokeObjectURL(url);
        //     //     toastify({ msg: "File merged and downloaded successfully!", type: "success" })
        //     //     fileRef.current.value = "";
        //     //     setFileName(null);
        //     //     handleOpen();
        //     // }
        // } else {
        //     toastify({ msg: "No File Selected", type: "error" })
        // }
        let files = fileRef.current.files;

        if (files) {
            // Array to store all converted file responses
            const convertedFiles = [];
        
            // Convert files to an array and use `Promise.all` to handle multiple async requests
            Promise.all(Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
        
                setShowSpinner(true);
        
                try {
                    const response = await axios.postForm("/tools/convertV2", formData, {
                        responseType: "blob", // Ensure the server returns a blob
                    });
        
                    // Create a new Blob object from the response data
                    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        
                    // Push converted file data to the array, maintaining the original .docx format
                    convertedFiles.push({
                        data: blob, // Use the Blob object for proper handling
                        name: file.name.endsWith('.docx') ? file.name : `${file.name}.docx` // Ensure correct file extension
                    });
                } catch (error) {
                    console.error("File conversion failed:", error);
                }
            })).then(() => {
                setShowSpinner(false);
        
                // Now handle creating a downloadable folder with all converted files
                createZipAndDownload(convertedFiles);
                handleOpen();
                setFileName("");
                fileRef.current.value = "";
            });
        
            // Function to create a ZIP file and trigger download
            function createZipAndDownload(files) {
                const zip = new JSZip();
                const folder = zip.folder("converted_files"); // Create a folder inside the ZIP
        
                // Use Promise.all to handle all FileReader operations
                Promise.all(files.map((file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const arrayBuffer = e.target.result;
                            folder.file(file.name, arrayBuffer); // Add file to the folder
                            resolve(); // Resolve the promise when file is added
                        };
                        reader.onerror = reject; // Reject on error
                        reader.readAsArrayBuffer(file.data); // Read file data as ArrayBuffer
                    });
                })).then(() => {
                    // Generate the ZIP after all files are added
                    zip.generateAsync({ type: "blob" })
                        .then((content) => {
                            const link = document.createElement("a");
                            link.href = URL.createObjectURL(content);
                            link.download = "converted_files.zip";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });
                }).catch((error) => {
                    console.error("Error reading files:", error);
                });
            }
        } else {
            toastify({ msg: "No File Selected", type: "error" });
        }
        
    }

    return (
        <>
            <Modal
                open={open}
                onCancel={handleOpen}
                footer={[]}
                centered
                closable={false}
            >
                <div className="flex flex-col w-full">
                    <div className="flex p-3 justify-between bg-slate-800 text-white w-full items-center">
                        <h2 className="font-poppins not-italic leading-normal font-medium">Convert</h2>
                        <button className="cursor-pointer active:text-red-700 transition-all" onClick={() => setOpen(false)}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white flex flex-col py-5 px-2 gap-y-7 w-full">
                        <div className="m-3 border-2 border-dotted flex justify-center cursor-pointer items-center gap-y-1 text-slate-700 flex-col py-6 border-slate-700 rounded-md" onClick={() => {
                            fileRef.current.click();
                        }}>
                            <FaRegFolderOpen size={50} />
                            <h2 className="font-poppins not-italic leading-normal text-xl font-semibold">{fileName ? `${fileName}: Selected Files` : "Select a File"}</h2>
                        </div>
                        <input ref={fileRef} type="file" multiple={true} className="hidden" onChange={SelectEvent} />
                        <Button className="bg-green-800 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium" onClick={startConverting}>
                            {showSpinner ? <Spinner width={16} /> : null}
                            <div className="flex justify-center gap-x-1 items-center">
                                <span>Convert</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Converter;
