
import React, { useEffect, useState } from "react";
// import Chart from 'react-apexcharts';

// icons
import { TbReload } from "react-icons/tb";

// components
import BlackButton from "../../../../common/Buttons/BlackButton.jsx"
import ReportCard from "./ReportCard.jsx";
import { BarElement, CategoryScale, Legend, Chart as ChartJS, LinearScale, Tooltip, ArcElement } from "chart.js"
import { useNavigate } from "react-router-dom";
import { xor } from "lodash";
import Charts from "../Charts.jsx";
import { getCampaignByNameThunkMiddleware, startCampaignTemplateThunkMiddleware } from "../../../../../redux/features/campaigns/index.js";
import { useDispatch, useSelector } from "react-redux";
import ConfirmMessage from "../../../../common/ConfirmMessage.jsx";
import { MdCancel, MdDeleteOutline } from "react-icons/md";
import { MdOutlineNotStarted } from "react-icons/md";
import { MdOutlineCampaign } from "react-icons/md";
import { number } from "yup";
import { IoIosCloudDone } from "react-icons/io";


// import ApexCharts from 'apexcharts';
// import Chart from 'react-apexcharts';

const ReportSection = ({ dataInCampaign,
    // countData
    // totalSent, totalSms, totalFailed, totalDelivered, totalInvalidNumber, campaignStartTime, campaignEndTime 
}) => {



    const { campaignDetails, campaignReports } = useSelector((state) => state.campaigns)
    useEffect(() => { }, [campaignDetails, campaignReports])



    // const { dummyCount } = useSelector((state) => state.campaigns);

    // console.log("count value in report section component ", dummyCount)

    const dispatch = useDispatch();

    // const DataArray = [dataInCampaign?.totalSms, dataInCampaign?.totalSent, dataInCampaign?.totalDelivered, 
    // dataInCampaign?.totalInvalidNumber, dataInCampaign?.totalFailed,];
    const colorArray = ["blue", "lightgreen", "green", "yellow", "red"];
    const titleArray = ["Total", "Sent", "Delivered", "Invalid Number", "Failed"];
    const [ShowStartConfirmMessage, setShowStartConfirmMessage] = useState(false);

    const [DataArray, SetDataArray] = useState([])

    // console.log("campaign details in all campaigns report section the original campaign details data", campaignDetails)
    // console.log("data sending inside the campaigns report section", dataInCampaign);
    // useEffect(() => { }, [dummyCount])
    // const [count, setCount] = useState(0)

    useEffect(() => {
        // original
        // SetDataArray([ dataInCampaign?.totalSms , dataInCampaign?.totalSent, dataInCampaign?.totalDelivered, dataInCampaign?.totalInvalidNumber, dataInCampaign?.totalFailed,])
        let totalSms = (dataInCampaign?.totalSms ? (typeof dataInCampaign?.totalSms === "string" ? Number.parseInt(dataInCampaign?.totalSms) : dataInCampaign?.totalSms) : 0);

        let totalSent = (dataInCampaign?.totalSent ? (typeof dataInCampaign?.totalSent === "string" ? Number.parseInt(dataInCampaign?.totalSent) : dataInCampaign?.totalSent) : 0);

        let totalDelivered = (dataInCampaign?.totalDelivered ? (typeof dataInCampaign?.totalDelivered === "string" ? Number.parseInt(dataInCampaign?.totalDelivered) : dataInCampaign?.totalDelivered) : 0);

        let totalFailed = (dataInCampaign?.totalFailed ? (typeof dataInCampaign?.totalFailed === "string" ? Number.parseInt(dataInCampaign?.totalFailed) : dataInCampaign?.totalFailed) : 0);

        let totalInvalidNumber = (dataInCampaign?.totalInvalidNumber ? (typeof dataInCampaign?.totalInvalidNumber === "string" ? Number.parseInt(dataInCampaign?.totalInvalidNumber) : dataInCampaign?.totalInvalidNumber) : 0);

        if (dataInCampaign?.type?.toLowerCase() === "email") {
            SetDataArray([
                // {
                //     number: totalSent,
                //     title: "Total",
                //     color: "blue",
                // }, 
                // {
                //     number : totalSent,
                //     title: "Sent",
                //     color: "lightgreen",  
                // },
                // {
                //     number: totalDelivered,
                //     title: "Delivered",
                //     color: "green",
                // },
                // {
                //     number: totalFailed,
                //     title: "Failed",
                //     color:  "red",
                // },
                {
                    number: dataInCampaign?.total,
                    title: "Total",
                    color: "blue",
                },
                {
                    number: dataInCampaign?.sent,
                    title: "Delivered",
                    color: "lightgreen",
                },
                // {
                //     number: dataInCampaign?.delivered,
                //     title: "Delivered",
                //     color: "green",
                // },
                {
                    // number: dataInCampaign?.failed,
                    number: (dataInCampaign?.softBounce + dataInCampaign?.hardBounce + dataInCampaign?.dropped),
                    title: "Failed",
                    color: "red",
                },
                {
                    number: dataInCampaign?.softBounce,
                    title: "Soft Bounce",
                    color: "yellow"
                },
                {
                    number: dataInCampaign?.hardBounce,
                    title: "Hard Bounce",
                    color: "pink",
                },
                {
                    number: dataInCampaign?.dropped,
                    title: "Dropped",
                    color: "purple"
                }
            ])
        } else {
            SetDataArray([
                {
                    number: totalSms,
                    title: "Total",
                    color: "blue",
                },
                {
                    number: totalSent,
                    title: "Sent",
                    color: "lightgreen",
                },
                {
                    number: totalDelivered,
                    title: "Delivered",
                    color: "green",
                },
                // {
                //     number: totalInvalidNumber,
                //     title: "Invalid Number",
                //     color: "yellow",
                // },
                {
                    number: totalFailed,
                    title: "Failed",
                    color: "red",
                },
            ])
            // SetDataArray([ dataInCampaign?.totalSms , dataInCampaign?.totalSent, dataInCampaign?.totalDelivered, dataInCampaign?.totalInvalidNumber, dataInCampaign?.totalFailed,])
        }
    }, [campaignDetails, campaignReports, dataInCampaign, dataInCampaign?.campaignStatus])

    // changes made by abhyanshu
    const sendStartCampaignHandler = () => {
        // try {
        if (dataInCampaign && dataInCampaign?.campaignStatus !== "completed") {
            dispatch(startCampaignTemplateThunkMiddleware({
                campaignData: dataInCampaign
                , campaignType: dataInCampaign.type, campaignUserName: campaignDetails.name
            }));
        }
    }

    // const handleSettingValue = () => {
    //     dispatch(settingCount({ count: count }))
    // }
    // console.log("total sms in report section" , typeof DataArray[0])

    return (
        <div className="flex flex-col justify-start items-start">
            <div className="flex justify-between items-start w-full">
                <div className="flex p-3 items-center">
                    {
                        ShowStartConfirmMessage ? <>
                            <ConfirmMessage yes="Yes, I am sure" deleteBtn="" saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
                                if (e) {
                                    sendStartCampaignHandler()
                                }
                                setShowStartConfirmMessage(false);
                            }}>
                                <MdOutlineCampaign size={"50px"} className="mb-3 text-slate-700" />
                                <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Start This Campaign?</h2>
                            </ConfirmMessage>
                        </> : null
                    }
                    {
                        dataInCampaign && dataInCampaign?.campaignStatus === "pending" ? (
                            <>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    if (dataInCampaign) {
                                        setShowStartConfirmMessage(true);
                                    }
                                }}
                                    className="bg-green-600 w-40 p-2 rounded-md text-white font-semibold"
                                >Send Campaign</button></>
                        ) :
                            ("")
                    }
                </div>
                {/* <button className="bg-gray-500 rounded-md text-lg font-semibold p-2 text-black" onClick={() => setCount(count => count + 1)}>+</button>
                <input className="bg-gray-100 rounded-md text-lg font-semibold p-2 text-black" type="number" value={count} disabled={true} />
                <button  className="bg-gray-500 rounded-md text-lg font-semibold p-2 text-black" onClick={() => setCount(count => count - 1)}>-</button>
                <button className="bg-green-500 rounded-md text-lg font-semibold p-2" onClick={handleSettingValue} >Send Count New Value</button>
                <input className="bg-gray-100 rounded-md text-lg font-semibold p-2 text-black" type="number" value={countData} disabled={true} /> */}

                {/* <div className="flex justify-end w-full p-3 items-center">
                    <BlackButton onClick={() => navigate(`/campaigns/campaigndetails/reports`)}>
                        <TbReload size={"22px"} />
                    </BlackButton>
                </div> */}
            </div>

            {
                dataInCampaign?.type?.toLowerCase() === "whatsapp" ? <>
                    <div className="w-full flex justify-between px-4 font-poppins font-medium not-italic leading-normal items-center gap-x-3">
                        <div className="flex justify-center gap-x-2 items-center">
                            <h2 className="text-[15px] font-semibold">Scheduled:</h2>
                            {
                                dataInCampaign?.scheduled ? <IoIosCloudDone size={26} className="text-green-700" />
                                    : <MdCancel size={23} className="text-red-700" />
                            }
                        </div>
                        <div className="flex justify-center gap-x-2 items-center">
                            <h2 className="text-[15px] font-semibold">Scheduled Time:</h2>
                            <h2 className="text-[15px]">{dataInCampaign?.scheduledTime}</h2>
                        </div>
                        <div className="flex justify-center gap-x-2 items-center">
                            <h2 className="text-[15px] font-semibold">Schedule Started:</h2>
                            {
                                dataInCampaign?.scheduleStarted ? <IoIosCloudDone size={26} className="text-green-700" />
                                    : <MdCancel size={23} className="text-red-700" />
                            }
                        </div>
                        {/* scheduled : Boolean, scheduledTime:String,   scheduleStarted: Boolean */}
                    </div>
                </> : null
            }

            <div className="w-full flex sm:flex-row flex-col px-2 sm:px-0 justify-center mt-3 mb-3 items-center">
                <div className="p-2 pl-4 pr-4 text-center w-full text-wrap m-2 font-semibold bg-green-200 rounded-md border-2 border-solid border-green-300 text-[14px]">Start On: {dataInCampaign?.campaignStartTime}</div>
                <div className="p-2 pl-4 pr-4 text-center w-full text-wrap m-2 font-semibold bg-green-200 rounded-md border-2 border-solid border-green-300 text-[14px]">Complete On: {dataInCampaign?.campaignEndTime}</div>
            </div>
            <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-x-3 px-2 gap-y-2">
                {/* original  */}
                {/* {DataArray && DataArray?.map((item, index) => {
                    return (
                        <ReportCard
                            key={index}
                            number={item}
                            color={colorArray[index]}
                            title={titleArray[index]}
                            total={DataArray[0]}
                            startTime={item?.campaignStartTime}
                            endTime={item?.campaignEndTime}
                        />
                    );
                })} */}
                {DataArray && DataArray?.map((item, index) => {
                    return (
                        <ReportCard
                            key={index}
                            number={item?.number}
                            color={item?.color}
                            title={item?.title}
                            total={DataArray[0]?.number}
                        // startTime={item?.campaignStartTime}
                        // endTime={item?.campaignEndTime}
                        />
                    );
                })}
            </div>

            <div className="flex md:flex-row flex-col w-full justify-center items-center rounded-md p-2">
                <Charts barDataArray={DataArray} />
            </div>
            <div className="w-full flex sm:flex-row flex-col px-2 sm:px-0 justify-center mt-3 mb-3 items-center">
                <div className="p-2 pl-4 pr-4 text-center w-full text-wrap m-2 font-semibold bg-green-200 rounded-md border-2 border-solid border-green-300 text-[14px]">Total Clicks:</div>
                <div className="p-2 pl-4 pr-4 text-center w-full text-wrap m-2 font-semibold bg-green-200 rounded-md border-2 border-solid border-green-300 text-[14px]">Reported Clicks:</div>
                <div className="p-2 pl-4 pr-4 text-center w-full text-wrap m-2 font-semibold bg-green-200 rounded-md border-2 border-solid border-green-300 text-[14px]">Unique Clicks:</div>
            </div>
        </div>
    )
}

export default ReportSection;
