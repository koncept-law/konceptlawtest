import React, { useEffect, useMemo, useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createCampaignShortLinkThunkMiddleware, createDocumentsThunkMiddleware, createMergeCampaignShortLinkThunkMiddleware, deleteCreatedDocumentsFilesThunkMiddleware, deleteSamplePdfsFilesThunkMiddleware, getAvailableServersReportThunkMiddleware, getPdfShortLinksProgressThunkMiddleware, setCampaigns, startSamplePdfThunkMiddleware, startSingleCampaignPdfTemplateThunkMiddleware } from "../../../../redux/features/campaigns";
import { IoReloadCircle } from "react-icons/io5";
import Text from "../../../../common/Texts/Text";
import { Button } from "@material-tailwind/react";
import CreateDocumentModal from "../../../../common/modals/CreateDocumentModal";
import DeleteModal from "../../../../common/modals/DeleteModal";
import { setProgress } from "../../../../redux/features/progress";
const Process = ({ campaignType }) => {
  // const dispatch = useDispatch();
  // const { campaignDetails } = useSelector((state) => state.campaigns);

  // const isDownloadSinglePdfReady = useMemo(
  //   () => campaignDetails.isDownloadSinglePdfReady,
  //   [campaignDetails]
  // );

  // const isSamplePdfsFilesPresent = useMemo(() => {
  //   return campaignDetails.progressSampleMerging && (Number.parseInt(campaignDetails.progressSampleMerging) !== 0) ? true : false
  // }, [campaignDetails]);


  // const isCreateDocumentFilesPresent = useMemo(() => {
  //   return campaignDetails.progressMainMerging && (Number.parseInt(campaignDetails.progressMainMerging) !== 0) ? true : false
  // }, [campaignDetails]);
  // // console.log("is sample pdfs uploaded ", isSamplePdfsFilesPresent);
  // // console.log("is sample pdfs uploaded ", Number.parseInt(campaignDetails.progressSampleMerging) !== 0);
  // // console.log("is sample pdfs uploaded ", campaignDetails.progressSampleMerging !== null);


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

  // const isDataMappedCorrectly = useMemo(
  //   () => campaignDetails.isDataMappedCorrectly,
  //   [campaignDetails]
  // );

  // const startSinglePdfHandler = () => {
  //   // if (!isDownloadSinglePdfReady)
  //   dispatch(
  //     startSingleCampaignPdfTemplateThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //       campaignType: campaignType,
  //     })
  //   );
  // };

  // const startSamplePdfHandler = () => {
  //   if (!isSamplePdfsFilesPresent || isDataMappedCorrectly) {
  //     dispatch(
  //       startSamplePdfThunkMiddleware({ campaignName: campaignDetails.name, campaignType: campaignType })
  //     )
  //   }
  // }

  // const createDocumentsHandler = () => {
  //   if (!isDownloadSinglePdfReady)
  //   dispatch(
  //     createDocumentsThunkMiddleware({
  //       campaignName: campaignDetails.name,
  //     })
  //   );
  //   // console.log("create single pdf")
  // };

  // const deleteSamplePdfsFilesHandler = () => {
  //   if (!isSamplePdfsFilesPresent) {
  //     dispatch(deleteSamplePdfsFilesThunkMiddleware({ campaignName: campaignDetails.name }))
  //   }
  // }

  // const deleteDocumentFilesHandler = () => {
  //   if (!isCreateDocumentFilesPresent) {
  //     dispatch(deleteCreatedDocumentsFilesThunkMiddleware({ campaignName: campaignDetails.name }))
  //   }
  // }

  const dispatch = useDispatch();
  const { campaignDetails, serverNames } = useSelector((state) => state.campaigns);
  const { createShortLink } = useSelector((state) => state.progress);
  // console.log("server Name", serverNames);

  const [documentModal, setDocumentModal] = useState(false);
  const [DeleteModalONPdf, setDeleteModalONPdf] = useState(false);
  const [DeleteModalONDocument, setDeleteModalONDocument] = useState(false);

  const isDownloadSinglePdfReady = useMemo(
    () => campaignDetails.isDownloadSinglePdfReady,
    [campaignDetails]
  );

  const isSamplePdfsFilesPresent = useMemo(() => {
    return campaignDetails.progressSampleMerging && (Number.parseInt(campaignDetails.progressSampleMerging) !== 0) ? true : false
  }, [campaignDetails]);

  const totalSampleFilesUploaded = useMemo(() => {
    return campaignDetails.totalSampleFilesUploaded && (campaignDetails.totalSampleFilesUploaded !== 0 ? true : false);
  }, [campaignDetails]);

  const totalMainFilesUploaded = useMemo(() => {
    return campaignDetails.totalMainFilesUploaded && (campaignDetails.totalMainFilesUploaded !== 0 ? true : false);
  }, [campaignDetails]);

  const isCreateDocumentFilesPresent = useMemo(() => {
    return campaignDetails.progressMainMerging && (Number.parseInt(campaignDetails.progressMainMerging) !== 0) ? true : false
  }, [campaignDetails]);
  // console.log("is sample pdfs uploaded ", isSamplePdfsFilesPresent);
  // console.log("is sample pdfs uploaded ", Number.parseInt(campaignDetails.progressSampleMerging) !== 0);
  // console.log("is sample pdfs uploaded ", campaignDetails.progressSampleMerging !== null);


  // const { uploadCampaignFileStatus } = useSelector((state) => state.progress);

  // const isExcelPresent = useMemo(
  //   () => campaignDetails.isExcelPresent,
  //   [campaignDetails]
  // );

  // const isExcelValidated = useMemo(
  //   () => campaignDetails.isExcelValidated,
  //   [campaignDetails]
  // );

  // const isFilePresent = useMemo(() => {
  //   return campaignCount.noOfFiles && campaignCount.noOfFiles !== 0
  //     ? true
  //     : false;
  // }, [campaignDetails]);

  const isDataMappedCorrectly = useMemo(
    () => campaignDetails.isDataMappedCorrectly,
    [campaignDetails]
  );

  const startSinglePdfHandler = () => {
    // if (!isDownloadSinglePdfReady)
    dispatch(
      startSingleCampaignPdfTemplateThunkMiddleware({
        campaignName: campaignDetails.name,
        campaignType: campaignType,
      })
    );
  };

  const startSamplePdfHandler = () => {
    if (!isSamplePdfsFilesPresent || isDataMappedCorrectly) {
      dispatch(
        startSamplePdfThunkMiddleware({ campaignName: campaignDetails.name, campaignType: campaignType })
      )
    }
  }

  const createDocumentsHandler = (data) => {
    // console.log(data);
    let serverNames = data?.serverNames?.map((item) => (JSON.parse(item)));
    // console.log(serverNames);
    // if (!isDownloadSinglePdfReady)
    dispatch(
      createDocumentsThunkMiddleware({
        campaignName: campaignDetails.name,
        serverNames: serverNames,
      })
    );
    setDocumentModal(false);
    // console.log("create single pdf")
  };

  const deleteSamplePdfsFilesHandler = () => {
    // if (isSamplePdfsFilesPresent) {
    //   dispatch(deleteSamplePdfsFilesThunkMiddleware({ campaignName: campaignDetails.name }))
    // }
    dispatch(deleteSamplePdfsFilesThunkMiddleware({ campaignName: campaignDetails.name }))

  }

  const deleteDocumentFilesHandler = () => {
    // if (isCreateDocumentFilesPresent) {
    //   dispatch(deleteCreatedDocumentsFilesThunkMiddleware({ campaignName: campaignDetails.name }))
    // }
    dispatch(deleteCreatedDocumentsFilesThunkMiddleware({ campaignName: campaignDetails.name }))
  }

  const createShortLinkHandler = () => {
    if (isDataMappedCorrectly) {
      dispatch(setCampaigns({ currentShortLink: 0 }));
      dispatch(
        createCampaignShortLinkThunkMiddleware({
          campaignName: campaignDetails.name,
          // campaignType: campaignType,
        })
      );
    }
  };

  const createMergeShortLinkHandler = () => {
    // if (isDataMappedCorrectly) {
    if (!createShortLink) {
      dispatch(setProgress({ createShortLink: true, createShortLinkProgress: 0, progressTab: "shortLink", progressView: true }));
    }

    dispatch(
      createMergeCampaignShortLinkThunkMiddleware({
        campaignName: campaignDetails.name,
        // campaignType: campaignType,
      })
    );
    // }
  };

  const intervalRef = useRef(null); // Ref to store the interval ID

  const handleCreateShortLink = () => {
    if (createShortLink) {
      // Clear any existing interval to avoid duplicates
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        if (createShortLink) {
          dispatch(getPdfShortLinksProgressThunkMiddleware(campaignDetails, campaignType));
        } else {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }, 2000);
    } else {
      // Clear the interval if not loading
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    handleCreateShortLink();

    // Cleanup function to clear interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [createShortLink]);

  // useEffect(()=> {
  //   dispatch(getAvailableServersReportThunkMiddleware());
  // }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      <CreateDocumentModal data={serverNames} open={documentModal} setOpen={setDocumentModal} submit={!isDataMappedCorrectly || totalMainFilesUploaded ? () => { } : (e) => createDocumentsHandler(e)} />

      <DeleteModal open={DeleteModalONPdf} setOpen={setDeleteModalONPdf} title="You want to reset the Start Sample Pdfs data?" deleteEvent={(event) => {
        if (event && !isDataMappedCorrectly || totalSampleFilesUploaded) {
          deleteSamplePdfsFilesHandler();
        }
      }} />

      <DeleteModal open={DeleteModalONDocument} setOpen={setDeleteModalONDocument} title="You want to reset the Document data?" deleteEvent={(event) => {
        if (event && !isDataMappedCorrectly || totalMainFilesUploaded) {
          // deleteSamplePdfsFilesHandler();
          deleteDocumentFilesHandler();
        }
      }} />

      <div className=" grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-3 gap-2">
        {/* {
          campaignType === "pdfType" &&
          (
            <>
              <div
                onClick={startSinglePdfHandler}
                className={`relative flex items-center justify-center flex-col gap-3 bg-blue-100 px-3 py-4 cursor-pointer border border-gray-700 rounded-3xl group hover:scale-105 transition-all duration-300 overflow-hidden`}
              >
                <MdCloudUpload size={32} />
                <h1 className=" text-center font-semibold mt-auto">
                  Start Single Pdf Excel
                </h1>

                {isDownloadSinglePdfReady && (
                  <>
                    <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                  </>
                )}
              </div>
            </>
          )
        } */}

        {
          campaignType === "mergeType" &&
          (
            <>
              <div
                // onClick={!isDataMappedCorrectly || isSamplePdfsFilesPresent ? () => { } : startSamplePdfHandler}
                onClick={!isDataMappedCorrectly || totalSampleFilesUploaded ? () => { } : startSamplePdfHandler}
                className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
              >
                <MdCloudUpload size={30} />
                {/* <h1 className=" text-center font-semibold mt-auto">
                  Start Sample PDFs
                </h1> */}
                <Text className="text-center text-[14px]">Start Sample PDFs</Text>
                {/* {(!isSamplePdfsFilesPresent) && (  
                      <>
                        {isSamplePdfsFilesPresent && ( */}
                {/* <div className="absolute top-2 right-2 z-20">
                  <figure
                    className={`text-red-600 font-bold  -translate-y-10 transition-all duration-300 group-hover:translate-y-0`}
                    onClick={deleteSamplePdfsFilesHandler}
                  >
                    <IoReloadCircle size={30} />
                  </figure>
                </div> */}
                {/* {
                  (!isDataMappedCorrectly || isSamplePdfsFilesPresent) && (
                    <>
                      {
                        isSamplePdfsFilesPresent && (
                          <div className="absolute top-2 right-2 z-20">
                            <figure
                              className={`text-red-600 font-bold  -translate-y-10 transition-all duration-300 group-hover:translate-y-0`}
                              onClick={deleteSamplePdfsFilesHandler}
                            >
                              <IoReloadCircle size={30} />
                            </figure>
                          </div>
                        )
                      }
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                    </>
                  )
                } */}
                {
                  !isDataMappedCorrectly || totalSampleFilesUploaded ? (
                    <>
                      {
                        !isDataMappedCorrectly || totalSampleFilesUploaded && (
                          <div className="absolute top-2 right-2 z-20">
                            <figure
                              className={`text-red-600 font-bold  -translate-y-10 transition-all duration-300 group-hover:translate-y-0`}
                              // onClick={deleteSamplePdfsFilesHandler}
                              onClick={() => setDeleteModalONPdf(true)}
                            >
                              <IoReloadCircle size={30} />
                            </figure>
                          </div>
                        )
                      }
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                    </>
                  ) : null
                }
                {/* {
                  (isSamplePdfsFilesPresent)
                } */}
                {/* )}
                        <div className="absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                      </>
                    )} */}

                {/* {isDownloadSinglePdfReady && (
                  <>
                    <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                  </>
                )} */}
              </div>
              {/* <button className="bg-red-500 p-4 rounded-2xl" onClick={deleteSamplePdfsFilesHandler} >Delete Pdfs</button> */}
              <div
                // onClick={createDocumentsHandler}
                // onClick={!isDataMappedCorrectly || isCreateDocumentFilesPresent ? () => { } : createDocumentsHandler}
                // onClick={!isDataMappedCorrectly || totalMainFilesUploaded ? () => { } : createDocumentsHandler}
                onClick={!isDataMappedCorrectly || totalMainFilesUploaded ? () => { } : () => setDocumentModal(true)}
                // onClick={()=> setDocumentModal(true)}
                className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
              >
                <MdCloudUpload size={30} />
                {/* <h1 className=" text-center font-semibold mt-auto">
                  Create Documents
                </h1> */}
                <Text className="text-center text-[14px]">Create Documents</Text>
                {/* <div className="absolute top-2 right-2 z-20">
                  <figure
                    className={`text-red-600 font-bold  -translate-y-10 transition-all duration-300 group-hover:translate-y-0`}
                    onClick={deleteDocumentFilesHandler}
                  >
                    <IoReloadCircle size={30} />
                  </figure>
                </div> */}
                {/* {
                  (!isDataMappedCorrectly || isCreateDocumentFilesPresent) && (
                    <>
                      {
                        isCreateDocumentFilesPresent && (
                          <div className="absolute top-2 right-2 z-20">
                            <figure
                              className={`text-red-600 font-bold  -translate-y-10 transition-all duration-300 group-hover:translate-y-0`}
                              onClick={deleteDocumentFilesHandler}
                            >
                              <IoReloadCircle size={30} />
                            </figure>
                          </div>
                        )
                      }
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                    </>
                  )
                } */}
                {
                  !isDataMappedCorrectly || totalMainFilesUploaded ? (
                    <>
                      {
                        !isDataMappedCorrectly || totalMainFilesUploaded && (
                          <div className="absolute top-2 right-2 z-20">
                            <figure
                              className={`text-red-600 font-bold  -translate-y-10 transition-all duration-300 group-hover:translate-y-0`}
                              // onClick={deleteDocumentFilesHandler}
                              onClick={() => setDeleteModalONDocument(true)}
                            >
                              <IoReloadCircle size={30} />
                            </figure>
                          </div>
                        )
                      }
                      <div className="absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                    </>
                  ) : null
                }
                {/* {isDownloadSinglePdfReady && (
                  <>
                    <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                  </>
                )} */}
              </div>
              {campaignType === "pdfType" && (<Button
                onClick={!isDataMappedCorrectly ? () => { } : createShortLinkHandler}
                // onClick={createShortLinkHandler}
                className={`relative flex items-center w-full justify-between flex-col gap-3 bg-blue-100 px-3 py-2 cursor-pointer border border-gray-700 rounded-md group transition-all duration-200 hover:bg-slate-800 hover:text-[#FFFF] capitalize text-[#000] overflow-hidden`}
              >
                <MdCloudUpload size={30} />
                {/* <h1 className=" text-center font-semibold mt-auto">
            Create ShortLink
          </h1> */}
                <Text className="text-center text-[14px]">Create ShortLink</Text>

                {!isDataMappedCorrectly && (
                  <>
                    <div className=" absolute top-0 left-0 bg-gray-100 w-full h-full bg-opacity-80"></div>
                  </>
                )}
              </Button>)}

              {campaignType === "mergeType" && (<Button
                onClick={!isDataMappedCorrectly ? () => { } : createMergeShortLinkHandler}
                // onClick={createMergeShortLinkHandler}
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
            </>
          )
        }
      </div>
      <h2 className="h-[1px] bg-slate-300 w-full my-3"></h2>
      <h1 className=" font-bold text-lg text-center">Process</h1>
    </div>
  );
};

export default Process;
