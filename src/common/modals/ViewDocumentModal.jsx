import React, { useRef } from "react";
import { Modal, Spin } from "antd";
import { RxCross2 } from "react-icons/rx";
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import DownloadXLSX from "../downloads/DownloadXLSX";
import useDocument from "../../hooks/useDocument";
import { unqiueAccountNoDataThunkMiddleware } from "../../redux/features/campaigns";
import { IoSearch } from "react-icons/io5";

const ViewDocumentModal = ({ open = true, setOpen = function () { } }) => {
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

    const columns = [
        {
            name: <div className="text-wrap">{'Campaign Name'}</div>,
            selector: row => row?.campaignName,
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
        // {
        //     name: <div className="text-wrap">{'Category1'}</div>,
        //     selector: row => row?.category1,
        //     wrap: true,
        // },
        // {
        //     name: <div className="text-wrap">{'Category'}</div>,
        //     selector: row => row?.category,
        //     wrap: true,
        // },
        // {
        //     name: <div className="text-wrap">{'ShortLink'}</div>,
        //     selector: row => row?.shortLink,
        //     wrap: true,
        // },
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
                    // "Category1": item?.category1,
                    // "Category": item?.category,
                    // "ShortLink": item?.shortLink,
                    "LongLink": item?.longLink,
                }
            ))
        }
    }

    const handleDownloadExcel = () => {
        let xlsx = Converter(unqiueAccountNoData);
        // console.log(xlsx)
        DownloadXLSX(xlsx, "filterToAccount");
    }

    const handleDownloadPDF = () => {
        let longLinks = unqiueAccountNoData?.map(({ longLink }) => ({ link: longLink }));
        // console.log(longLinks);
        docs.downloadPdf("filterAccountPdfs", longLinks)
    }

    const handleUnqiueAccount = (e) => {
        e.preventDefault();
        let accountNo = accountNoRef.current.value;
        console.log("account no", accountNo)
        // console.log(singleUser)
        if (accountNo && accountNo !== "") {
            dispatch(unqiueAccountNoDataThunkMiddleware({
                id: singleUser?._id,
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
        >
            <div className="flex h-[80vh] flex-col w-full">
                <div className="flex justify-between items-center py-3 px-4 text-white bg-slate-800">
                    <div className="flex justify-center items-center gap-x-3">
                        <h2 className="font-poppins not-italic leading-normal font-medium text-[15px]">View Document</h2>
                        <div className="flex rounded-sm overflow-hidden">
                            <input 
                                ref={accountNoRef} 
                                type="text" 
                                className="outline-none text-[#000] px-2 py-1" 
                                placeholder="Loan Account No." 
                                onKeyDown={(e) => {
                                    if(e.key === "Enter"){
                                        handleUnqiueAccount(e);
                                    }
                                }}
                            />
                            <Button className="font-poppins not-italic leading-normal font-light py-1 px-4 capitalize bg-gray-900 text-white rounded-none" onClick={handleUnqiueAccount}>
                                <IoSearch size={16} />
                            </Button>
                        </div>
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
                            customStyles={{
                                headRow: {
                                    style: {
                                        backgroundColor: "#f3f4f6", // Your background color for the header row
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
