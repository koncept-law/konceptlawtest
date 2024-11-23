import React, { useRef, useState } from "react";
import { Modal } from "antd";
import { Button, Spinner } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import { toastify } from "../../toast";
import createAxiosInstance from "../../../config/axiosConfig";

import { toastifyError } from "../../../constants/errors";
import { useDispatch } from "react-redux";
import { pdfToExcelLinkThunkMiddleware } from "../../../redux/features/tools";
import useUpload from "../../../hooks/useUpload";
import { MdOutlineFileDownload } from "react-icons/md";

const PdfToExcel = ({ open = false, setOpen = () => { } }) => {
    const handleOpen = () => setOpen(!open);
    const [showSpinner, setShowSpinner] = useState(false);
    const axios = createAxiosInstance();
    const dispatch = useDispatch();
    const {
        setUpload,
        setProgress,
        setProgressTitle,
        uploadOpen,
    } = useUpload();

    const book1 = useRef(null);

    const startPDfToExcelLink = async () => {
        const file1 = book1.current.files;

        console.log(file1);
        if (file1 && file1?.length > 0) {
            const formData = new FormData();
            let files = [];
            Object.keys(file1)?.forEach((item) => {
                // formData.append("files", file1[item]);
                files.push(file1[item]);
            })
            // formData.append("book1", file1);

            setShowSpinner(true);
            setUpload(true);
            setProgressTitle(`PDF To Excel Link (0/${files.length})`);
            uploadOpen(true);


            dispatch(pdfToExcelLinkThunkMiddleware({
                files: files, callback: (call) => {
                    if (call?.upload === false) {
                        toastify({ msg: "File merged and downloaded successfully!", type: "success", position: "top-center" })
                        book1.current.value = "";
                        handleOpen();
                    } else {
                        setProgressTitle(`PDF To Excel Link (${call?.totalUpload}/${call?.totalFiles})`);
                        let totalUpload = parseInt(call?.totalUpload);
                        let totalFiles = parseInt(call?.totalFiles);
                        setProgress(Math.floor((totalUpload / totalFiles) * 100));
                    }
                },
                complete: () => {
                    setShowSpinner(false);
                    setUpload(false);
                    setProgress(0);
                    uploadOpen(false);
                }
            }))
            // try {
            //     const response = await axios.postForm("/tools/uploadMultiplePdfsWithExcelDownload ", formData);
            //     // console.log(response);
            //     if (response.status === 200) {
            //         setShowSpinner(false);
            //         // const blob = response.data;
            //         // const url = window.URL.createObjectURL(blob);
            //         // const a = document.createElement('a');
            //         // a.style.display = 'none';
            //         // a.href = url;
            //         // a.download = 'transposeColumnToRow.xlsx';
            //         // document.body.appendChild(a);
            //         // a.click();
            //         // window.URL.revokeObjectURL(url);
            //         toastify({ msg: "File merged and downloaded successfully!", type: "success" })
            //         book1.current.value = "";
            //         handleOpen();
            //     }
            // } catch (err) {
            //     console.log("error:", err)
            //     toastifyError(err);
            // } finally {
            //     setShowSpinner(false);
            // }
        } else {
            toastify({ msg: "Please select a file to proceed.", type: "error", position: "top-center" })
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
                        <h2 className="font-poppins not-italic leading-normal font-medium">Pdf To Excel Link</h2>
                        <button className="cursor-pointer active:text-red-700 transition-all" onClick={() => setOpen(false)}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white flex flex-col py-5 px-2 main-text gap-y-7 w-full">
                        <h2 className="font-medium text-[15px]">Total number of PDF To Excel Link:<span className="text-slate-700"> 0</span></h2>
                        <div className="flex justify-start gap-x-2 items-center">
                            <label htmlFor="book1" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Files:</label>
                            <input
                                ref={book1}
                                type="file"
                                id="book1"
                                name="book1"
                                multiple={true}
                                accept="application/pdf"
                            />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-x-2">
                            <Button className="bg-purple-500 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium" onClick={startPDfToExcelLink}>
                                {showSpinner ? <Spinner width={16} /> : null}
                                Pdf To Excel Link
                            </Button>
                            <Button className="bg-green-700 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-1 font-medium">
                                <MdOutlineFileDownload size={20} />
                                Download Excel
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PdfToExcel;
