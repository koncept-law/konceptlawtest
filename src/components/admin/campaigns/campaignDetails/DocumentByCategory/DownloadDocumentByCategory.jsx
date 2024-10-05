import { memo, useEffect, useState } from "react";
import DataTable from "react-data-table-component"
import { IoIosCloudDone, IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import loaders, { setLoader } from "../../../../../redux/features/loaders";
import { toastify } from "../../../../toast";
// import axios from "axios";
import Spinner from "../../../../common/Spinner";
import createAxiosInstance from "../../../../../config/axiosConfig";
import { format } from "date-fns"
import { downloadAllPdfsByCategoryThunkMiddleware, downloadDocumentCategorySinglePdfThunkMiddleware } from "../../../../../redux/features/campaigns";
import Progress from "../Progress";
import { DownloadDocumentTopBar } from "./DownloadDocumentTopBar";
import DocumentDownloadProgress from "./DocumentDownloadProgress";
import axios from "axios";
import { Button } from "@material-tailwind/react";

import { TbFileTypeZip } from "react-icons/tb";
import { GrSend } from "react-icons/gr";
import EmailTestModal from "../../../../../common/modals/EmailTestModal";
import { MdCancel } from "react-icons/md";
import JSZip from "jszip";
import { setProgress } from "../../../../../redux/features/progress";
import { toastifyError } from "../../../../../constants/errors";
import Loader from "../../../../common/Loader";

const DownloadDocumentByCategory = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { campaignDetails } = useSelector((state) => state.campaigns);
    const { loader, categoriesLoader } = useSelector((state) => state.loaders);
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    // const axios = createAxiosInstance()

    // const handleDownloadSinglePdf = () => {
    //     // dispatch(downloadDocumentCategorySinglePdfThunkMiddleware({
    //     //     campaignName: campaignDetails.name,
    //     //     templateId: tableData.templateId , 
    //     //     links: tableData.links , description: row.description,
    //     // }));
    // }

    const columns = [
        {
            name: 'Template Name',
            selector: row => row?.templateName,
        },
        {
            name: "Record Type",
            selector: row => row?.recordType,
        },
        {
            name: "No. Of Files",
            selector: row => row?.numberOfFiles,
        },
        {
            name: "Time",
            selector: row => {

                const formatDateDateFns = (dateStr) => {
                    const date = new Date(dateStr);
                    return format(date, 'dd-MM-yyyy HH:mm:ss');
                };

                return (<>{formatDateDateFns(row?.dateCreated)}
                    {/* {row.links[0]?.link.split("/")[6]} */}
                </>)
            },
        },
        // {
        //     name: "Description",
        //     selector: row => {
        //         return (
        //             <span className="flex flex-wrap w-fit">{row?.description}</span>
        //         )
        //     },
        // },
        {
            name: "Download All",
            // selector: row => <div>Download Button</div>,
            selector: row => {

                const handleDownloadAll = () => {
                    // console.log("download single pdf button has been clicked")
                    dispatch(downloadAllPdfsByCategoryThunkMiddleware({ linksData: row?.links }))
                }

                return (
                    <>
                        <div>
                            <button className="flex bg-green-600 font-semibold text-white rounded-lg justify-center 
                                items-center px-3 py-1"  onClick={handleDownloadAll}>
                                <span className="text-sm">Download All</span>
                            </button>
                        </div>
                    </>
                )
            },
        },
        {
            name: "Download Single Pdf",
            // selector: row => <div>Download Button</div>,
            selector: row => {

                const handleDownloadSinglePdf = () => {
                    dispatch(downloadDocumentCategorySinglePdfThunkMiddleware({
                        campaignName: campaignDetails?.name,
                        templateId: row?.templateId,
                        links: row?.links, description: row?.description,
                    }));
                }

                return (
                    <>
                        <div>
                            <button className="flex bg-gray-600 font-semibold text-wrap my-1 text-white rounded-lg justify-center 
                                items-center px-3 py-1"  onClick={handleDownloadSinglePdf}>
                                <span className="text-[13px] md:text-sm">Download Single Pdf</span>
                            </button>
                        </div>
                    </>
                )
            },
        },
    ];

    const tableCustomStyles = {
        headRow: {
            style: {
                background: "linear-gradient(90deg, #359FF3 0%, #8256FF 100%)",
                // background: "#34201F",
                color: "#ffffff",
                fontWeight: "38px",
                fontSize: "14px",
                borderRadius: "5px",
                minHeight: "41px",
                minWidht: "100vw",
            },
        },
        rows: {
            style: {
                borderBottomStyle: "solid",
                borderBottomWidth: "1px",
                borderBottomColor: "#42bbff",
                cursor: "pointer",
                "&:not(:last-of-type)": {
                    borderBottomStyle: "solid",
                    borderBottomWidth: "1px",
                    borderBottomColor: "#42bbff",
                },
            },
        },
    };

    // const downloadZip = async () => {
    //     const links = tableData;
    //     const totalGroups = links.length;
    //     const maxSize = 300 * 1024 * 1024; // 300MB in bytes
    //     let zip = new JSZip();
    //     let batchNumber = 1;
    //     let currentBatchSize = 0;
    //     let processedFiles = 0;
    //     let count = 0; // Initialize the count here
    
    //     dispatch(
    //         setProgress({
    //             type: "folder",
    //             folderProgress: `0/${totalGroups}`,
    //             downloadAllbyCategoryCampaignDocumentFilesStatus: true,
    //             docCategoryProgressTab: "download",
    //             docCategoryProgressView: true,
    //             downloadGroupProgress: 0, // Initialize group progress
    //         })
    //     );
    
    //     for (let i = 0; i < totalGroups; i++) {
    //         const linksData = links[i]?.links || [];
    //         const totalFiles = linksData.length;
    //         const folderName = `Folder_${i + 1}`;
    //         let folder = zip.folder(folderName);
    
    //         processedFiles = 0; // Reset file progress for each group
    
    //         for (let j = 0; j < totalFiles; j++) {
    //             const fileUrl = linksData[j].link;
    //             if (fileUrl) {
    //                 const fileBlob = await fetch(fileUrl).then((res) => res.blob());
    //                 const fileSize = fileBlob.size;
    
    //                 if (currentBatchSize + fileSize > maxSize) {
    //                     // Generate and download the current batch's zip file
    //                     const content = await zip.generateAsync({ type: "blob" });
    //                     saveAs(content, `Document_Part${batchNumber}.zip`);
    
    //                     // Reset for next batch
    //                     batchNumber++;
    //                     zip = new JSZip();
    //                     folder = zip.folder(folderName);
    //                     currentBatchSize = 0;
    //                 }
    
    //                 // Extract filename from the URL
    //                 const fileName = fileUrl.split('/').pop();
    //                 folder.file(fileName, fileBlob);
    
    //                 currentBatchSize += fileSize;
    //                 processedFiles++;
    
    //                 // Update progress for individual files within the group
    //                 dispatch(
    //                     setProgress({
    //                         downloadAllbyCategoryCampaignDocumentFilesProgress: (
    //                             (processedFiles / totalFiles) * 100
    //                         ).toFixed(0),
    //                     })
    //                 );
    //             }
    //         }
    
    //         count++; // Increment the folder count here
    
    //         // Update group progress
    //         dispatch(
    //             setProgress({
    //                 folderProgress: `${count}/${totalGroups}`,
    //                 downloadGroupProgress: ((i + 1) / totalGroups) * 100,
    //             })
    //         );
    //     }
    
    //     // Generate the final zip file if any files were added
    //     if (currentBatchSize > 0) {
    //         const content = await zip.generateAsync({ type: "blob" });
    //         saveAs(content, `Document_Part${batchNumber}.zip`);
    //     }
    
    //     dispatch(
    //         setProgress({
    //             downloadAllbyCategoryCampaignDocumentFilesStatus: false,
    //             docCategoryProgressTab: "upload",
    //             docCategoryProgressView: false,
    //             downloadGroupProgress: 100, // Ensure the group progress is set to 100% when done
    //         })
    //     );
    
    //     // console.log("Completed zipping all folders");
    // };
    
    const downloadZip = async () => {
        const links = tableData;
        const totalGroups = links.length;
        const maxSize = 300 * 1024 * 1024; // 300MB in bytes
        let zip = new JSZip();
        let batchNumber = 1;
        let currentBatchSize = 0;
        let processedFiles = 0;
        let count = 0; // Initialize the count here
    
        console.log("links", tableData);
      
        dispatch(
            setProgress({
                type: "folder",
                folderProgress: `0/${totalGroups}`,
                downloadAllbyCategoryCampaignDocumentFilesStatus: true,
                docCategoryProgressTab: "download",
                docCategoryProgressView: true,
                downloadGroupProgress: 0, // Initialize group progress
            })
        );
    
        for (let i = 0; i < totalGroups; i++) {
            const linksData = links[i]?.links || [];
            const totalFiles = linksData.length;
            const folderName = `Folder_${i + 1}`;
            let folder = zip.folder(folderName);
    
            processedFiles = 0; // Reset file progress for each group
    
            for (let j = 0; j < totalFiles; j++) {
                const fileUrl = linksData[j].link;
                if (fileUrl) {
                    const fileBlob = await fetch(fileUrl).then((res) => res.blob());
                    const fileSize = fileBlob.size;
    
                    if (currentBatchSize + fileSize > maxSize) {
                        // Generate and download the current batch's zip file
                        const content = await zip.generateAsync({ type: "blob" });
                        saveAs(content, `Document_Part${batchNumber}.zip`);
    
                        // Reset for next batch
                        batchNumber++;
                        zip = new JSZip();
                        folder = zip.folder(folderName);
                        currentBatchSize = 0;
                    }
    
                    // Extract filename from the URL
                    const fileName = fileUrl.split('/').pop();
                    folder.file(fileName, fileBlob);
    
                    currentBatchSize += fileSize;
                    processedFiles++;
    
                    // Update progress for individual files within the group
                    dispatch(
                        setProgress({
                            downloadAllbyCategoryCampaignDocumentFilesProgress: (
                                (processedFiles / totalFiles) * 100
                            ).toFixed(0),
                        })
                    );
                }
            }
    
            // After processing all files in a folder, generate the zip file
            const folderContent = await zip.generateAsync({ type: "blob" });
            const folderBlob = new Blob([folderContent], { type: 'application/zip' });
    
            // Create form data and upload the zip to API
            const formData = new FormData();
            formData.append('file', folderBlob, `${folderName}.zip`);
            formData.append('campaignName', campaignDetails.name);
            formData.append('templateName', links?.templateName);
    
            try {
                const resp = await axios.postForm('/campaign/uploadZipinS3', formData);
                console.log(`Uploaded folder: ${folderName}`, resp.data);
            } catch (error) {
                console.error(`Failed to upload folder: ${folderName}`, error);
            }
    
            count++; // Increment the folder count here
    
            // Update group progress
            dispatch(
                setProgress({
                    folderProgress: `${count}/${totalGroups}`,
                    downloadGroupProgress: ((i + 1) / totalGroups) * 100,
                })
            );
        }
    
        // Generate the final zip file if any files were added
        if (currentBatchSize > 0) {
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `Document_Part${batchNumber}.zip`);
        }
    
        dispatch(
            setProgress({
                downloadAllbyCategoryCampaignDocumentFilesStatus: false,
                docCategoryProgressTab: "upload",
                docCategoryProgressView: false,
                downloadGroupProgress: 100, // Ensure the group progress is set to 100% when done
            })
        );
    };
    

    const getTableData = async () => {
        try {
            dispatch(setLoader({ loader: true, categoriesLoader: true }))
            const response = await axios.post(`t.kcptl.in/docs/getAllCategoryData`, { campaignName: campaignDetails.name })

            if (response.status === 200) {
                // console.log(response.data)
                const { message } = response.data;
                setTableData(response.data.resultArray);
                toastify({ msg: message, type: "success" });
            }
        } catch (error) {
            toastifyError(error, (call)=> {
                if(call === "logout"){
                  navigate("/login");
                }
              })
        } finally {
            dispatch(setLoader({ loader: false, categoriesLoader: false }))
        }
    }

    // console.log(loader)

    // console.log("table data", tableData)

    useEffect(() => {
        getTableData();
    }, []);

    useEffect(() => { }, [tableData])

    return (
        <>
            <EmailTestModal
                isModalVisible={showModal}
                setIsModalVisible={() => setShowModal(false)}
                title="Zip To Email"
                buttonText="Send Email"
                onSubmit={() => { }}
            />
            {(categoriesLoader && !loader ) && <Loader />}
            <div className="h-[94vh] w-[100%] overflow-hidden px-2 py-2 flex gap-2 md:gap-4 flex-col">
                <DownloadDocumentTopBar title={campaignDetails.name} refreshPage={() => getTableData()} items={
                    <div className="flex justify-center items-center gap-x-2">
                        <div className="flex justify-center items-center gap-x-2 mx-2">
                            <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-[#000000]">Zip Ready To Send:</h2>
                            {
                                campaignDetails?.zipReadyToSend ? <IoIosCloudDone size={26} className="text-green-700" />
                                    : <MdCancel size={23} className="text-red-700" />
                            }
                        </div>

                        <Button className="flex justify-center py-1.5 capitalize rounded-md text-[14px] px-3 bg-blue-700 items-center gap-x-1 font-poppins not-italic leading-normal font-medium" onClick={downloadZip}>
                            <TbFileTypeZip size={18} />
                            <span>Zip</span>
                        </Button>

                        <Button className="flex justify-center py-1.5 rounded-md capitalize text-[14px] px-3 bg-green-700 items-center gap-x-1 font-poppins not-italic leading-normal font-medium" onClick={() => setShowModal(true)}>
                            <GrSend size={17} />
                            <span>Send Zip</span>
                        </Button>
                    </div>
                } />
                {/* <Topbar toggle={openAddCampaignHandler} /> */}
                <div className="p-3 min-h-fit h-[90%]  bg-white rounded-md overflow-y-scroll table-container">
                    {/* <CampaignsTable toggle={openAddCampaignHandler} /> */}
                    <DataTable
                        data={tableData ? tableData : []}
                        columns={columns}
                        pagination
                        selectableRows
                        customStyles={tableCustomStyles}
                        responsive={true}
                        loader={loader}
                        noDataComponent={< CustomNoDataComponenet />}
                        progressComponent={< CustomProgressComponenet />}
                    />
                </div>
                <DocumentDownloadProgress campaignType={campaignDetails.type} pageType="docByCategory" />
            </div>
            {/* <div>
                <h1>Download Document By Category</h1>
                <DataTable
                    data={data}
                    columns={columns}
                    pagination
                    customStyles={tableCustomStyles}
                    responsive={true}
                    noDataComponent={< CustomNoDataComponenet />}
                    progressComponent={< CustomProgressComponenet />}
                />
            </div> */}

        </>
    )
}

export default DownloadDocumentByCategory



const CustomNoDataComponenet = () => {
    return (
        <div className="w-full p-10 text-center">
            There are no records to displays
        </div>
    );
};

const CustomProgressComponenet = () => {
    return <div className="w-full p-10 text-center">Loading...</div>;
};




// {
//     "numberOfFiles": 2,
//         "description": "241.pdf-245.pdf",
//             "links": [
//                 {
//                     "link": "https://konc1.s3.ap-south-1.amazonaws.com/mainMerged/dipeshMergeType/668bd257ba56fefcad03faa0/241.pdf",
//                     "lastModified": "2024-07-27T07:37:36.000Z"
//                 },
//                 {
//                     "link": "https://konc1.s3.ap-south-1.amazonaws.com/mainMerged/dipeshMergeType/668bd257ba56fefcad03faa0/245.pdf",
//                     "lastModified": "2024-07-27T07:37:40.000Z"
//                 }
//             ],
//                 "templateName": "card salary attachment",
//                     "recordType": "pdfData",
//                         "dateCreated": "2024-07-27T07:37:36.000Z"
// }
