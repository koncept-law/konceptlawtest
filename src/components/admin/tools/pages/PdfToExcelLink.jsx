import React, { useEffect, useRef, useState } from "react";
import Spinner from "../../../common/Spinner";
import { Button } from "@material-tailwind/react";
import book1Img from "../../../../assets/rdnumber.png";
import createAxiosInstance from "../../../../config/axiosConfig";
import { toastify } from "../../../toast";
import { MdOutlineFileDownload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Select, Spin, Tooltip } from "antd";
import { getChildFoldersThunkMiddleware, pdfToExcelLinkThunkMiddleware } from "../../../../redux/features/tools";
import useUpload from "../../../../hooks/useUpload";
import DataTable from "react-data-table-component";
import { IoReloadSharp } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import MyButton from "../../../common/Buttons/MyButton";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa6";
import { toastifyError } from "../../../../constants/errors";
import useDocument from "../../../../hooks/useDocument";

const PdfToExcelLink = () => {
    // const handleOpen = () => setOpen(!open);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isLoad, setIsLoad] = useState(false);
    const axios = createAxiosInstance();
    const dispatch = useDispatch();
    const { pdfToExcelData } = useSelector(state => state.tools);
    const { singleUser } = useSelector(state => state.campaigns);
    const { user } = useSelector(state => state.user);
    const docs = useDocument();
    // console.log(user)
    const {
        setUpload,
        setProgress,
        setProgressTitle,
        uploadOpen,
        setShowUpload,
    } = useUpload();

    const book1 = useRef(null);
    // console.log(singleUser);
    useEffect(() => { setShowUpload(true) }, []);
    const refresh = () => {
        setIsLoad(true);
        dispatch(getChildFoldersThunkMiddleware(user?._id, () => {
            setIsLoad(false);
        }));
    }

    useEffect(() => {
        refresh();
    }, []);

    const startPDfToExcelLink = async () => {
        const file1 = book1.current.files;
        const uniqueId = uuidv4();
        // console.log(uniqueId);

        console.log(file1);
        if (file1 && file1?.length > 0) {
            const formData = new FormData();
            let files = [];
            Object.keys(file1)?.forEach((item) => {
                // formData.append("files", file1[item]);
                files.push(file1[item]);
            })
            // formData.append("book1", file1);
            // formData.append("uniqueId", uniqueId);

            setShowSpinner(true);
            setUpload(true);
            setProgressTitle(`PDF To Excel Link (0/${files.length})`);
            uploadOpen(true);


            dispatch(pdfToExcelLinkThunkMiddleware({
                files: files,
                uniqueId: uniqueId,
                callback: (call) => {
                    if (call?.upload === false) {
                        toastify({ msg: "File merged and downloaded successfully!", type: "success", position: "top-center" })
                        book1.current.value = "";
                        // handleOpen();
                    } else {
                        setProgressTitle(`PDF To Excel Link (${call?.totalUpload}/${call?.totalFiles})`);
                        let totalUpload = parseInt(call?.totalUpload);
                        let totalFiles = parseInt(call?.totalFiles);
                        setProgress(Math.floor((totalUpload / totalFiles) * 100));
                    }
                },
                complete: () => {
                    refresh();
                    setShowSpinner(false);
                    setUpload(false);
                    setProgress(0);
                    uploadOpen(false);
                }
            }))
        } else {
            toastify({ msg: "Please select a file to proceed.", type: "error", position: "top-center" })
        }
    }

    const tableCustomStyles = {
        header: {
            style: {
                fontSize: '16px',
                fontFamily: 'Poppins, sans-serif',
                backgroundColor: '#000000',
                color: '#FFFFFF',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#000000',
                // borderTopLeftRadius: '6px',   // To round top corners of header row
                // borderTopRightRadius: '6px',
            },
        },
        headCells: {
            style: {
                color: '#FFFFFF',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 'bold',
                textAlign: 'center',
            },
        },
        rows: {
            style: {
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                borderBottomColor: '#e0e0e0',
            },
        },
        cells: {
            style: {
                padding: '10px',  // Padding for table cells
                textAlign: 'center',
            },
        },
        container: {
            style: {
                borderRadius: '10px',               // Rounding for the entire table
                overflow: 'hidden',                // Ensure the content stays within rounded borders
                border: '1px solid #e0e0e0',       // Optional border for the table
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
            },
        },
        tableWrapper: {
            style: {
                borderRadius: '5px',               // Rounding for the entire table
                overflow: 'hidden',                // Ensure the content stays within rounded borders
                border: '1px solid #e0e0e0',       // Optional border for the table
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Added box shadow
            },
        },
    };

    const downloadExcel = async (row) => {
        let folderName = row?.folderName;
        let folder = `${user?._id}/${folderName}`;
        try {
            const response = await axios.post("/tools/getPdfLinksAsExcel", { folder }, {
                responseType: "blob"
            });
            if (response.status === 200) {
                // console.log(response.data)
                docs.download(response.data, "pdfToExcelFile");
            }
        } catch (error) {
            toastifyError(error);
        } finally {

        }
        // console.log(folder);
    }

    const columns = [
        {
            name: "Date",
            selector: row => row?.createdOn || '-',
            wrap: true,
        },
        {
            name: "Tracking Files Made",
            selector: row => row?.pdfCount || '-',
            wrap: true,
        },
        {
            name: "Download Excel",
            cell: (row) => {
                return <>
                    <MyButton
                        title="Download Excel"
                        className="bg-green-700 flex justify-center text-[14px] py-2 px-4 items-center gap-x-2 my-2"
                        placement="top"
                        onClick={() => downloadExcel(row)}
                    >
                        <RiFileExcel2Line size={18} />
                        Excel
                    </MyButton>
                </>
            },
        },
        // {
        //     name: "Download Pdfs",
        //     cell: (row) => {
        //         return <>
        //             <MyButton
        //                 title="Download Pdfs"
        //                 className="bg-purple-700 flex justify-center text-[14px] py-2 px-4 items-center gap-x-2 my-2"
        //                 placement="top"
        //                 onClick={() => downloadPdfs(row)}
        //             >
        //                 <FaRegFilePdf size={18} />
        //                 Pdfs
        //             </MyButton>
        //         </>
        //     },
        // },
    ];



    return <>
        <div className="flex flex-col w-full">
            <div className="flex p-3 justify-between bg-slate-800 text-white w-full items-center">
                <h2 className="font-poppins not-italic leading-normal font-medium">Pdf To Excel Link</h2>
                <Tooltip title="Reload" placement="bottom">
                    <button className="cursor-pointer bg-black py-1 px-2 rounded-md flex justify-center items-center gap-x-2 text-[15px] active:text-red-700 transition-all" onClick={refresh}>
                        <IoReloadSharp size={16} />
                        <span>Refresh</span>
                    </button>
                </Tooltip>
            </div>

            {
                isLoad ? <div className="fixed top-0 left-0 bg-white/50 flex justify-center items-center w-full h-full z-30">
                    <Spin />
                </div> : null
            }

            <div className="bg-white flex flex-col py-5 px-2 main-text gap-y-7 w-full">
                {/* <h2 className="font-medium text-[15px]">Total number of PDF To Excel Link:<span className="text-slate-700"> 0</span></h2> */}
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

                <div className="w-full grid grid-cols-1 gap-x-2">
                    <Button className="bg-purple-500 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium" onClick={startPDfToExcelLink}>
                        {showSpinner ? <Spinner width={16} /> : null}
                        Pdf To Excel Link
                    </Button>
                    {/* <Button className="bg-green-700 py-2 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-1 font-medium">
                        <MdOutlineFileDownload size={20} />
                        Download Excel
                    </Button> */}
                </div>
            </div>

            <div className="w-full my-2">
                <DataTable
                    columns={columns}
                    data={pdfToExcelData || []}
                    customStyles={tableCustomStyles}
                    pagination
                    className="custom-table-header"
                />
            </div>
        </div>
    </>
}

export default PdfToExcelLink;