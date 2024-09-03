import React, { useMemo, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  createCampaignShortLinkThunkMiddleware,
  createMergeCampaignShortLinkThunkMiddleware,
  downloadCampaignFilesThunkMiddleware,
  downloadCampaignSinglePdfFileThunkMiddleware,
  downloadCampaignSinglePdfThunkMiddleware,
  downloadDocumentCampaignFilesThunkMiddleware,
} from "../../../../redux/features/campaigns";
import { useNavigate } from "react-router-dom";
import Text from "../../../../common/Texts/Text";
import { Button } from "@material-tailwind/react";

const Finalize = ({ campaignType }) => {
  // const dispatch = useDispatch();

  // const { campaignDetails } = useSelector(
  //   (state) => state.campaigns
  // );

  // const { downloadCampaignFileStatus } = useSelector((state) => state.progress);

  // const isFilePresent = useMemo(() => {
  //   return campaignDetails.pdfsUploaded && campaignDetails.pdfsUploaded !== "0"
  //     ? true
  //     : false;
  // }, [campaignDetails])

  // const isDownloadSinglePdfReady = useMemo(
  //   () => campaignDetails.isDownloadSinglePdfReady,
  //   [campaignDetails]
  // );

  // const isDataMappedCorrectly = useMemo(
  //   () => campaignDetails.isDataMappedCorrectly,
  //   [campaignDetails]
  // );

  // const createShortLinkHandler = () => {
  //   if (isDataMappedCorrectly) {
  //     dispatch(
  //       createCampaignShortLinkThunkMiddleware({
  //         campaignName: campaignDetails.name,
  //         // campaignType: campaignType,
  //       })
  //     );
  //   }
  // };

  // const createMergeShortLinkHandler = () => {
  //   // if (isDataMappedCorrectly) {
  //   dispatch(
  //     createMergeCampaignShortLinkThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //       // campaignType: campaignType,
  //     })
  //   );
  //   // }
  // };

  // const downloadFilesHandler = () => {
  //   if (isFilePresent && !downloadCampaignFileStatus) {
  //     dispatch(
  //       downloadCampaignFilesThunkMiddleware({
  //         campaignName: campaignDetails.name,
  //         campaignType: campaignType,
  //       })
  //     );
  //   }
  // };

  // const downloadDocxFilesHandler = () => {
  //   // if (isFilePresent && !downloadCampaignFileStatus) {
  //   dispatch(
  //     downloadDocumentCampaignFilesThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     })
  //   );
  //   // }
  //   // console.log("document Handler")
  // };

  // // const downloadSingleFileHandler = () => {
  // //   if (isDownloadSinglePdfReady) {
  // //     dispatch(
  // //       downloadCampaignSinglePdfThunkMiddleware({
  // //         campaignName: campaignDetails.name,
  // //         campaignType: campaignType,
  // //       })
  // //     );
  // //   }
  // // };

  // // const navigate = useNavigate();

  // const downloadSinglePdfFileHandler = () => {
  //   // if (isDownloadSinglePdfReady) {
  //   dispatch(
  //     downloadCampaignSinglePdfFileThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     })
  //   );
  // };

  const dispatch = useDispatch();

  const { campaignDetails, totalPdf } = useSelector(
    (state) => state.campaigns
  );

  const { downloadCampaignFileStatus } = useSelector((state) => state.progress);

  const isFilePresent = useMemo(() => {
    return campaignDetails.pdfsUploaded && campaignDetails.pdfsUploaded !== "0"
      ? true
      : false;
  }, [campaignDetails])

  const isDownloadSinglePdfReady = useMemo(
    () => campaignDetails.isDownloadSinglePdfReady,
    [campaignDetails]
  );

  const isDataMappedCorrectly = useMemo(
    () => campaignDetails.isDataMappedCorrectly,
    [campaignDetails]
  );

  const createShortLinkHandler = () => {
    if (isDataMappedCorrectly) {
      dispatch(
        createCampaignShortLinkThunkMiddleware({
          campaignName: campaignDetails.name,
          totalPdf,
          // campaignType: campaignType,
        })
      );
    }
  };

  const createMergeShortLinkHandler = () => {
    // if (isDataMappedCorrectly) {
    dispatch(
      createMergeCampaignShortLinkThunkMiddleware({
        campaignName: campaignDetails.name,
        // campaignType: campaignType,
      })
    );
    // }
  };

  const downloadFilesHandler = () => {
    if (isFilePresent && !downloadCampaignFileStatus) {
      dispatch(
        downloadCampaignFilesThunkMiddleware({
          campaignName: campaignDetails.name,
          campaignType: campaignType,
        })
      );
    }
  };

  const downloadDocxFilesHandler = () => {
    // if (isFilePresent && !downloadCampaignFileStatus) {
    dispatch(
      downloadDocumentCampaignFilesThunkMiddleware({
        campaignName: campaignDetails.name,
      })
    );
    // }
    // console.log("document Handler")
  };

  // const downloadSingleFileHandler = () => {
  //   if (isDownloadSinglePdfReady) {
  //     dispatch(
  //       downloadCampaignSinglePdfThunkMiddleware({
  //         campaignName: campaignDetails.name,
  //         campaignType: campaignType,
  //       })
  //     );
  //   }
  // };

  // const navigate = useNavigate();

  const downloadSinglePdfFileHandler = () => {
    // if (isDownloadSinglePdfReady) {
    dispatch(
      downloadCampaignSinglePdfFileThunkMiddleware({
        campaignName: campaignDetails.name,
      })
    );
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className=" grid grid-cols-2 sm:grid-cols-3 gap-2">
        {
          campaignType === "pdfType" &&
          (<div
            onClick={downloadFilesHandler}
            className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-300 overflow-hidden`}
          >
            <MdCloudUpload size={30} />
            <Text className=" text-[14px] text-center">
              Download All PDFS
            </Text>

            {(!isFilePresent || downloadCampaignFileStatus || !isDataMappedCorrectly) && (
              <>
                <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
              </>
            )}
          </div>)
        }

        {campaignType === "mergeType" && (<div
          onClick={downloadDocxFilesHandler}
          className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
        >
          <MdCloudUpload size={30} />
          <Text className="text-center text-[14px]">Download All Documents</Text>
          {/* <h1 className=" text-center font-semibold mt-auto">
            Download All Documents
          </h1> */}

          {/* {(!isFilePresent || downloadCampaignFileStatus) && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )} */}
        </div>)}

        {campaignType === "mergeType" && (<div
          // onClick={downloadSinglePdfFileHandler}
          onClick={isDownloadSinglePdfReady ? downloadSinglePdfFileHandler: ()=> {}}
          className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
        >
          <MdCloudUpload size={30} />
          {/* <h1 className=" text-center font-semibold mt-auto">
            Download Single PDF
          </h1> */}
          <Text className="text-center text-[14px]">Download Single PDF</Text>

          {!isDownloadSinglePdfReady && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )}
        </div>)}
        {campaignType === "pdfType" && (<Button
          onClick={createShortLinkHandler}
          className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
        >
          <MdCloudUpload size={30} />
          <Text className="text-center text-[14px]">Create ShortLink</Text>

          {!isDataMappedCorrectly && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )}
        </Button>)}

        {/* { campaignType === "mergeType" && (<Button
          onClick={createMergeShortLinkHandler}
          className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
        >
          <MdCloudUpload size={30} />
          <Text className="text-center text-[14px]">Create ShortLink</Text>

          {!isDataMappedCorrectly && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )}
        </Button>)} */}
      </div>
      <h2 className="h-[1px] bg-slate-300 w-full my-3"></h2>
      <h1 className=" font-bold text-lg text-center">Finalize</h1>
    </div>
  );
};

export default Finalize;
