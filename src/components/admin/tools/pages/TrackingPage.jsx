import React, { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { Modal, Spin } from "antd";
import { getPdfCountsThunkMiddleware, listAllPdfsThunkMiddleware, mergeExcelFilesThunkMiddleware, resetAndrestartServerThunkMiddleware } from "../../../../redux/features/tools";
import ResetModal from "../../../../common/modals/ResetModal";
import useDocument from "../../../../hooks/useDocument";
import { IoWalletOutline } from "react-icons/io5";
import MyButton from "../../../common/Buttons/MyButton";
import PaymentModal from "../../../../common/modals/PaymentModal";
import { RiFileExcel2Line } from "react-icons/ri";

const TrackingPage = () => {
    const [showSpinner, setShowSpinner] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { trackingDetails, total, current } = useSelector(state => state.tools);
    const axios = createAxiosInstance();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const docs = useDocument();

    const handleClose = () => setIsOpen(!isOpen);
    const [openReset, setOpenReset] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const dispatch = useDispatch();

    const book1 = useRef(null);
    const excelNameRef = useRef(null);

    const startMerge = async () => {
        const file1 = book1.current.files[0];
        // const excelName = excelNameRef.current.value;

        // console.log(file1);
        if (file1) {
            // if (excelName && excelName !== "") {
            const formData = new FormData();
            formData.append("book1", file1);
            // formData.append("excelName", excelName);

            setShowSpinner(true);
            try {
                const response = await axios.postForm("/tools/bulkTrackPdfsAndExcel", formData);
                // console.log(response);
                if (response.status === 200) {
                    setShowSpinner(false);
                    toastify({ msg: response.data?.message });
                    book1.current.value = "";
                    refresh();
                }
            } catch (err) {
                console.log("error:", err)
                toastifyError(err);
            } finally {
                setShowSpinner(false);
            }
            // } else {
            //     toastify({ msg: "Please fill in the Excel name field.", type: "error" });
            // }
        } else {
            toastify({ msg: "No Book File Selected", type: "error" })
        }
    }

    const refresh = () => {
        setLoading(true);
        dispatch(getPdfCountsThunkMiddleware(() => {
            setLoading(false);
        }));
    }

    useEffect(() => { refresh(); }, []);

    const resetAndrestartServer = () => {
        // console.log("reset and restart your server!");
        dispatch(resetAndrestartServerThunkMiddleware());
    }

    const downloadExcel = () => {
        dispatch(mergeExcelFilesThunkMiddleware((data) => {
            if (data) {
                docs.download(data, 'combinedExcelFile.xlsx');
            }
        }));
    }

    const downloadPdfs = () => {
        dispatch(listAllPdfsThunkMiddleware((data) => {
            if (data) {
                setLoading(true);
                setShowProgress(true);
                setProgress(0);
                let downloads = data?.map((item) => ({ name: item?.filename, link: item?.downloadUrl }));
                docs.downloadPdf('listAllPdfs', downloads, (load) => {
                    setProgress(load);
                    if (load >= 100) {
                        setLoading(false);
                        setShowProgress(true);
                        setProgress(0);
                    }
                });
            }
        }));
    }

    return <>
        <ResetModal
            open={openReset}
            setOpen={setOpenReset}
            title="Do You Want to Reset and Restart The Server?"
            resetEvent={resetAndrestartServer}
        />

        <Modal
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            centered
            // closable={false}
            width={800}
        >
            <div className="pt-14 pb-3 flex justify-center flex-col gap-y-5 items-center px-3">
                <div className="flex flex-col justify-center items-center gap-y-5">
                    <GrPowerReset size={40} />
                    <h2 className="font-poppins not-italic leading-normal font-medium text-center text-[15px]">Warning: This process will permanently <span className="text-red-700 uppercase">Delete</span> all existing PDF and Excel data. Please ensure that you have backed up any important information before proceeding.</h2>
                </div>
                <div className="w-full flex justify-end px-3 items-center gap-x-2">
                    <Button className="font-poppins not-italic py-2 shadow-sm px-4 leading-normal capitalize border border-solid rounded-md bg-gray-50 text-[#000000]" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button className="font-poppins not-italic py-2 px-4 leading-normal rounded-md capitalize bg-green-700 text-[#FFFFFF]" onClick={() => {
                        handleClose();
                        startMerge();
                    }}>
                        Start
                    </Button>
                </div>
            </div>
        </Modal>

        <PaymentModal
            isOpen={isPaymentOpen}
            setIsOpen={setIsPaymentOpen}
        />

        {
            loading ? <>
                <div className="w-full h-full z-30 bg-white/50 fixed top-0 left-0 flex justify-center items-center gap-x-4 text-[18px] font-poppins not-italic leading-normal">
                    <Spin />
                    {
                        showProgress ? <h2>Progress... {progress}%</h2> : null
                    }
                </div>
            </> : null
        }


        <div className="bg-white flex flex-col py-2 px-2 gap-y-7 w-full">
            <div className="w-full flex justify-between items-center gap-x-4 py-1 px-3">
                <div className="flex justify-end w-full items-center gap-x-2">
                    <IoWalletOutline size={22} className="text-blue-700" />
                    <span><span className="font-semibold">Wallet:</span> 0.00</span>
                </div>
                <div>
                    <MyButton className="py-2 px-4 bg-blue-700 text-[14px]" onClick={() => setIsPaymentOpen(true)}>Payment</MyButton>
                </div>
            </div>
            <div className="flex justify-between gap-x-2 items-center">
                <div className="flex justify-start items-start gap-y-3">
                    <div className="flex justify-start flex-col gap-y-3 items-start">
                        <label htmlFor="book1" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Book1:</label>
                        <input ref={book1} type="file" id="book1" name="book1" />
                    </div>
                    {/* <div className="flex justify-start flex-col gap-y-3 items-start">
                        <label htmlFor="excelName" className="font-poppins not-talic cursor-pointer text-[16px] transition-all hover:text-slate-600 leading-normal font-bold text-slate-700">Excel Name:</label>
                        <input ref={excelNameRef} type="text" id="excelName" name="excelName" className="outline-none border border-solid border-gray-950 rounded-sm py-1 px-2" />
                    </div> */}
                </div>
                <img src={book1Img} alt="image" className="w-52 border border-solid border-slate-300 shadow-md shadow-slate-600" />
            </div>

            <Button
                // className={`${parseInt(current) === 0 ? "bg-rose-700 " : "bg-rose-500 cursor-not-allowed"} py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium`}
                // onClick={parseInt(current) === 0 ? handleClose : () => { }}
                className={`py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium`}
                onClick={handleClose}
            >
                {showSpinner ? <Spinner width={16} /> : null}
                Start Tracking
            </Button>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-6 w-full">
                <Button className="text-white bg-blue-600 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={downloadExcel}>
                    <TbFileDownload size={32} />
                    <span>Download Excel</span>
                </Button>

                <Button className="text-white bg-purple-600 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={downloadPdfs}>
                    <TbFileDownload size={32} />
                    <span>Download Pdfs</span>
                </Button>

                <Button className="text-white bg-green-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={refresh}>
                    <GrPowerReset size={30} className="rotate-0" />
                    <span>Refresh</span>
                </Button>

                {/* <Button className="text-white bg-purple-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={() => setOpenAddress(true)}>
                    <TbFilterSearch size={30} className="rotate-0" />
                    <span>Filtered Old Files</span>
                </Button> */}

                <Button
                    className="text-white bg-red-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]"
                    // onClick={() => setOpenAddress(true)}
                    onClick={() => setOpenReset(true)}
                >
                    <MdHourglassTop size={30} className="rotate-0" />
                    <span>Stop and Reset</span>
                </Button>

                <Button
                    className="text-white bg-green-800 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]"
                >
                    <RiFileExcel2Line size={30} className="rotate-0" />
                    <span>Download Remaining Excel</span>
                </Button>
            </div>

            <div className="flex justify-start items-center gap-x-4">
                <div className="flex font-poppins not-italic leading-normal font-medium justify-start items-start gap-x-3">
                    <span className="font-semibold">Total Number of Tracking :</span>
                    <h2>{total || 0}</h2>
                </div>

                <div className="flex font-poppins not-italic leading-normal font-medium justify-start items-start gap-x-3">
                    {/* <span className="font-semibold">Total PDF Generated:</span> */}
                    <span className="font-semibold">Tracking Files Made:</span>
                    <h2>{current || 0}</h2>
                    {/* {
                    true ? <IoIosCloudDone size={26} className="text-green-700" />
                        : <MdCancel size={23} className="text-red-700" />
                } */}
                </div>
            </div>
        </div>
    </>
}

export default TrackingPage;