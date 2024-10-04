import React, { useRef, useState } from "react";
import Spinner from "../../../common/Spinner";
import { Button } from "@material-tailwind/react";
import book1Img from "../../../../assets/rdnumber.png";
import createAxiosInstance from "../../../../config/axiosConfig";
import { toastify } from "../../../toast";
import { toastifyError } from "../../../../constants/errors";
import { TbFileDownload } from "react-icons/tb";
import { GrPowerReset } from "react-icons/gr";
import { MdCancel, MdHourglassTop } from "react-icons/md";
import { TbFilterSearch } from "react-icons/tb";
import { IoIosCloudDone } from "react-icons/io";

const TrackingPage = () => {
    const [showSpinner, setShowSpinner] = useState(false);
    const axios = createAxiosInstance();

    const book1 = useRef(null);
    const excelNameRef = useRef(null);

    const startMerge = async () => {
        const file1 = book1.current.files[0];
        const excelName = excelNameRef.current.value;

        // console.log(file1);
        if (file1) {
            if (excelName && excelName !== "") {
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
            } else {
                toastify({ msg: "Please fill in the Excel name field.", type: "error" });
            }
        } else {
            toastify({ msg: "No Book File Selected", type: "error" })
        }
    }

    return <>
        <div className="bg-white flex flex-col py-5 px-2 gap-y-7 w-full">
            <div className="flex justify-between gap-x-2 items-center">
                <div className="flex justify-start items-start gap-y-3">
                    <div className="flex justify-start flex-col gap-y-3 items-start">
                        <label htmlFor="book1" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Book1:</label>
                        <input ref={book1} type="file" id="book1" name="book1" />
                    </div>
                    <div className="flex justify-start flex-col gap-y-3 items-start">
                        <label htmlFor="excelName" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Excel Name:</label>
                        <input ref={excelNameRef} type="text" id="excelName" name="excelName" className="outline-none border border-solid border-gray-950 rounded-sm py-1 px-2" />
                    </div>
                </div>
                <img src={book1Img} alt="image" className="w-52 border border-solid border-slate-300 shadow-md shadow-slate-600" />
            </div>

            <Button className="bg-rose-700 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium" onClick={startMerge}>
                {showSpinner ? <Spinner width={16} /> : null}
                Start Tracking
            </Button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-6 w-full">
                <Button className="text-white bg-blue-600 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={() => setOpenAddress(true)}>
                    <TbFileDownload size={32} />
                    <span>Download Files</span>
                </Button>

                <Button className="text-white bg-green-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={() => setOpenAddress(true)}>
                    <GrPowerReset size={30} className="rotate-0" />
                    <span>Refresh</span>
                </Button>

                <Button className="text-white bg-purple-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={() => setOpenAddress(true)}>
                    <TbFilterSearch size={30} className="rotate-0" />
                    <span>Filtered Old Files</span>
                </Button>

                <Button className="text-white bg-red-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={() => setOpenAddress(true)}>
                    <MdHourglassTop size={30} className="rotate-0" />
                    <span>Stop and Reset</span>
                </Button>
            </div>

            <div className="flex font-poppins not-italic leading-normal font-medium justify-start items-start gap-x-3">
                <span>Total PDF Generated:</span>
                {
                    true ? <IoIosCloudDone size={26} className="text-green-700" />
                        : <MdCancel size={23} className="text-red-700" />
                }
            </div>
        </div>
    </>
}

export default TrackingPage;