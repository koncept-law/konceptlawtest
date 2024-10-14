import { Button } from "@material-tailwind/react";
import { Modal, Spin } from "antd";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { FaFileExport } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import useDocument from "../../hooks/useDocument";
import { LuDownload } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";
import { toastify } from "../../components/toast";
import { GrPowerReset } from "react-icons/gr";
import createAxiosInstance from "../../config/axiosConfig";
import { toastifyError } from "../../constants/errors";
import { useDispatch, useSelector } from "react-redux";
import { getCampaignByNameThunkMiddleware } from "../../redux/features/campaigns";
import { useNavigate } from "react-router-dom";

const ExportDocumentModal = ({
    open = false,
    handleCancel = function () { }
}) => {
    const axiosInstance = createAxiosInstance();
    const { campaignDetails } = useSelector(state => state.campaigns);
    const docs = useDocument();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pdfLoader, setPdfLoader] = useState(false);
    const [countLoading, setCountLoading] = useState(0);

    const handleModalClose = () => {
        docs.reset();
        setData(null);
        setLoader(false);
        handleCancel();
    }

    // functions
    const useApi = async (payload) => {
        const formData = new FormData();
        Object.keys(payload).forEach((item) => {
            formData.append(item, payload[item]);
        })

        try {
            setLoader(true);
            setData(null);
            const response = await axiosInstance.postForm(`/campaign/bulkSearchCampaignWiseLoanAccNo`, formData);

            if (response.status === 200) {
                let data = response.data;
                setData(data);
                setLoader(false);
            }
        } catch (error) {
            toastifyError(error);
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    const Converter = (data) => {
        if (Array.isArray(data)) {
            return data?.map((item) => (
                {
                    "Campaign Name": item?.campaignName,
                    "Serial Number": item?.serialNo,
                    "Loan Account Number": item?.loanAccountNo,
                    "Email": item?.email,
                    "Customer Mobile Number": item?.customerMobileNumber,
                    "Customer Name": item?.customerName,
                    // "Category1": item?.category1,
                    // "Category": item?.category,
                    // "ShortLink": item?.shortLink,
                    "LongLink": item?.longLink,
                }
            ))
        }
    }

    const handleDownloadExcel = () => {
        try {
            if (data) {
                setPdfLoader(true);
                let xlsx = Converter(data);
                docs.downloadXLSX(xlsx, "exportFilterExcel", (loading) => {
                    if (loading === 100) {
                        setPdfLoader(false);
                        setCountLoading(0);
                    } else {
                        setCountLoading(loading);
                    }
                });
            } else {
                toastify({ msg: "Data not Available!", type: "error" });
            }
        } catch (error) {
            toastifyError(error);
        }
    }

    const handleDownloadPDF = () => {
        try {
            if (data) {
                setPdfLoader(true);
                let longLinks = data?.map(({ longLink }) => {
                    let split_link = longLink?.split("/");
                    let fileName = split_link[split_link.length - 1];
                    return { link: longLink, name: fileName }
                });
                // console.log(longLinks)
                docs.downloadPdf("exportFilterPDFs", longLinks, (loading) => {
                    if (loading === 100) {
                        setPdfLoader(false);
                        setCountLoading(0);
                    } else {
                        setCountLoading(loading)
                    }
                })
            } else {
                toastify({ msg: "Data not Available!", type: "error" });
            }
        } catch (error) {
            toastifyError(error);
        }
    }

    const handleSinglePDF = async () => {
        try {
            if (Array.isArray(data) && data?.length > 0) {
                // console.log(data);
                const links = data?.map((item) => ({ link: item?.longLink }));
                console.log(links);
                const response = await axiosInstance.post("/docs/searchSinglePdf", { links });
                if (response.status === 200) {
                    const { data: { message, fileUrl } } = response;
                    console.log(fileUrl);
                    toastify({ msg: message });
                    docs.downloadToUrl(fileUrl, "searchedSinglePdf");
                }
            } else {
                toastify({ msg: "Data not Available!", type: "error" });
            }
        } catch (error) {
            toastifyError(error);
        }
    }

    const uploadandSearch = () => {
        const file = docs.file;
        if (file) {
            // console.log(file);
            if (file.name?.match(".xlsx")) {
                useApi({
                    file: file,
                    campaignName: campaignDetails?.name,
                });
            } else {
                toastify({ msg: "Please Select a Excel {.xlsx} File", type: "error" })
            }
        } else {
            toastify({ msg: "Please Select a file!", type: "error" });
        }
    }

    const onResetFile = () => docs.reset();

    // table
    const columns = [
        {
            name: <div className="text-wrap">{'Campaign Name'}</div>,
            selector: row => row?.campaignName,
            cell: (row) => (
                <span className="hover:text-blue-700 cursor-pointer" onClick={() => {
                    // setOpen(false);
                    handleCancel();
                    dispatch(getCampaignByNameThunkMiddleware({ campaignName: row?.campaignName }));
                    navigate("/campaigns/campaigndetails");
                }}>{row?.campaignName}</span>
            ),
            wrap: true,
        },
        {
            name: <div className="text-wrap">{'Serial Number'}</div>,
            selector: row => row?.serialNo,
            wrap: true,
        },
        {
            name: <div className="text-wrap">{'Loan Account Number'}</div>,
            selector: row => row?.loanAccountNo,
            wrap: true,
        },
        {
            name: <div className="text-wrap">{'Email'}</div>,
            selector: row => row?.email,
            wrap: true,
        },
        {
            name: <div className="text-wrap">{'Customer Mobile Number'}</div>,
            selector: row => row?.customerMobileNumber,
            wrap: true,
        },
        {
            name: <div className="text-wrap">{'Customer Name'}</div>,
            selector: row => row?.customerName,
            wrap: true,
        },
        {
            name: <div className="text-wrap">{'LongLink'}</div>,
            // selector: row => row?.longLink,
            cell: (row) => (
                <a href={row?.longLink} target="_blank">{row?.longLink}</a>
            ),
            wrap: true,
        },
    ];

    return <>
        <Modal
            open={open}
            onCancel={handleModalClose}
            centered
            footer={null}
            closable={false}
            width={1200}
            // height={500}
            className="rounded-md relative overflow-hidden"
        >
            {
                pdfLoader ? <>
                    <div className="w-full h-full absolute top-0 left-0 z-20 flex justify-center gap-4 flex-col items-center bg-white/25">
                        <Spin />
                        <h2 className="font-poppins not-italic leading-normal font-medium text-[16px]">Download... {countLoading}%</h2>
                    </div>
                </> : null
            }
            <div className="flex h-[80vh] flex-col w-full">
                <div className="flex justify-between items-center py-3 px-4 text-white bg-slate-800 koncept-background">
                    <div className="flex justify-center items-center gap-x-3">
                        <h2 className="font-poppins flex justify-center items-center gap-x-2 not-italic leading-normal font-medium text-[15px]">
                            <FaFileExport size={"18px"} />
                            <span>Export</span>
                        </h2>
                    </div>
                    <div className="flex justify-center items-center gap-x-6">
                        {
                            data ? <>
                                <div className="flex justify-center items-center gap-x-2">
                                    <div className="flex justify-center items-center">
                                        <Button className="font-poppins not-italic leading-normal font-light py-1 px-4 capitalize bg-gray-900 text-white rounded-md" onClick={handleDownloadExcel}>
                                            Download Excel
                                        </Button>
                                    </div>

                                    <div className="flex justify-center items-center">
                                        <Button className="font-poppins not-italic leading-normal font-light py-1 px-4 capitalize bg-gray-900 text-white rounded-md" onClick={handleDownloadPDF}>
                                            Download PDF
                                        </Button>
                                    </div>

                                    <div className="flex justify-center items-center">
                                        <Button className="font-poppins not-italic leading-normal font-light py-1 px-4 capitalize bg-gray-900 text-white rounded-md" onClick={handleSinglePDF}>
                                            Download Single PDF
                                        </Button>
                                    </div>
                                </div>
                            </> : null
                        }

                        <button className="cursor-pointer active:text-red-700 transition-all text-slate-100" onClick={handleModalClose}>
                            <RxCross2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-white h-full overflow-y-scroll w-full p-2">
                    {
                        data ? (!loader ? <DataTable
                            columns={columns}
                            data={data || []}
                            // className="shadow-md"
                            customStyles={{
                                headRow: {
                                    style: {
                                        backgroundColor: "#1e293b", // Your background color for the header row
                                        color: "white",
                                        fontFamily: "Poppins",
                                        fontStyle: "normal",
                                        fontWeight: "400"
                                    },
                                },
                                headCells: {
                                    style: {
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        textWrap: "wrap",
                                        textAlign: 'center', // Optional: center-aligns the header text
                                    },
                                },
                                table: {
                                    style: {
                                        borderRadius: "4px",
                                        overflow: "hidden"
                                    }
                                }
                            }}
                            pagination={true}
                            paginationPerPage={10}
                        // paginationRowsPerPageOptions={[1, 5, 10]}
                        /> : <div className="flex justify-center gap-x-3 text-lg gap-y-3 flex-col text-center font-poppins not-italic leading-normal font-medium items-center w-full h-full">
                            <Spin /> <h2 className=" -mr-3 text-center">Loading...</h2>
                        </div>)
                            : <div className="flex justify-start w-full h-full items-start">
                                <div className="w-full flex justify-center items-center px-3  h-full">
                                    <div className="w-full h-full border-2 border-dotted border-gray-900 overflow-hidden rounded-md bg-gray-50">
                                        <Button className="  w-full cursor-pointer h-full text-[28px] gap-x-3  font-poppins lowercase text-black not-italic leading-normal bg-transparent shadow-none hover:shadow-none font-medium flex justify-center items-center p-3 rounded-md active:scale-95" onClick={() => docs.upload()}>
                                            <RiFileExcel2Line size={40} />
                                            <h2>{docs.file?.name ? docs.file?.name : "Choose a File"}</h2>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-center w-[25%] flex-col items-end gap-y-3">
                                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-2 px-4 rounded-md shadow-sm w-full hover:shadow-sm flex justify-between text-[15px] items-center gap-x-1.5" onClick={() => {
                                        docs.downloadXLSX([{ 'loan Account Number': '' }], "documentTemplate");
                                    }}>
                                        <LuDownload size={"20px"} />
                                        <span className="w-full text-center">Download Template</span>
                                    </Button>

                                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-green-700 capitalize py-2 px-4 rounded-md shadow-sm w-full hover:shadow-sm flex justify-between text-[15px] items-center gap-x-1.5" onClick={uploadandSearch}>
                                        <IoSearch size={"20px"} />
                                        <span className="w-full text-center">Upload and Search</span>
                                    </Button>

                                    {
                                        docs.file ? <>
                                            <Button className="font-poppins not-italic leading-normal text-white font-medium bg-red-700 capitalize py-2 px-4 rounded-md shadow-sm w-full hover:shadow-sm flex justify-between text-[15px] items-center gap-x-1.5" onClick={onResetFile}>
                                                <GrPowerReset size={"20px"} />
                                                <span className="w-full text-center">Remove Selected File</span>
                                            </Button>
                                        </> : null
                                    }
                                </div>
                            </div>
                    }
                </div>
            </div>
        </Modal>
    </>
}

export default ExportDocumentModal;