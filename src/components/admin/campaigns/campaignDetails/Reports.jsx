import React, { useMemo } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadCampaignModifyExcelThunkMiddleware,
  getAllCampaignReportsThunkMiddleware,
  getCampaignByNameThunkMiddleware,
  viewCampaignDocumentThunkMiddleware,
} from "../../../../redux/features/campaigns";
import { Link, useNavigate } from "react-router-dom";
import Text from "../../../../common/Texts/Text";

const Reports = ({ campaignType }) => {

  // const { campaignDetails } = useSelector(
  //   (state) => state.campaigns
  // );

  // const isDownloadSinglePdfReady = useMemo(
  //   () => campaignDetails.isDownloadSinglePdfReady,
  //   [campaignDetails]
  // );

  // const { uploadCampaignFileStatus, downloadCampaignFileStatus } = useSelector((state) => state.progress);

  // const isExcelPresent = useMemo(
  //   () => campaignDetails.isExcelPresent,
  //   [campaignDetails]
  // );

  // const isExcelValidated = useMemo(
  //   () => campaignDetails.isExcelValidated,
  //   [campaignDetails]
  // );

  // const isFilePresent = useMemo(() => {
  //   return campaignDetails.pdfsUploaded && campaignDetails.pdfsUploaded !== "0"
  //     ? true
  //     : false;
  // }, [campaignDetails])

  // const isDataMappedCorrectly = useMemo(
  //   () => campaignDetails.isDataMappedCorrectly,
  //   [campaignDetails]
  // );

  // const dispatch = useDispatch();
  // const navigate = useNavigate()

  // const downloadModifyExcelHandler = () => {
  //   if (isExcelPresent) {
  //   dispatch(
  //     downloadCampaignModifyExcelThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     })
  //   );
  //   }
  // };

  // // const viewDocumentHandler = () => {
  // //   dispatch(
  // //     viewCampaignDocumentThunkMiddleware({
  // //       campaignName: campaignDetails.name,
  // //     })
  // //   );
  // // };

  // const viewAllCampaignReportsHanlder = () => {
  //   // if (isDataMappedCorrectly) {

  //   dispatch(
  //     getAllCampaignReportsThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     }, () => {
  //       navigate("/campaigns/campaigndetails/reports")
  //     })
  //   );
  //   // }
  //   navigate("/campaigns/campaigndetails/reports")
  //   // navigate("/campaigns/campaigndetails/reports");
  // };

  // const downloadByCategory = () => {
  //   // console.log("download documents by category")
  //   dispatch(
  //     getCampaignByNameThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     }, () => {
  //       navigate("/campaigns/documentscategorydownload")
  //     })
  //   );
  // }

  const { campaignDetails } = useSelector(
    (state) => state.campaigns
  );

  const isDownloadSinglePdfReady = useMemo(
    () => campaignDetails.isDownloadSinglePdfReady,
    [campaignDetails]
  );

  const { uploadCampaignFileStatus, downloadCampaignFileStatus } = useSelector((state) => state.progress);

  const isExcelPresent = useMemo(
    () => campaignDetails.isExcelPresent,
    [campaignDetails]
  );

  const isExcelValidated = useMemo(
    () => campaignDetails.isExcelValidated,
    [campaignDetails]
  );

  const isFilePresent = useMemo(() => {
    return campaignDetails.pdfsUploaded && campaignDetails.pdfsUploaded !== "0"
      ? true
      : false;
  }, [campaignDetails])

  const isDataMappedCorrectly = useMemo(
    () => campaignDetails.isDataMappedCorrectly,
    [campaignDetails]
  );

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const downloadModifyExcelHandler = () => {
    if (isExcelPresent) {
      dispatch(
        downloadCampaignModifyExcelThunkMiddleware({
          campaignName: campaignDetails.name,
        })
      );
    }
  };

  // const viewDocumentHandler = () => {
  //   dispatch(
  //     viewCampaignDocumentThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     })
  //   );
  // };

  const viewAllCampaignReportsHanlder = () => {
    // if (isDataMappedCorrectly) {

    // dispatch(
    //   getAllCampaignReportsThunkMiddleware({
    //     campaignName: campaignDetails.name,
    //   }, () => {
    //     navigate("/campaigns/campaigndetails/reports")
    //   })
    // );
    // }
    navigate("/campaigns/campaigndetails/reports")
    // navigate("/campaigns/campaigndetails/reports");
  };

  const downloadByCategory = () => {
    // console.log("download documents by category")
    if (isDataMappedCorrectly) {
      dispatch(
        getCampaignByNameThunkMiddleware({
          campaignName: campaignDetails.name,
        }, () => {
          navigate("/campaigns/documentscategorydownload")
        })
      );
    }
  }


  return (
    <div className="flex flex-col justify-between">
      <div className=" grid grid-cols-2 sm:grid-cols-3 gap-2">
        <div
          onClick={downloadModifyExcelHandler}
          className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-1 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
        >
          <MdCloudUpload size={30} />
          {/* <h1 className=" text-center font-semibold mt-auto">
            Download Modify Excel
          </h1> */}
          <Text className="text-center text-[14px]">Download Reports</Text>
          {/* original condition */}
          {(!isExcelPresent || downloadCampaignFileStatus) && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )}
          {/* {(!isDataMappedCorrectly) && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )} */}
          {/* // changes made by abhyanshu */}
          {/* {!isDownloadSinglePdfReady && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
            </>
          )} */}
        </div>
        <div
          onClick={viewAllCampaignReportsHanlder}
          className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-1 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
        >
          <MdCloudUpload size={30} />
          {/* <h1 className=" text-center font-semibold mt-auto">All Campaign Report</h1> */}
          <Text className="text-center text-[14px]">All Campaign Report</Text>
          {/* {(!isDataMappedCorrectly) && (
            <>
              <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
            </>
          )} */}
        </div>
        {
          campaignType === "mergeType" && (<div
            onClick={downloadByCategory}
            className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-1 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
          >
            <MdCloudUpload size={30} />
            {/* <h1 className=" text-center font-semibold mt-auto">Download All Category Documents</h1> */}
            <Text className="text-center text-[13px]">Download All Category Documents</Text>
            {(!isDataMappedCorrectly) && (
              <>
                <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
              </>
            )}
          </div>)}
      </div>
      <h2 className="h-[1px] bg-slate-300 w-full my-2"></h2>
      <h1 className=" font-bold text-lg text-center">Reports</h1>
    </div>
  );
};

export default Reports;
