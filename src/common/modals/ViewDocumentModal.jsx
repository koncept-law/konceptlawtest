import React, { useEffect, useRef, useState } from "react";
import { Modal, Spin } from "antd";
import { RxCross2 } from "react-icons/rx";
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import DownloadXLSX from "../downloads/DownloadXLSX";
import useDocument from "../../hooks/useDocument";
import { getCampaignByNameThunkMiddleware, setCampaigns, unqiueAccountNoDataThunkMiddleware } from "../../redux/features/campaigns";
import { IoSearch } from "react-icons/io5";
import { setLoader } from "../../redux/features/loaders";
import { useNavigate } from "react-router-dom";

const ViewDocumentModal = ({
    open = true,
    setOpen = function () { },
    globalSearch = false,
}) => {
    const { unqiueAccountNoData, singleUser } = useSelector(
        (state) => state.campaigns
    );
    const { loader } = useSelector(state => state.loaders);
    const docs = useDocument();
    const handleCancel = () => {
        setOpen(false); // Close the modal when "Cancel" is clicked
    };
    const accountNoRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [pdfLoader, setPdfLoader] = useState(false);
    const [countLoading, setCountLoading] = useState(0);

    useEffect(() => {
        if (!open) {
            dispatch(setCampaigns({ unqiueAccountNoData: null }));
            dispatch(setLoader({ loader: false }));
        }
    }, [open]);

    const columns = [
        {
            name: <div className="text-wrap">{'Campaign Name'}</div>,
            // selector: row => row?.campaignName,
            cell: (row) => (
                <span className="hover:text-blue-700 cursor-pointer" onClick={() => {
                    setOpen(false);
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
                    "LongLink": item?.longLink,
                }
            ))
        }
    }

    const handleDownloadExcel = () => {
        let xlsx = Converter(unqiueAccountNoData);
        // console.log(xlsx)
        DownloadXLSX(xlsx, "book1");
    }

    const handleDownloadPDF = () => {
        setPdfLoader(true);
        let longLinks = unqiueAccountNoData?.map(({ longLink }) => {
            let split_link = longLink?.split("/");
            let fileName = split_link[split_link.length - 1];

            return { link: longLink, name: fileName }
        });
        docs.downloadPdf("filterAccountPdfs", longLinks, (loading) => {
            if (loading === 100) {
                setPdfLoader(false);
                setCountLoading(0);
            } else {
                setCountLoading(loading)
            }
        })
    }

    const handleUnqiueAccount = (e) => {
        e.preventDefault();
        let accountNo = accountNoRef.current.value;
        console.log("account no", accountNo)
        // console.log(singleUser)
        if (accountNo && accountNo !== "") {
            dispatch(unqiueAccountNoDataThunkMiddleware({
                id: singleUser?.accountId,
                // unique_account_no: Number.parseInt(accountNo),
                loanAccountNo: Number.parseInt(accountNo),
            }))
        } else {
            toastify({ msg: "Loan Account Number Not Fill", type: "error" })
        }
    }

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
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
                        <h2 className="font-poppins not-italic leading-normal font-medium text-[15px]">View Document</h2>
                        {
                            globalSearch ? <>
                                <div className="flex rounded-sm overflow-hidden">
                                    <input
                                        ref={accountNoRef}
                                        type="text"
                                        className="outline-none text-[#000] px-2 py-1"
                                        placeholder="Loan Account No."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                handleUnqiueAccount(e);
                                            }
                                        }}
                                    />
                                    <Button className="font-poppins not-italic leading-normal font-light py-1 px-4 capitalize bg-gray-900 text-white rounded-none" onClick={handleUnqiueAccount}>
                                        <IoSearch size={16} />
                                    </Button>
                                </div>
                            </> : null
                        }
                    </div>
                    <div className="flex justify-center items-center gap-x-6">
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
                        </div>

                        <button className="cursor-pointer active:text-red-700 transition-all text-slate-100" onClick={handleCancel}>
                            <RxCross2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="bg-white h-full overflow-y-scroll w-full p-2">
                    {
                        !loader ? <DataTable
                            columns={columns}
                            data={unqiueAccountNoData || []}
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
                            {/* <h2>Loading...</h2> */}
                            <Spin /> <h2 className=" -mr-3 text-center">Loading...</h2>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    );
};

export default ViewDocumentModal;
