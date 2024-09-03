import React from "react";
import { MdAccountBox, MdEmail, MdSms, MdWhatsapp } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import { useSelector } from "react-redux";

const StatsCard = ({ title, value, icon, iconClass="", textClass="" }) => {
  return (
    <>
      <div
        key={value}
        className="bg-white rounded-md cursor-pointer flex w-full items-center  px-4 py-1 shadow-lg "
      >
        <div className="flex items-center gap-y-2 gap-x-5">
          <div className={` w-fit h-fit p-2.5 rounded-full text-white text-xl ${iconClass}`}>
            {icon}
          </div>
          <div>
            <h1 className={`font-bold text-xl ${textClass}`}>{value}</h1>
            <h1 className=" font-medium text-[14px] font-poppins not-italic leading-normal">{title}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

const UserStats = () => {
  const { campaignDetails } = useSelector(
    (state) => state.campaigns
  );
  const data = [
    {
      title: "Total Documents",
      value: campaignDetails.totalFiles ? campaignDetails.totalFiles : 0,
      icon: <MdAccountBox size={"18px"} />,
      iconClass: "bg-[#0284c7]",
      textClass: "text-[#0284c7]",
    },
    {
      title: "Total SMS",
      value: campaignDetails.totalSms ? campaignDetails.totalSms : 0,
      icon: <MdSms size={"18px"} />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
    {
      title: "Total Email",
      value: campaignDetails.totalEmail ? campaignDetails.totalEmail : 0,
      icon: <MdEmail size={"18px"} />,
      iconClass: "bg-[#c026d3]",
      textClass: "text-[#c026d3]",
    },
    {
      title: "Total Whatsapp",
      value: campaignDetails.totalWhatsappSms
        ? campaignDetails.totalWhatsappSms
        : 0,
      icon: <MdWhatsapp size={"20px"} className="text-white" />,
      iconClass: "bg-green-500",
      textClass: "text-green-500",
    },
    {
      title: "Click Reports",
      value: campaignDetails.totalReports
        ? campaignDetails.totalReports
        : 0,
      icon: <FiFileText size={"19px"} className="text-white" />,
      iconClass: "bg-[#3b82f6]",
      textClass: "text-[#3b82f6]",
    },
  ];
  return (
    <div className=" grid sm:grid-cols-2 md:grid-cols-4 w-full lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6">
      {data?.map((item, index) => (
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

export default UserStats;
