import React, { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { Button } from "@material-tailwind/react";
import { LuDownload } from "react-icons/lu";
import { FaRegFolderOpen } from "react-icons/fa";
import DownloadXLSX from "../downloads/DownloadXLSX";
import useDocument from "../../hooks/useDocument";
import { bulkSearchLoanAccNoThunkMiddleware, excelFileDataThunkMiddleware } from "../../redux/features/campaigns";
import { useDispatch, useSelector } from "react-redux";
import { toastify } from "../../components/toast";

const ExportModal = ({
    visible = false,
    onCancel = function () { },
    global = false,
}) => {
    const inpRef = useRef(null);
    const [fileName, setFileName] = useState(""); // State to keep track of the selected file name
    const docs = useDocument();
    const { campaignDetails, singleUser } = useSelector(state => state.campaigns);
    const dispatch = useDispatch();

    // Handler for file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file ? file.name : "Choose a File");
    };

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

    const handleList = (type = "excel") => {
        if (docs.file) {
            if (docs.file?.name?.match(".xlsx")) {
                const formData = new FormData();
                if (global) {
                    formData.append("id", singleUser?.accountId);
                    formData.append("file", docs.file);
                    dispatch(bulkSearchLoanAccNoThunkMiddleware(formData, (data) => {
                        if (data) {
                            if (type === "pdf") {
                                let longLinks = data?.map(({ longLink }) => {
                                    let split_link = longLink?.split("/");
                                    let fileName = split_link[split_link.length - 1];
                                    return { link: longLink, name: fileName }
                                });
                                // console.log(longLinks)
                                docs.downloadPdf("exportFilterDocuments", longLinks)
                            } else {
                                let xlsx = Converter(data);
                                docs.downloadXLSX(xlsx, "exportFilterList");
                            }
                        }
                    }));
                } else {
                    formData.append("campaignName", campaignDetails?.name);
                    formData.append("file", docs.file);
                    dispatch(excelFileDataThunkMiddleware(formData, (data) => {
                        if (data) {
                            if (type === "pdf") {
                                let longLinks = data?.map(({ longLink }) => {
                                    let split_link = longLink?.split("/");
                                    let fileName = split_link[split_link.length - 1];
                                    return { link: longLink, name: fileName }
                                });
                                docs.downloadPdf("exportFilterDocuments", longLinks)
                            } else {
                                let xlsx = Converter(data);
                                docs.downloadXLSX(xlsx, "exportFilterList");
                            }
                        }
                    }));
                }
            } else {
                toastify({ msg: "Please, Select a Excel File!", type: "error" })
            }
        } else {
            toastify({ msg: "Please, Choose a Excel File!", type: "error" })
        }
    }

    useEffect(() => {
        if (docs) {
            setFileName(docs?.file?.name);
        }
        // console.log(docs);
    }, [docs]);

    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            centered
            closable={false}
            okText="Export"
            footer={[]}
            className="custom-modal rounded-sm"
        >
            <div className="py-2.5">
                <h2 className="font-poppins not-italic px-3 leading-normal text-xl font-semibold text-[#000000]">
                    Export Using Custom List
                </h2>
                <div className="h-[1px] bg-slate-400 w-full my-2"></div>
                <div className="flex flex-col justify-start items-start p-3">
                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-2 px-4 rounded-md shadow-sm hover:shadow-sm w-full flex justify-between text-lg items-center gap-x-1.5" onClick={async () => {
                        // DownloadXLSX([{'loanAccountNo': ''}], "documentTemplate");
                        docs.downloadXLSX([{ 'loan Account Number': '' }], "documentTemplate");
                        // let find = await docs.findHeaderXLSX("Category");
                        // let find = await docs.findHeaderXLSX("Category1");
                        // let cells = await docs.cellsXLSX("Category");
                        // console.log("cells header", cells);
                        // docs.formatXLSX();
                        // let replace1 = await docs.replaceCellsToHeaderXLSX(["Category"], [['1', '2']]);
                        // console.log("replace1", replace1);
                        // let replaceData = await docs.replaceCellsToHeaderXLSX(["Category", "Category1"], [["1", "2", "3", "4"], ["a", "b"]]);
                        // console.log("replace data", replaceData);
                        // let insertData = await docs.insertRowXLSX("Color", ["red", "blue"]);
                        // console.log("insert data",insertData);
                        // let html = await docs.docxConvertHtml();
                        // console.log("html return",html);
                    }}>
                        <LuDownload size={"22px"} />
                        <span className="w-full text-center">Download Template</span>
                    </Button>

                    <div
                        className="flex w-full justify-center cursor-pointer text-lg gap-x-2 items-center rounded-md border-[3px] border-dotted border-slate-600 py-4 my-3"
                        onClick={() => {
                            // inpRef.current.click();
                            docs.upload();
                        }}
                    >
                        <FaRegFolderOpen size={"22px"} />
                        <span>{fileName || "Choose a File"}</span>
                    </div>
                </div>
                <input
                    type="file"
                    ref={inpRef}
                    className="hidden"
                    onChange={handleFileChange} // Handle file input changes
                />
                <div className="h-[1px] bg-slate-400 w-full my-2"></div>
                <div className="flex justify-end gap-x-1 px-2 items-center my-1">
                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-700 capitalize py-2 px-3 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center gap-x-1.5" onClick={() => handleList("excel")}>
                        <LuDownload size={"18px"} />
                        <span className="w-full text-center">Export List</span>
                    </Button>

                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-700 capitalize py-2 px-3 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center gap-x-1.5" onClick={() => handleList("pdf")}>
                        <LuDownload size={"18px"} />
                        <span className="w-full text-center">Export Document</span>
                    </Button>

                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-600 capitalize py-2 px-3 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center gap-x-1.5" onClick={() => {
                        onCancel();
                        docs.reset();
                    }}>
                        <span className="w-full text-center">Close</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ExportModal;
