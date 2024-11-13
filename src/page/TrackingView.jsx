import React, { useEffect, useState } from "react";
import TrackingPage from "../components/admin/tools/pages/TrackingPage";
import { IoWalletOutline } from "react-icons/io5";
import MyButton from "../components/common/Buttons/MyButton";
import CountUp from "react-countup";
import { LuUpload } from "react-icons/lu";
import useDocument from "../hooks/useDocument";
import { RiFileExcel2Line } from "react-icons/ri";
import { GrPowerReset } from "react-icons/gr";
import { TfiTarget } from "react-icons/tfi";
import { Button } from "@material-tailwind/react";
import { TbFileDownload } from "react-icons/tb";
import { MdHourglassTop } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getPdfCountsThunkMiddleware, mergeExcelFilesThunkMiddleware, resetAndrestartServerThunkMiddleware } from "../redux/features/tools";
import createAxiosInstance from "../config/axiosConfig";
import { toastify } from "../components/toast";
import { toastifyError } from "../constants/errors";
import ResetModal from "../common/modals/ResetModal";
import { Modal, Spin } from "antd";
import PaymentModal from "../common/modals/PaymentModal";
import { FaRegFilePdf } from "react-icons/fa6";

const TrackingView = () => {
    // hooks
    const docs = useDocument();
    const dispatch = useDispatch();
    const axios = createAxiosInstance();
    const [isOpen, setIsOpen] = useState(false);
    const { total, current } = useSelector(state => state.tools);

    // state
    const [loading, setLoading] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // component
    const Card = ({
        title = "",
        number = 0,
        numberClass = ""
    }) => {
        return <>
            <div className="bg-white w-[400px] py-5 gap-y-2 border border-gray-100 border-solid shadow-md flex justify-start items-start rounded-md px-4 flex-col font-poppins not-italic leading-normal">
                <h2 className="text-gray-700 text-[18px]">{title}</h2>
                {/* <h3 className={`text-[35px] ${numberClass}`}>{number}</h3> */}
                <h3 className={`text-[35px] ${numberClass}`}>
                    <CountUp end={number} duration={2} />
                </h3>
            </div>
        </>
    }

    const template = [
        {
            'RD NUMBER': ''
        }
    ]

    // functions
    const handleClose = () => setIsOpen(!isOpen);

    const startMerge = async () => {
        const file1 = docs.file;

        if (file1) {
            const formData = new FormData();
            formData.append("book1", file1);

            setLoading(true);
            try {
                const response = await axios.postForm("/tools/bulkTrackPdfsAndExcel", formData);
                // console.log(response);
                if (response.status === 200) {
                    setLoading(false);
                    toastify({ msg: response.data?.message, position: "top-center" });
                    book1.current.value = "";
                    refresh();
                }
            } catch (err) {
                console.log("error:", err)
                toastifyError(err, () => {}, "top-center");
            } finally {
                setLoading(false);
            }
        } else {
            toastify({ msg: "No file selected. Please choose a file to upload.", type: "error", position: "top-center" })
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
                let downloads = data?.map((item) => ({ name: item?.filename, link: item?.downloadUrl }));
                docs.downloadPdf('listAllPdfs', downloads, (load) => {
                    if (load >= 100) {
                        setLoading(false);
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
            styles={{
                content: {
                    padding:"2px"
                }
            }}
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
                <div className="w-full h-full z-30 bg-white/50 fixed top-0 left-0 flex justify-center items-center">
                    <Spin />
                </div>
            </> : null
        }

        {/* <TrackingPage /> */}
        <div className="h-[250px] relative koncept-background w-full">
            <div className="w-full flex justify-between items-center text-white font-poppins not-italic leading-normal gap-x-4 py-4 px-6">
                <h2 className="text-[18px]">Dashboard</h2>
                <div className="flex justify-center items-center gap-x-4">
                    <div className="flex justify-center items-center text-white gap-x-2">
                        <IoWalletOutline size={22} className="text-gray-100" />
                        <span><span className="font-semibold">Wallet:</span> 0.00</span>
                    </div>
                    <div className="">
                        <MyButton className="py-2 px-4 bg-green-700 text-[14px]" onClick={() => setIsPaymentOpen(true)}>Payment</MyButton>
                    </div>
                </div>
            </div>

            <div className="flex justify-center absolute -bottom-6 left-0 items-center w-full gap-x-10">
                <Card
                    title="Total Number of Tracking"
                    number={total || 0}
                />

                <Card
                    title="Tracking Files Made"
                    number={current || 0}
                    numberClass="text-green-700"
                />
            </div>
        </div>

        <div className="w-full my-20 flex justify-between items-center">
            <div className="w-[40%] flex justify-center items-center">
                <div
                    className="py-10 font-poppins not-italic leading-normal gap-y-3 cursor-pointer px-2 w-3/4 flex flex-col justify-center items-center border-2 border-dotted border-black hover:text-blue-700 hover:border-blue-700 text-gray-900 rounded-md"
                    onClick={() => docs.upload()}
                >
                    <LuUpload size={40} />
                    <h2 className="text-center">Click to select a file to upload</h2>
                    {docs.file?.name && <p className="text-[14px] text-center"><span className="font-semibold">Selected:</span> {docs.file?.name}</p>}
                </div>
            </div>
            <div className="w-[60%] flex flex-col gap-y-6 justify-center px-4 items-center">
                <div className="grid grid-cols-3 w-full gap-x-4">
                    <MyButton className="flex justify-center items-center gap-x-2 py-2 px-3 rounded-sm text-[15px]" onClick={() => docs.downloadXLSX(template, 'trackingTemplate')}>
                        <RiFileExcel2Line size={18} />
                        <span>Template</span>
                    </MyButton>

                    <MyButton onClick={() => docs.reset()} disabled={!docs.file?.name} className="flex justify-center items-center gap-x-2 py-2 px-3 bg-red-700 rounded-sm text-[15px]">
                        <GrPowerReset size={18} />
                        <span>Reset</span>
                    </MyButton>

                    <MyButton
                        disabled={parseInt(current) === 0 ? !docs.file?.name: true} 
                        className="flex justify-center items-center gap-x-2 py-2 px-3 bg-rose-700 rounded-sm text-[15px]" onClick={handleClose}
                    >
                        <TfiTarget size={18} />
                        <span>Start Tracking</span>
                    </MyButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6 w-full">
                    <Button className="text-white bg-blue-600 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={downloadExcel}>
                        <RiFileExcel2Line size={30} />
                        <span>Download Excel</span>
                    </Button>

                    <Button className="text-white bg-purple-600 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={downloadPdfs}>
                        <FaRegFilePdf size={27} />
                        <span>Download Pdfs</span>
                    </Button>

                    <Button className="text-white bg-green-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]" onClick={refresh}>
                        <GrPowerReset size={30} className="rotate-0" />
                        <span>Refresh</span>
                    </Button>

                    <Button
                        className="text-white bg-red-700 font-poppins not-italic leading-normal capitalize py-3 px-8 font-medium flex flex-col justify-center items-center gap-y-2 text-[15px]"
                        // onClick={() => setOpenAddress(true)}
                        onClick={() => setOpenReset(true)}
                    >
                        <MdHourglassTop size={30} className="rotate-0" />
                        <span>Stop and Reset</span>
                    </Button>
                </div>
            </div>
        </div>
    </>
}

export default TrackingView;