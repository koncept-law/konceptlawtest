import { Button } from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";

import { RiFileExcel2Fill } from "react-icons/ri"; // book
import { SiConvertio } from "react-icons/si"; // convert
import { MdRocketLaunch } from "react-icons/md"; // rocket
import { FaTools } from "react-icons/fa";
import { RiBracesFill } from "react-icons/ri";
import { RxDoubleArrowRight } from "react-icons/rx";
import { RxDoubleArrowLeft } from "react-icons/rx";
import MergeBook from "./MergeBook";
import Converter from "./Converter";
import DynamicMerge from "./DynamicMerge";
import UploadFolder from "../../../common/fields/UploadFolder";
import { FaMapLocationDot } from "react-icons/fa6";
import AddressMerge from "./AddressMerge";
import { TbFileSymlink, TbMapPinCode } from "react-icons/tb";
import PinCode from "./PinCode";
import { TfiTarget } from "react-icons/tfi";
import Tracking from "./Tracking";
import usePath from "../../../hooks/usePath";
import { FaServer } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { resetAndrestartServerThunkMiddleware } from "../../../redux/features/tools";
import ResetModal from "../../../common/modals/ResetModal";
import { BsColumns } from "react-icons/bs";
import Transpose from "./Transpose";
import PdfToExcel from "./PdfToExcel";
import useUpload from "../../../hooks/useUpload";
import { Tooltip } from "antd";

const Tools = () => {
    // state
    const [openMerge, setOpenMerge] = useState(false);
    const [openConverter, setOpenConverter] = useState(false);
    const [openDynamice, setOpenDynamice] = useState(false);
    const [openAddress, setOpenAddress] = useState(false);
    const [openPinCode, setOpenPinCode] = useState(false);
    const [openTracking, setOpenTracking] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [openTranspose, setOpenTranspose] = useState(false);
    const [openPdfToExcel, setOpenPdfToExcel] = useState(false);
    const {
        setShowUpload,
    } = useUpload();

    // useEffect(() => { setShowUpload(true) }, []);

    // hooks
    const path = usePath();
    const dispatch = useDispatch();

    // functions
    const resetAndrestartServer = () => {
        // console.log("reset and restart your server!");
        dispatch(resetAndrestartServerThunkMiddleware());
    }

    return <>
        <MergeBook open={openMerge} setOpen={setOpenMerge} />
        <Converter open={openConverter} setOpen={setOpenConverter} />
        <DynamicMerge open={openDynamice} setOpen={setOpenDynamice} />
        <AddressMerge open={openAddress} setOpen={setOpenAddress} />
        <PinCode open={openPinCode} setOpen={setOpenPinCode} />
        <Tracking open={openTracking} setOpen={setOpenTracking} />
        <ResetModal
            open={openReset}
            setOpen={setOpenReset}
            title="Do You Want to Reset and Restart The Server?"
            resetEvent={resetAndrestartServer}
        />
        <Transpose
            open={openTranspose}
            setOpen={setOpenTranspose}
        />
        <PdfToExcel
            open={openPdfToExcel}
            setOpen={setOpenPdfToExcel}
        />

        <div className="flex flex-col w-full justify-center px-4 items-center">
            <h2 className="font-semibold font-poppins not-italic leading-normal flex gap-x-3 justify-start items-center text-slate-800 text-3xl text-start w-full">
                <FaTools size={22} />
                <span className="text-purple-800">Tools</span>
            </h2>
            <div className="w-full grid grid-cols-4 gap-y-6 my-3 gap-x-4">
                <Button className="text-white bg-blue-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={() => setOpenMerge(true)}>
                    <RiFileExcel2Fill size={30} />
                    <span>Merge Book</span>
                </Button>

                <Button className="text-white bg-green-600 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={() => setOpenConverter(true)}>
                    <SiConvertio size={30} />
                    <div className="flex justify-center gap-x-1 items-center">
                        <span>Convert</span>
                        <div className="flex justify-center items-center gap-x-0.5">
                            <RxDoubleArrowLeft size={15} />
                            <RxDoubleArrowRight size={15} />
                        </div>
                        <span className="lowercase">to</span>
                        <RiBracesFill size={16} />
                    </div>
                </Button>

                <Button className="text-white bg-purple-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={() => setOpenDynamice(true)}>
                    <MdRocketLaunch size={30} />
                    <span>Dynamic Merge</span>
                </Button>


                <Button className="text-white bg-orange-600 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={() => setOpenAddress(true)}>
                    <FaMapLocationDot size={30} />
                    <span>Address Merge</span>
                </Button>

                <Button className="text-white bg-yellow-500 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={() => setOpenPinCode(true)}>
                    <TbMapPinCode size={30} />
                    <span>PIN Code Extracter</span>
                </Button>

                <Button
                    className="text-white bg-rose-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2"
                    // onClick={() => setOpenTracking(true)}
                    onClick={() => path.navigate("/tools/tracking")}
                >
                    <TfiTarget size={30} />
                    <span>Tracking</span>
                </Button>

                <Button
                    className="text-white bg-green-900 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2"
                    // onClick={resetAndrestartServer}
                    onClick={() => setOpenReset(true)}
                >
                    <FaServer size={30} />
                    <span>Reset the Server</span>
                </Button>

                <Button
                    className="text-white bg-cyan-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2"
                    onClick={() => setOpenTranspose(true)}
                >
                    <BsColumns size={30} />
                    <span>Transpose Columns to Row</span>
                </Button>

                <Button
                    className="text-white bg-purple-500 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2 relative"
                    // onClick={() => setOpenPdfToExcel(true)}
                    onClick={() => path.push("pdf-to-excel-link")}
                >
                    {/* <Tooltip title="Total Pdf convert in Excel Link">
                        <h2 className="absolute top-2 left-3 text-[16px] text-green-50">0</h2>
                    </Tooltip> */}
                    <TbFileSymlink size={30} />
                    <span>Pdf to Excel Link</span>
                </Button>
            </div>
        </div>
    </>
}

export default Tools;