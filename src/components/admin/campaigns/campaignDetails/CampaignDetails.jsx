import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";
import Stats from "./Stats";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { MdAccountBox, MdEmail, MdOutlineRemoveRedEye, MdSms, MdWhatsapp } from "react-icons/md";
import {
  getCampaignEmailTemplateThunkMiddleware,
  getCampaignSmsTemplateThunkMiddleware,
  getCampaignWhatsappTemplateThunkMiddleware,
  getCountInCampaignThunkMiddleware,
  getCurrentShortLinkThunkMiddleware,
  SelectedDocumentTemplateThunkMiddleware,
} from "../../../../redux/features/campaigns";
import Progress from "./Progress";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuMessageCircle } from "react-icons/lu";
import { CiFileOn } from "react-icons/ci";
import Prepare from "./Prepare";
import Process from "./Process";
import Finalize from "./Finalize";
import Reports from "./Reports";
import Text from "../../../../common/Texts/Text";

// icons
import { MdOutlineAttachEmail } from "react-icons/md";
import { Button } from "@material-tailwind/react";
import CampaignRoutes from "../../../../common/CampaignRoutes";
import { FiFileText } from "react-icons/fi";
import { IoIosCloudDone } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io5";
import StopWatch from "../../../../common/menu/StopWatch";

import { BiSolidMessageCheck } from "react-icons/bi";
import { MdMarkEmailRead } from "react-icons/md";
import { FaWhatsappSquare } from "react-icons/fa";
import { setLoader } from "../../../../redux/features/loaders";
import { setProgress } from "../../../../redux/features/progress";

