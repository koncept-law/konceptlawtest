import React, { useEffect } from "react";
import { MdAccountBox, MdEmail, MdSms, MdWhatsapp } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { numberConvertion } from "../../../../functions/NumberConvertion";
import { totalDemographicsReportThunkMiddleware } from "../../../../redux/features/campaigns";

import { HiMiniDocumentDuplicate } from "react-icons/hi2";
import { HiDocumentPlus } from "react-icons/hi2";

const StatsCard = ({ title, value, icon, iconClass = "", textClass = "" }) => {
  return (
    <>
      <div
        key={value}
        className="bg-white rounded-md cursor-pointer flex w-full items-center px-2  xl:px-4 py-1 shadow-lg "
      >
        <div className="flex items-center gap-y-2 gap-x-3">
          <div className={` w-fit h-fit p-2 xl:p-2.5 rounded-full text-white text-xl ${iconClass}`}>
            {icon}
          </div>
          <div className="flex flex-row gap-x-2 gap-y-2 xl:flex-col justify-start items-center xl:justify-center xl:items-start">
            {/* <h1 className={`font-bold text-xl ${textClass}`}>{numberConvertion(value)}</h1> */}
            <h1 className={`font-bold text-xl ${textClass}`}>{value}</h1>
            <h1 className=" font-medium text-[12px] font-poppins not-italic leading-normal">{title}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

const Stats = ({ items = null }) => {
  const { campaignDetails, totalDemographicsReport } = useSelector(
    (state) => state.campaigns
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(totalDemographicsReportThunkMiddleware());
  }, []);

  // console.log("totalDemographicsReport", totalDemographicsReport);

  const data = [
    // {
    //   title: "Total Uploaded Documents",
    //   value: totalDemographicsReport?.totalUploadedDocuments ? numberConvertion(totalDemographicsReport?.totalUploadedDocuments) : 0,
    //   icon: <HiMiniDocumentDuplicate size={"20px"} />,
    //   iconClass: "bg-[#0284c7]",
    //   textClass: "text-[#0284c7]",
    // },
    {
      title: "Total Documents",
      value: totalDemographicsReport?.totalDocuments ? numberConvertion(totalDemographicsReport?.totalDocuments) : 0,
      icon: <HiMiniDocumentDuplicate size={"20px"} />,
      iconClass: "bg-[#0284c7]",
      textClass: "text-[#0284c7]",
    },
    {
      title: "Total Created Documents",
      value: totalDemographicsReport?.totalCreatedDocuments ? numberConvertion(totalDemographicsReport?.totalCreatedDocuments) : 0,
      icon: <HiDocumentPlus size={"20px"} />,
      iconClass: "bg-[#0284c7]",
      textClass: "text-[#0284c7]",
    },
    {
      title: "Total SMS",
      value: totalDemographicsReport?.totalSms ? numberConvertion(totalDemographicsReport?.totalSms) : 0,
      icon: <MdSms size={"20px"} />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
    {
      title: "Total Email",
      value: totalDemographicsReport?.totalEmail ? numberConvertion(totalDemographicsReport?.totalEmail) : 0,
      icon: <MdEmail size={"20px"} />,
      iconClass: "bg-[#c026d3]",
      textClass: "text-[#c026d3]",
    },
    {
      title: "Total Whatsapp",
      value: totalDemographicsReport?.totalWhatsapp
        ? numberConvertion(totalDemographicsReport?.totalWhatsapp)
        : 0,
      icon: <MdWhatsapp size={"21px"} className="text-white" />,
      iconClass: "bg-green-500",
      textClass: "text-green-500",
    },
    {
      title: "Click Reports",
      value: totalDemographicsReport?.totalClickReports
        ? numberConvertion(totalDemographicsReport?.totalClickReports)
        : 0,
      icon: <FiFileText size={"20px"} className="text-white" />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
  ];

  return (
    <div className={` grid sm:grid-cols-2 md:grid-cols-4 w-full lg:grid-cols-4 ${items?.length === 5 ? "xl:grid-cols-5" :
        items?.length === 6 ? "lg:grid-cols-3 xl:grid-cols-6" : items?.length === 8 ? "xl:grid-cols-8" :
          "xl:grid-cols-6"
      } gap-x-4 gap-y-6`}>
      {items ? items?.map((item, index) => (
        <StatsCard
          key={index}
          value={item.value}
          title={item.title}
          icon={item.icon}
          iconClass={item?.iconClass}
          textClass={item?.textClass}
        />
      )) : data?.map((item, index) => (
        <StatsCard
          key={index}
          value={item.value}
          title={item.title}
          icon={item.icon}
          iconClass={item?.iconClass}
          textClass={item?.textClass}
        />
      ))}
    </div>
  );
};

export default Stats;
