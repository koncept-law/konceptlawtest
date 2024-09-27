import React, { useRef, useState } from "react";
import { Modal } from "antd";
import { Button, Spinner } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import { toastify } from "../../toast";
import createAxiosInstance from "../../../config/axiosConfig";

import book1Img from "../../../assets/rdnumber.png";
import { toastifyError } from "../../../constants/errors";

const Tracking = ({ open = false, setOpen = () => { } }) => {
    const handleOpen = () => setOpen(!open);
    const [showSpinner, setShowSpinner] = useState(false);
    const axios = createAxiosInstance();

    const book1 = useRef(null);
    const excelNameRef = useRef(null);

    const startMerge = async () => {
        const file1 = book1.current.files[0];
        const excelName = excelNameRef.current.value;

        // console.log(file1);
        if (file1) {
            if(excelName && excelName !== ""){
                const formData = new FormData();
                formData.append("book1", file1);
                formData.append("excelName", excelName);
    
                setShowSpinner(true);
                try {
                    const response = await axios.postForm("/tools/bulkTrackPdfsAndExcel", formData, {
                        responseType: 'blob'
                    });
                    // console.log(response);
                    if (response.status === 200) {
                        setShowSpinner(false);
                        const blob = response.data;
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'trackingBook.xlsx';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        toastify({ msg: "File merged and downloaded successfully!", type: "success" })
                        book1.current.value = "";
                        handleOpen();
                    }
                } catch (err) {
                    console.log("error:", err)
                    toastifyError(err);
                } finally {
                    setShowSpinner(false);
                }
            }else {
                toastify({ msg: "Please fill in the Excel name field.", type: "error" });
            }
        } else {
            toastify({ msg: "No Book File Selected", type: "error" })
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
                        <h2 className="font-poppins not-italic leading-normal font-medium">Tracking</h2>
                        <button className="cursor-pointer active:text-red-700 transition-all" onClick={() => setOpen(false)}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white flex flex-col py-5 px-2 gap-y-7 w-full">
                        <div className="flex justify-start gap-x-2 items-center">
                            <div className="flex justify-start items-start flex-col gap-y-3">
                                <label htmlFor="book1" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Book1:</label>
                                <input ref={book1} type="file" id="book1" name="book1" />
                                <label htmlFor="excelName" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Excel Name:</label>
                                <input ref={excelNameRef} type="text" id="excelName" name="excelName" className="outline-none border border-solid border-gray-950 rounded-sm py-1 px-2" />
                            </div>
                            <img src={book1Img} alt="image" className="w-32 border border-solid border-slate-300 shadow-md shadow-slate-600" />
                        </div>

                        <Button className="bg-rose-700 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium" onClick={startMerge}>
                            {showSpinner ? <Spinner width={16} /> : null}
                            Start Tracking
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Tracking;