const CampaignDetails = () => {

  // const { campaignDetails, selectedDocs } = useSelector(
  //   (state) => state.campaigns
  // );
  // const { user } = useSelector(state => state.user);
  // const permission = (user?.email === "hdfc" ? false: true);
  // const navigate = useNavigate();
  // const dispatch = useDispatch();


  // // console.log("campaign details ", campaignDetails);
  // // console.log("Selected Documents", selectedDocs);

  // useEffect(() => {
  //   dispatch(SelectedDocumentTemplateThunkMiddleware({ documents: null }));
  // }, []);

  // const isDataMappedCorrectly = useMemo(
  //   () => campaignDetails.isDataMappedCorrectly,
  //   [campaignDetails]
  // );

  // console.log("Campaign Details", campaignDetails);

  // const sendCampaignHandler = async () => {
  //   // if (isDataMappedCorrectly) {
  //   //   dispatch(
  //   //     getCampaignSmsTemplateThunkMiddleware(() => {
  //   //       navigate("sms");
  //   //     })
  //   //   );
  //   // }
  //   if(permission){
  //     dispatch(
  //       getCampaignSmsTemplateThunkMiddleware(() => {
  //         navigate("sms");
  //       })
  //     );
  //   }
  // };

  // const whatsappCampaignHandler = async () => {
  //   // if (isDataMappedCorrectly) {
  //   //   dispatch(
  //   //     getCampaignWhatsappTemplateThunkMiddleware(() => {
  //   //       navigate("whatsapp");
  //   //     })
  //   //   );
  //   // }
  //   if(permission){
  //     dispatch(
  //       getCampaignWhatsappTemplateThunkMiddleware(() => {
  //         navigate("whatsapp");
  //       })
  //     );
  //   }
  // };

  // const bulkEmailCampaignHandler = async () => {
  //   // if (isDataMappedCorrectly) {
  //   //   dispatch(
  //   //     getCampaignEmailTemplateThunkMiddleware(() => {
  //   //       navigate("bulkemail");
  //   //     })
  //   //   );
  //   // }
  //   if(permission){
  //     dispatch(
  //       getCampaignEmailTemplateThunkMiddleware(() => {
  //         navigate("bulkemail");
  //       })
  //     );
  //   }
  // };

  const { campaignDetails, selectedDocs, totalPdf, currentShortLink } = useSelector(
    (state) => state.campaigns
  );
  const currentShortLinkRef = useRef(currentShortLink); 

  const { loadShortLink } = useSelector(state => state.loaders);

  // console.log(campaignDetails);

  useEffect(() => {
    dispatch(SelectedDocumentTemplateThunkMiddleware(campaignDetails?.selectedDocumentArray));
    dispatch(getCountInCampaignThunkMiddleware(campaignDetails?.name));
    // dispatch(getCurrentShortLinkThunkMiddleware(campaignDetails?.name));
  }, [campaignDetails]);

  // console.log("campaign Details", campaignDetails)

  // console.log("campaign details ", campaignDetails)  
  // console.log("campaign doccument count ", campaignDocCount)
  // // const { singleUser } = useSelector((state)=>state.campaings)

  // // const isDownloadSinglePdfReady = useMemo(
  // //   () => campaignDetails.isDownloadSinglePdfReady,
  // //   [campaignDetails]
  // // );

  // // const { uploadCampaignFileStatus } = useSelector((state) => state.progress);

  // // const isExcelPresent = useMemo(
  // //   () => campaignDetails.isExcelPresent,
  // //   [campaignDetails]
  // // );

  // // const isExcelValidated = useMemo(
  // //   () => campaignDetails.isExcelValidated,
  // //   [campaignDetails]
  // // );

  // // const isFilePresent = useMemo(() => {
  // //   return campaignCount.noOfFiles && campaignCount.noOfFiles !== 0
  // //     ? true
  // //     : false;
  // // }, [campaignDetails]);

  const isDataMappedCorrectly = useMemo(
    () => campaignDetails.isDataMappedCorrectly,
    [campaignDetails]
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sendCampaignHandler = async () => {
    // if (isDataMappedCorrectly) {
    //   dispatch(
    //     getCampaignSmsTemplateThunkMiddleware(() => {
    //       // navigate("sms");
    //       navigate("/campaigns/sms/categories");
    //     })
    //   );
    // }
    dispatch(
      getCampaignSmsTemplateThunkMiddleware(() => {
        // navigate("sms");
        navigate("/campaigns/sms/categories");
      })
    );
  };

  const whatsappCampaignHandler = async () => {
    // if (isDataMappedCorrectly) {
    //   dispatch(
    //     getCampaignWhatsappTemplateThunkMiddleware(() => {
    //       navigate("whatsapp");
    //     })
    //   );
    // }
    dispatch(
      getCampaignWhatsappTemplateThunkMiddleware(() => {
        navigate("whatsapp");
      })
    );
  };

  const bulkEmailCampaignHandler = async () => {
    // if (isDataMappedCorrectly) {
    //   dispatch(
    //     getCampaignEmailTemplateThunkMiddleware(() => {
    //       navigate("bulkemail");
    //     })
    //   );
    // }
    // dispatch(
    //   getCampaignEmailTemplateThunkMiddleware(() => {
    //     navigate("/campaigns/campaigndetails/bulkemail");
    //   })
    // );
    navigate("/campaigns/campaigndetails/email/categories")
  };

  const data = [
    {
      title: "Total Documents",
      value: campaignDetails?.totalMainFilesUploaded !== 0 ? campaignDetails?.totalMainFilesUploaded : campaignDetails?.pdfsUploaded,
      icon: <MdAccountBox size={"15px"} />,
      iconClass: "bg-[#0284c7]",
      textClass: "text-[#0284c7] text-[13px]",
    },
    {
      title: "Total SMS",
      value: campaignDetails?.totalSms ? campaignDetails?.totalSms : 0,
      icon: <MdSms size={"15px"} />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
    {
      title: "Delivered SMS",
      value: campaignDetails?.totalSms ? campaignDetails?.totalSms : 0,
      icon: <BiSolidMessageCheck size={"15px"} />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
    {
      title: "Total Email",
      value: campaignDetails?.totalEmail ? campaignDetails?.totalEmail : 0,
      icon: <MdEmail size={"15px"} />,
      iconClass: "bg-[#c026d3]",
      textClass: "text-[#c026d3]",
    },
    {
      title: "Delivered Email",
      value: campaignDetails?.totalDeliveredEmail ? campaignDetails?.totalDeliveredEmail : 0,
      icon: <MdMarkEmailRead size={"15px"} />,
      iconClass: "bg-[#c026d3]",
      textClass: "text-[#c026d3]",
    },
    {
      title: "Total Whatsapp",
      value: campaignDetails?.totalWhatsappSms
        ? campaignDetails?.totalWhatsappSms
        : 0,
      icon: <MdWhatsapp size={"16px"} className="text-white" />,
      iconClass: "bg-green-500",
      textClass: "text-green-500",
    },
    {
      title: "Delivered Whatsapp",
      value: campaignDetails?.totalWhatsappSms
        ? campaignDetails?.totalWhatsappSms
        : 0,
      icon: <FaWhatsappSquare size={"16px"} className="text-white" />,
      iconClass: "bg-green-500",
      textClass: "text-green-500",
    },
    {
      title: "Click Reports",
      value: campaignDetails?.totalClicks
        ? campaignDetails?.totalClicks
        : 0,
      icon: <FiFileText size={"15px"} className="text-white" />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
  ];


  // console.log("current short link", currentShortLink)
  // const intervalRef = useRef(null); // Ref to store the interval ID
  // // console.log(loadShortLink);

  // if(parseInt(currentShortLink) >= parseInt(totalPdf)){
  //   clearInterval(intervalRef.current);
  //   intervalRef.current = null;
  //   dispatch(setProgress({ loadShortLink: false }));
  //   // console.log("stop");
  // }

  // const handleCreateShortLink = () => {
  //   if (loadShortLink) {
  //     // Clear any existing interval to avoid duplicates
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //     intervalRef.current = setInterval(() => {
  //       if (loadShortLink) {
  //         dispatch(getCurrentShortLinkThunkMiddleware(campaignDetails.name));
  //       } else {
  //         clearInterval(intervalRef.current);
  //         intervalRef.current = null;
  //       }
  //     }, 2000);
  //   } else {
  //     // Clear the interval if not loading
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   }
  // };

  // useEffect(() => {
  //   handleCreateShortLink();

  //   // Cleanup function to clear interval on unmount or when dependencies change
  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //       intervalRef.current = null;
  //     }
  //   };
  // }, [loadShortLink, currentShortLink]);

  return (
    <>
      <StopWatch />
      <div className="h-[93vh] flex flex-col w-full overflow-y-scroll">
        <div className="px-2 py-2 w-full flex gap-2 md:gap-4 flex-col">
          <Topbar path="/dashboard" message={
            <div className="flex justify-center items-center gap-x-1">
              {
                campaignDetails.type === "pdfType" && (
                  <div className="flex justify-center items-center gap-x-2 mx-2">
                    <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-[#000000]">Current ShortLink:</h2>
                    {/* <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-green-700">{currentShortLink ? currentShortLink : 0}</h2> */}
                    <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-green-700">{campaignDetails?.currentShortLinksCreated ? campaignDetails?.currentShortLinksCreated : 0}</h2>
                  </div>
                )
              }

              {
                campaignDetails.type === "pdfType" && (
                  <div className="flex justify-center items-center gap-x-2 mx-2">
                    <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-[#000000]">Current PDF:</h2>
                    <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-green-700">{totalPdf ? totalPdf : 0}</h2>
                  </div>
                )
              }

              {
                campaignDetails.type === "mergeType" && (
                  <div className="flex justify-center items-center gap-x-2 mx-2">
                    <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-[#000000]">Document Merged:</h2>
                    {
                      campaignDetails?.isMergingDone ? <IoIosCloudDone size={26} className="text-green-700" />
                        : <MdCancel size={23} className="text-red-700" />
                    }
                  </div>
                )
              }

              <div className="flex justify-center items-center gap-x-2 mx-2">
                <h2 className="not-italic leading-normal font-poppins font-semibold text-[13.5px] text-[#000000]">ShortLink:</h2>
                {
                  campaignDetails?.areShortLinksCreated ? <IoIosCloudDone size={26} className="text-green-700" />
                    : <MdCancel size={23} className="text-red-700" />
                }
              </div>
            </div>
          } />
          <div className="py-1 w-full space-y-4">
            <div className="w-full">
              <Stats items={data} />
            </div>

            {/* changes made by abhyanshu */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
              <div className="bg-white p-4 rounded-md border border-solid border-slate-200 w-full">
                <Prepare campaignType={campaignDetails?.type} />
              </div>

              {campaignDetails.type === "mergeType" && (
                <div className="bg-white p-4 rounded-md w-full border border-solid border-slate-200 lg:col-span-1">
                  <Process campaignType={campaignDetails?.type} />
                </div>
              )}

              <div className="bg-white p-4 sm:px-8 sm:py-5 flex flex-col border border-solid border-slate-200 justify-between h-auto items-center rounded-md w-full">
                <div className="gap-4 grid w-full h-1/2 grid-cols-3">
                  <Button
                    className="relative flex-col items-center justify-center h-full gap-3 flex bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md hover:bg-slate-800 text-[#000000] capitalize not-italic leading-normal hover:text-white transition-all duration-200 w-full"
                    onClick={bulkEmailCampaignHandler}
                  >
                    <MdOutlineAttachEmail size={30} />
                    <Text className="text-center text-[14px]">Email</Text>
                    {/* {(!isDataMappedCorrectly) && (
                      <>
                        <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
                      </>
                    )} */}
                    {/* {!permission && (
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
                    )} */}
                  </Button>

                  <Button
                    className="relative flex-col items-center justify-center gap-3 flex bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md hover:bg-slate-800 text-[#000000] capitalize not-italic leading-normal hover:text-white transition-all duration-200 w-full"
                    onClick={sendCampaignHandler}
                  >
                    <BiMessageRoundedDetail size={30} />
                    <Text className="text-center text-[14px]">SMS</Text>
                    {/* {(!isDataMappedCorrectly) && (
                      <>
                        <div className=" absolute top-0 left-0 bg-gray-100 w-full rounded-md h-full bg-opacity-80"></div>
                      </>
                    )} */}
                    {/* {!permission && (
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
                    )} */}
                  </Button>

                  <Button
                    className="relative flex-col items-center justify-center gap-3 flex bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md hover:bg-slate-800 hover:text-white text-[#000000] capitalize not-italic leading-normal transition-all duration-300 w-full"
                    onClick={whatsappCampaignHandler}
                  >
                    {/* <MdOutlineRemoveRedEye size={30} /> */}
                    <IoLogoWhatsapp size={30} />
                    <Text className="text-center text-[14px]">Whatsapp</Text>
                    {/* {(!isDataMappedCorrectly) && (
                      <>
                        <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
                      </>
                    )} */}
                    {/* {!permission && (
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full rounded-md bg-opacity-80"></div>
                    )} */}
                  </Button>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                  <h2 className="h-[1px] bg-slate-300 w-full my-2"></h2>
                  <h1 className=" font-bold text-lg text-center">Campaign</h1>
                </div>
              </div>

              <div className="bg-white p-4 w-full border border-solid border-slate-200 rounded-md">
                <Finalize campaignType={campaignDetails?.type} />
              </div>

              <div className="bg-white p-4 w-full border border-solid border-slate-200 rounded-md">
                <Reports campaignType={campaignDetails?.type} />
              </div>
            </div>

          </div>
        </div>
        {
          campaignDetails.type === "mergeType" && (
            selectedDocs ? <>
              <CampaignRoutes documentTemplateFiles={selectedDocs} />
            </> : null
          )
        }
      </div>
      {
        campaignDetails.type !== "mergeType" && (
          <Progress campaignType={campaignDetails.type} />
        )
      }
      <Progress campaignType={campaignDetails.type} />
      {/* <ProgressUpdateChecking/> */}
    </>
  );
};



export default CampaignDetails;


// const TopScreenButton = ({ children, select = false, onClick = function () { } }) => {
//   return <button className={"p-2 bg-white flex justify-center transition-all items-center" + (select ? ` rounded-t-md border-2 border-solid border-blue-600` : null)} onClick={onClick}>{children}</button>
// }