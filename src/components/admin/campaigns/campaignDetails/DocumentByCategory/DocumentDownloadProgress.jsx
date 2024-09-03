import React, { useMemo } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "../../../../../redux/features/progress";
import { MdOutlineClose } from "react-icons/md";

const DocumentDownloadProgress = () => {
    const dispatch = useDispatch();

    // const { campaignDetails } = useSelector((state) => state.campaigns);
    // const { campaignLoader } = useSelector((state) => state.loaders);
    const {
        docCategoryProgressView,
        docCategoryProgressTab,

        downloadAllbyCategoryCampaignDocumentFilesProgress,
        downloadAllbyCategoryCampaignDocumentFilesStatus,

        type,
        folderProgress,
    } = useSelector((state) => state.progress);

    // console.log(downloadCampaignFileProgress);

    // const isUploading = useMemo(() => {
    //     return campaignLoader[campaignDetails.name] ? true : false;
    // }, [campaignLoader[campaignDetails.name]]);

    // const percentageUpload = useMemo(() => {
    //     const progressPercentage = (
    //         (campaignLoader[campaignDetails.name]?.totalUpload /
    //             campaignLoader[campaignDetails.name]?.totalFiles) *
    //         100
    //     ).toFixed(2);
    //     return progressPercentage;
    // }, [campaignLoader[campaignDetails.name]]);

    // const isPdfsMerging = useMemo(()=>{
    //   return campaignLoader[campaignDetails.name]?.isPdfsMerging ? true : false;
    // })

    return (
        <div className="fixed right-2 bottom-2 buttonBackground p-2 rounded-full shadow-2xl cursor-pointer">
            {/* Uploading Status Icon  */}
            <span
                className=" text-3xl text-white"
                onClick={() => dispatch(setProgress({ docCategoryProgressView: !docCategoryProgressView }))}
            >
                <FaCloudUploadAlt />
            </span>

            {/* Uploading Content Item */}
            <div
                className={` absolute bottom-0 right-0 modelHeadingBackground w-[24rem] sm:w-[24rem]  rounded-lg shadow-2xl p-2 ${docCategoryProgressView ? " translate-y-0" : " translate-y-[120%]"
                    }  transition-all duration-300`}
            >
                <div className=" flex items-center bg-white gap-2 border-2 px-2 py-1 rounded-md">
                    <button
                        onClick={() => dispatch(setProgress({ docCategoryProgressTab: "download" }))}
                        className={`${docCategoryProgressTab === "download"
                            ? "buttonBackground text-white "
                            : "text-black border-gray-500"
                            }  px-2 rounded-md font-semibold border-2`}
                    >
                        Download
                    </button>
                    <div className="w-full flex justify-end">
                        <span
                            className=" text-xl cursor-pointer"
                            onClick={() => dispatch(setProgress({ docCategoryProgressView: false }))}
                        >
                            <MdOutlineClose />
                        </span>
                    </div>
                </div>

                <div className=" px-2 py-6 border-2 my-1 rounded-md bg-white">
                    {docCategoryProgressTab === "download" && (
                        <>
                            {downloadAllbyCategoryCampaignDocumentFilesStatus ? (
                                <div className=" py-2">
                                    {
                                        type === "folder" ? <>
                                            <div className=" flex items-center justify-between">
                                                <span>
                                                    Total Folder: {folderProgress}
                                                </span>
                                            </div>
                                        </> : null
                                    }
                                    <div className=" flex items-center justify-between">
                                        <span>
                                            {downloadAllbyCategoryCampaignDocumentFilesProgress}% files downloaded
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full z-40"
                                            style={{
                                                width: `${downloadAllbyCategoryCampaignDocumentFilesProgress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ) :
                                (
                                    <p className=" text-sm">No Download is in progress.</p>
                                )}
                        </>
                    )}
                </div>
            </div>
        </div >
    );
};

export default DocumentDownloadProgress;
