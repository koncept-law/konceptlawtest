import React, { useMemo } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setProgress } from "../../../../redux/features/progress";
import { MdOutlineClose } from "react-icons/md";

const Progress = () => {
  const dispatch = useDispatch();

  const { campaignDetails } = useSelector((state) => state.campaigns);
  const { campaignLoader } = useSelector((state) => state.loaders);
  const {
    progressView,
    progressTab,
    downloadCampaignFileStatus,
    downloadCampaignFileProgress,

    downloadDocumentCampaignFileProgress,
    downloadDocumentCampaignFileStatus,

    singlePdfCampaignFileStatus,
    singlePdfCampaignFileProgress,
    samplePdfCampaignFilesProgress,
    samplePdfCampaignFilesStatus,
    createDocumentsCampaignFilesProgress,
    createDocumentsCampaignFilesStatus,
    createShortLink,
    createShortLinkProgress,
  } = useSelector((state) => state.progress);

  // console.log(downloadCampaignFileProgress);

  const isUploading = useMemo(() => {
    return campaignLoader[campaignDetails.name] ? true : false;
  }, [campaignLoader[campaignDetails.name]]);

  const percentageUpload = useMemo(() => {
    const progressPercentage = (
      (campaignLoader[campaignDetails.name]?.totalUpload /
        campaignLoader[campaignDetails.name]?.totalFiles) *
      100
    ).toFixed(2);
    return progressPercentage;
  }, [campaignLoader[campaignDetails.name]]);

  // const isPdfsMerging = useMemo(()=>{
  //   return campaignLoader[campaignDetails.name]?.isPdfsMerging ? true : false;
  // })

  return (
    <div className="fixed right-2 bottom-2 buttonBackground p-2 rounded-full shadow-2xl cursor-pointer">
      {/* Uploading Status Icon  */}
      <span
        className=" text-3xl text-white"
        onClick={() => dispatch(setProgress({ progressView: !progressView }))}
      >
        <FaCloudUploadAlt />
      </span>

      {/* Uploading Content Item */}
      {/* bg-white */}
      <div
        className={` absolute bottom-0 right-0 
          modelHeadingBackground
          w-[24rem] sm:w-[24rem]  rounded-lg shadow-2xl p-2 ${progressView ? " translate-y-0" : " translate-y-[120%]"
          }  transition-all duration-300`}
      >
        <div className=" flex items-center bg-white gap-2 border-2 px-2 py-1 rounded-md">
          <button
            onClick={() => dispatch(setProgress({ progressTab: "upload" }))}
            className={`${progressTab === "upload"
              ? "buttonBackground text-white"
              : " text-black border-gray-500"
              } px-2 rounded-md  font-semibold border-2`}
          >
            Upload
          </button>
          {/* <button
            onClick={() => dispatch(setProgress({ progressTab: "create" }))}
            className={`${progressTab === "create"
              ? "buttonBackground text-white"
              : " text-black border-gray-500"
              } px-2 rounded-md  font-semibold border-2`}
          >
            Create
          </button> */}
          <button
            onClick={() => dispatch(setProgress({ progressTab: "download" }))}
            className={`${progressTab === "download"
              ? "buttonBackground text-white "
              : "text-black border-gray-500"
              }  px-2 rounded-md font-semibold border-2`}
          >
            Download
          </button>
          {/* <button
            onClick={() => dispatch(setProgress({ progressTab: "merge" }))}
            className={`${progressTab === "merge"
              ? "buttonBackground text-white "
              : "text-black border-gray-500"
              }  px-2 rounded-md font-semibold border-2`}
          >
            Merge
          </button> */}
          <button
            onClick={() => dispatch(setProgress({ progressTab: "shortLink" }))}
            className={`${progressTab === "shortLink"
              ? "buttonBackground text-white "
              : "text-black border-gray-500"
              }  px-2 rounded-md font-semibold border-2`}
          >
            ShortLink
          </button>
          <div className="w-full flex justify-end">
            <span
              className=" text-xl cursor-pointer"
              onClick={() => dispatch(setProgress({ progressView: false }))}
            >
              <MdOutlineClose />
            </span>
          </div>
        </div>

        <div className=" px-2 py-6 bg-white border-2 my-1 rounded-md">
          {progressTab === "upload" && (
            <>
              {isUploading ? (
                <div className=" py-2">
                  <div className=" flex items-center justify-between">
                    <span>
                      {campaignLoader[campaignDetails.name]?.totalUpload}/
                      {campaignLoader[campaignDetails.name]?.totalFiles} files
                      uploaded
                    </span>
                    <span> {percentageUpload}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${percentageUpload}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className=" text-sm">No Upload is in progress.</p>
              )}
            </>
          )}

          {progressTab === "shortLink" && (
            <>
              {createShortLink ? (
                <div className=" py-2">
                  <div className=" flex items-center justify-between">
                    <span>
                      {createShortLinkProgress}% create Short Link
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${createShortLinkProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className=" text-sm">No Short Link is in progress.</p>
              )}
            </>
          )}

          {/* {progressTab === "create" && (
            <>
              {isUploading ? (
                <div className=" py-2">
                  <div className=" flex items-center justify-between">
                    <span>
                      {campaignLoader[campaignDetails.name]?.totalUpload}/
                      {campaignLoader[campaignDetails.name]?.totalFiles} files
                      uploaded
                    </span>
                    <span> {percentageUpload}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${percentageUpload}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className=" text-sm">No Create is in progress.</p>
              )}
            </>
          )} */}

          {/* {
            progressTab === "create" &&
            (
              <>
                {createDocumentsCampaignFilesStatus && campaignDetails.type === "mergeType" ? (<div className="py-2">
                  <div className="flex items-center justify-between">
                    <span>
                      {createDocumentsCampaignFilesProgress}% files downloaded
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${createDocumentsCampaignFilesProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>) :
                  <p className=" text-sm">No Create is in progress.</p>
                }
              </>
            )
          } */}

          {progressTab === "download" && (
            <>
              {downloadCampaignFileStatus ? (
                <div className=" py-2">
                  <div className=" flex items-center justify-between">
                    <span>
                      {downloadCampaignFileProgress}% files downloaded
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${downloadCampaignFileProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) :
                downloadDocumentCampaignFileStatus ? (<div className=" py-2">
                  <div className=" flex items-center justify-between">
                    <span>
                      {downloadDocumentCampaignFileProgress}% document files downloaded
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${downloadDocumentCampaignFileProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>)
                  :
                  (
                    <p className=" text-sm">No Download is in progress.</p>
                  )}
            </>
          )}

          {progressTab === "merge" && (
            <>
              {
                singlePdfCampaignFileStatus && campaignDetails.type === "pdfType" ? (
                  <div className="py-2">
                    <div className="flex items-center justify-between">
                      <span>
                        {singlePdfCampaignFileProgress}% single pdf files created
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full z-40"
                        style={{
                          width: `${singlePdfCampaignFileProgress}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ) :
                  samplePdfCampaignFilesStatus && campaignDetails.type === "mergeType" ? (
                    <div className="py-2">
                      <div className="flex items-center justify-between">
                        <span>
                          {samplePdfCampaignFilesProgress}% sample pdf files created
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full z-40"
                          style={{
                            width: `${samplePdfCampaignFilesProgress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ) :
                    createDocumentsCampaignFilesStatus && campaignDetails.type === "mergeType" ? (<div className="py-2">
                      <div className="flex items-center justify-between">
                        <span>
                          {createDocumentsCampaignFilesProgress}% documents created
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full z-40"
                          style={{
                            width: `${createDocumentsCampaignFilesProgress}%`,
                          }}
                        ></div>
                      </div>
                    </div>) :
                      (
                        <p className=" text-sm">No Merge is in progress.</p>
                      )
              }
              {/* {samplePdfCampaignFilesStatus && campaignDetails.type === "mergeType" ? (
                <div className="py-2">
                  <div className="flex items-center justify-between">
                    <span>
                      {samplePdfCampaignFilesProgress}% files created
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full z-40"
                      style={{
                        width: `${samplePdfCampaignFilesProgress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <p className=" text-sm">No Merge is in progress.</p>
              )} */}
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default Progress;
