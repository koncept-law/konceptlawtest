import React, { useEffect, useState } from 'react'
import CampaignsCard from './CampaignsCard';
import InsideCampaignTable from './InsideCampaignTable';
import { MdOutlineWhatsapp } from "react-icons/md";
import { FcSms } from "react-icons/fc";
// import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getCampaignByNameThunkMiddleware } from '../../../../redux/features/campaigns';
// import { getCampaignByNameThunkMiddleware } from '../../../../redux/features/campaigns';

const AllCampaignsSidebar = ({ data, refreshData, countData }) => {
    const dispatch = useDispatch();
    const { campaignDetails, campaignReports } = useSelector((state) => state.campaigns)
    // const { dummyCount } = useSelector((state) => state.campaigns)

    const [toggleTab, setToggleTab] = useState("all-campaigns");
    const [sortedData, setSortedData] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    // const [someData , setSomeData] = useState(null)


    // useEffect(() => {
    //     dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails.name }))
    // }, [dispatch]);

    useEffect(() => {
        // if (data) refreshData();
        // refreshData()

    }, [data,
        // selectedCampaign
        // refreshData
        campaignDetails,
        selectedCampaign,
        campaignReports,
        // dummyCount
        // sortedData,
        // selectedCampaign,
        // selectedCampaign?.campaignStatus
    ]);


    useEffect(() => {
        if (!campaignReports || campaignReports === null) return;

        // let whatsappCampaignData = [...data.insideWhatsAppCampaign];
        // let smsCampaignData = [...data.insideSmsCampaigns];
        let whatsappCampaignData = campaignReports[0]?.insideWhatsappCampaign;
        let smsCampaignData = campaignReports[0]?.insideSmsCampaigns;
        let insideEmailCampaign = campaignReports?.length ? (campaignReports[0]?.insideEmailCampaign) : [];
        let insideEmailCampaignwebhook = campaignReports?.length ? (campaignReports[0]?.insideEmailCampaignwebhook) : [];
        // console.log("insideEmailCampaignwebhook", insideEmailCampaignwebhook)

        // console.log("whatsappCampaignData", whatsappCampaignData)
        // console.log("smsCampaignData", smsCampaignData);
        console.log("insideEmailCampaign", insideEmailCampaign);
        // console.log("insideEmailCampaignwebhook", insideEmailCampaignwebhook)

        // let
        // console.log("working...")
        let allData = [];
        let allSortedData = [];
        try {
            allData = smsCampaignData.concat(whatsappCampaignData).concat(insideEmailCampaign);
            allSortedData = allData?.sort((a, b) => new Date(a?.date) - new Date(b?.date)).reverse();
        } catch (err) { }

        // console.log(allData)

        if (selectedCampaign === null) {
            setSelectedCampaign(allSortedData[0]);
            setActiveCardIndex(allSortedData[0]?.id);
        }

        if (toggleTab === "all-campaigns") {
            setSortedData(allSortedData);
            // setSelectedCampaign(allSortedData[0]);
            // setActiveCardIndex(allSortedData[0]?.id);
        } else if (toggleTab === "whatsapp-campaigns") {
            let whatsappOrderByDate = [];
            try {
                whatsappOrderByDate = [...whatsappCampaignData]?.sort((a, b) => new Date(a?.date) - new Date(b?.date)).reverse();
            } catch (err) { }
            setSortedData(whatsappOrderByDate);
            // setSelectedCampaign(whatsappOrderByDate[0]);
            // setActiveCardIndex(whatsappOrderByDate[0]?.id);
        } else if (toggleTab === "sms-campaigns") {
            let smsOrderByDate = [];
            try {
                smsOrderByDate = [...smsCampaignData]?.sort((a, b) => new Date(a?.date) - new Date(b?.date)).reverse();
            } catch (err) { }
            setSortedData(smsOrderByDate);
            // setSelectedCampaign(smsOrderByDate[0]);
            // setActiveCardIndex(smsOrderByDate[0]?.id);
        } else if (toggleTab === "email-campaigns") {
            let emailOrderByDate = [];
            try {
                emailOrderByDate = [...insideEmailCampaign]?.sort((a, b) => new Date(a?.date) - new Date(b?.date)).reverse();
            } catch (err) { }
            setSortedData(emailOrderByDate);
        } else {
            setSortedData(allSortedData);
        }
    }, [data, toggleTab, campaignDetails, campaignReports]);
    // console.log(toggleTab, sortedData)

    const handleSelectedCampaign = (item) => {
        setSelectedCampaign(item);
        setActiveCardIndex(item?.id)
        // dispatch(getCampaignByNameThunkMiddleware({ campaignName: item.name }));
    }

    useEffect(() => {
        if (sortedData) {
            setSelectedCampaign(sortedData[0]);
            setActiveCardIndex(sortedData[0]?.id)
        }
    }, [sortedData]);

    // console.log("sorted data in all campaigns sidebar", sortedData);
    // console.log("selected campaign in all campaigns sidebar", selectedCampaign);
    // // console.log("selected campaign in all campaigns sidebar status", selectedCampaign.status);
    // console.log(" data inside the campaign side bar ", data)

    // console.log(campaignReports)

    return (
        <>
            <div className="flex bg-gray-50 shadow-md rounded-md gap-4">
                <div className='flex w-[30%] lg:w-1/3 flex-col bg-white rounded-md border border-solid'>
                    <div className='flex w-full rounded-md'>
                        <button
                            className={`w-1/4 text-sm md:text-lg font-bold  text-center flex justify-center items-center p-2
                                ${toggleTab === "all-campaigns" ? "bg-white text-black rounded-tl-md" : "bg-gray-600 text-white"}
                            `}
                            // onClick={(e) => handleToggleChange(e)}
                            onClick={(e) => setToggleTab("all-campaigns")}
                            value={"all-campaigns"}
                        >
                            All
                        </button>
                        <button
                            className={`w-1/4 text-sm md:text-lg font-bold text-center flex justify-center items-center p-2
                            ${toggleTab === "whatsapp-campaigns" ? "bg-white" : "bg-gray-600"}
                            `}
                            // onClick={(e) => handleToggleChange(e)}
                            onClick={(e) => setToggleTab("whatsapp-campaigns")}
                            value={"whatsapp-campaigns"}
                        >
                            {/* Whatsapp Campaigns */}
                            <MdOutlineWhatsapp size={"26px"}
                                // onClick={(e) => handleToggleChange(e)}
                                // value={"whatsapp-campaigns"}
                                color={`${toggleTab === "whatsapp-campaigns" ? "black" : "white"}`}
                            />
                        </button>

                        <button
                            className={`w-1/4 text-sm md:text-lg font-bold text-center flex justify-center items-center p-2
                            ${toggleTab === "sms-campaigns" ? "bg-white" : "bg-gray-600"}
                            `}
                            // onClick={(e) => handleToggleChange(e)}
                            onClick={(e) => setToggleTab("sms-campaigns")}
                            value={"sms-campaigns"}
                        >
                            {/* SMS Campaigns */}
                            <FcSms size={"26px"}
                                // onClick={(e) => handleToggleChange(e)}
                                // onClick={(e) => setToggleTab("sms-campaigns")}
                                // value={"sms-campaigns"}
                                color={`${toggleTab === "sms-campaigns" ? "black" : "white"}`}
                            />
                        </button>
                        <button
                            className={`w-1/4 text-sm md:text-lg font-bold text-center flex justify-center items-center p-2
                            ${toggleTab === "email-campaigns" ? "bg-white rounded-tr-md" : "bg-gray-600"}
                            `}
                            // onClick={(e) => handleToggleChange(e)}
                            onClick={(e) => setToggleTab("email-campaigns")}
                            value={"email-campaigns"}
                        >
                            {/* SMS Campaigns */}
                            <MdOutlineAlternateEmail
                                // onClick={(e) => handleToggleChange(e)}
                                // value={"email-campaigns"}
                                size={"26px"} color={`${toggleTab === "email-campaigns" ? "black" : "white"}`}
                            />
                        </button>
                    </div>
                    {sortedData.length !== 0 &&
                        (<div className='h-[80vh] table-container overflow-y-scroll '>
                            {sortedData &&
                                sortedData?.map((item, index) => (
                                    <CampaignsCard
                                        // data={data}
                                        key={index}
                                        value={item}
                                        isActive={item?.id === activeCardIndex}
                                        handleSelectedCard={() => handleSelectedCampaign(item)}
                                    />
                                ))
                            }
                        </div>)
                    }
                    {
                        (sortedData.length === 0) && (
                            <CustomNoCampaignDataComponenet />
                        )
                    }
                </div>
                {sortedData.length !== 0 && (<div className="lg:w-2/3 w-[70%] w-full">
                    <div>
                        {selectedCampaign &&
                            <InsideCampaignTable data={selectedCampaign}
                            // countData={dummyCount} 
                            />
                        }
                    </div>
                </div>)}
                {
                    (sortedData.length === 0) && (
                        <div className="lg:w-2/3 w-[70%] md:min-h-[130vh] h-fit bg-white" >
                            <CustomNoCampaignDataComponenet />
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default AllCampaignsSidebar


const CustomNoCampaignDataComponenet = () => {
    return (
        <div className="w-full p-10 flex justify-center text-center lg:h-screen lg:min-h-[130vh] h-[40vh]">
            There are no campaigns started
        </div>
    );
};