import React, { useEffect, useState } from "react";
import { MdOutlineAlternateEmail, MdOutlineWhatsapp } from "react-icons/md";
import CampaignsCard from "./CampaignsCard";
import { FcSms } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import InsideCampaignTable from "./InsideCampaignTable";
import InsideRoutes from "../../../../common/InsideRoutes";
import { CiFileOn } from "react-icons/ci";
import { LuMessageCircle } from "react-icons/lu";
import ReportSection from "./ReportSection/ReportSection";
import DataTable from "react-data-table-component";
import { getAllCampaignReportsThunkMiddleware, getSpecificCampaignSmsThunkMiddleware } from "../../../../redux/features/campaigns";
import axios from "axios";

const CampaignReports = ({ data }) => {
    const { campaignDetails, campaignReports, specificCampaignSms } = useSelector((state) => state.campaigns);
    const dispatch = useDispatch();
    const insideSmsCampaigns = campaignReports?.length ? (campaignReports[0]?.insideSmsCampaigns) : [];
    const insideWhatsAppCampaign = campaignReports?.length ? (campaignReports[0]?.insideWhatsappCampaign) : [];
    const insideEmailCampaign = campaignReports?.length ? (campaignReports[0]?.insideEmailCampaign) : [];
    const allReport = insideSmsCampaigns.concat(insideWhatsAppCampaign).concat(insideEmailCampaign);
    const allReportData = allReport?.sort((a, b) => new Date(a.date) - new Date(b.date))?.reverse();

    const [toggleTab, setToggleTab] = useState("all-campaigns");
    const [sortedData, setSortedData] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [activeCardIndex, setActiveCardIndex] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [clicksData, setClicksData] = useState([]);
    const [ShowReportData, setShowReportData] = useState(null);


    useEffect(() => {
        let allData = campaignReports[0]?.insideWhatsappCampaign.concat(campaignReports[0]?.insideSmsCampaigns);
        const allSortedData = allData?.sort((a, b) => new Date(a.date) - new Date(b.date))?.reverse();

        if (!filteredData) {
            setFilteredData(allSortedData[0]);
        }

        setFilteredData(() => {
            return allSortedData.filter((item) => {
                return data?.id === item?.id;
            })
        });

    }, [data, campaignDetails]);

    useEffect(() => {
        if (!campaignReports || campaignReports === null) return;

        let whatsappCampaignData = campaignReports?.length ? campaignReports[0]?.insideWhatsappCampaign: [];
        let smsCampaignData = campaignReports?.length ? campaignReports[0]?.insideSmsCampaigns: [];

        // let

        let allData = smsCampaignData?.concat(whatsappCampaignData);
        const allSortedData = allData?.sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();

        if (selectedCampaign === null) {
            setSelectedCampaign(allSortedData[0]);
            setActiveCardIndex(allSortedData[0]?.id);
        }

        if (toggleTab === "all-campaigns") {
            setSortedData(allSortedData);
        } else if (toggleTab === "whatsapp-campaigns") {
            let whatsappOrderByDate = [...whatsappCampaignData].sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();
            setSortedData(whatsappOrderByDate);
        } else if (toggleTab === "sms-campaigns") {
            let smsOrderByDate = [...smsCampaignData].sort((a, b) => new Date(a.date) - new Date(b.date)).reverse();
            setSortedData(smsOrderByDate);
        } else {
            setSortedData(allSortedData);
        }
    }, [data, toggleTab, campaignDetails, campaignReports]);

    const handleSelectedCampaign = (item) => {
        setSelectedCampaign(item);
        setActiveCardIndex(item.id);

        dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails?.name }));
        
        // dispatch(getSpecificCampaignSmsThunkMiddleware({ campaignName: campaignDetails.name, id: ShowReportData.id }))
        // dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails.name }));

        let match = allReportData.filter(({ id }) => {
            return id === item?.id;
        })
        setShowReportData(match[0]);
    }

    let links = [
        {
            label: (<>
                <CiFileOn size={"22px"} />
                <span className="">Reports</span>
            </>),
            value: "reports"
        },
        {
            label: (<>
                <LuMessageCircle size={"22px"} />
                <span className="">Message</span>
            </>),
            value: "message"
        }
    ]

    const tableCustomStyles = {
        headRow: {
            style: {
                background: "#f1f5f9",
                textWrap: "wrap",
            },
        },
        rows: {
            style: {
                // marginLeft: "3px",
                // marginRight: "3px",
            },
        },
    }

    const columns = [
        {
            name: "Message Id",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?._id}</h2>
            },
            width: "200px",
        },
        {
            name: "Mobile Number",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.to}</h2>
            },
            width: "150px",
        },
        {
            name: "Status",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.status}</h2>
            },
            width: "100px",
        },
        {
            name: "Sent Time",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.sentTime}</h2>
            },
            width: "200px",
        },
        {
            name: "App",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.app}</h2>
            },
            width: "100px",
        },
        {
            name: "Channel",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.channel}</h2>
            },
            width: "100px",
        },
        // {
        //     name: "Email",
        //     selector: (row) => {
        //         return <h2 className="text-center text-wrap">{row.email}</h2>
        //     },
        //     width: "100px",
        // },
        {
            name: "Error",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.error}</h2>
            },
            width: "200px",
        },
        {
            name: "Timestamp",
            selector: (row) => {
                return <h2 className="text-center text-wrap">{row?.timeStamp}</h2>
            },
            width: "180px",
        },
        {
            name: "Clicks",
            selector: (row) => {
                // const handleCellClick = () => {
                //     const result = clicksData.filter((item, index) => {
                //         return item.shortId === JSON.parse(row?.data).var3.split("/")[4];
                //     });
                //     console.log("click count value", result)
                // }

                const shortId = JSON.parse(row?.data).var3.split("/")[4];
                const clickData = clicksData.find(item => item?.shortId === shortId);

                return (
                    <>
                        <span>
                            {clickData ? clickData?.clicks : "There is no click data"}
                        </span>
                    </>
                )
                // return <h2 className="text-center text-wrap">{`Clicks ${count}`}</h2>
            },
            width: "fit",
        }
    ]

    const rowClickHandler = async (rowData) => {
        let allRowIds = []
        allRowIds[0] = JSON.parse(rowData?.data).var3.split("/")[4]; // all short urls
        const response = await axios.post("https://t.konceptlaw.in/clicks", {
            shortIds: allRowIds,
        });

        const updatedData = response?.data;

        setClicksData(prevData => prevData?.map(row => row.shortId === allRowIds[0].shortId ? { ...row, ...updatedData } : row))
    }

    const selectAllRows = async () => {
        // const allRowIds = rows.map(row => row._id); // Extract IDs from all rows
        const allRowIds = specificCampaignSms?.sms.map(row => JSON.parse(row?.data).var3.split("/")[4]); // all short urls
        const response = await axios.post("https://t.konceptlaw.in/campaign/clicks", {
            shortIds: allRowIds,
        });
        setClicksData(response.data);
    };

    // const [changeInside, setChangeInside] = useState("reports");
    const ChangeInside = (changeInside) => {
        if (changeInside === "message") {
            if (ShowReportData) {
                selectAllRows();
                dispatch(getSpecificCampaignSmsThunkMiddleware({ campaignName: campaignDetails?.name, id: ShowReportData?.id }))
            }
        } else if (changeInside === "reports") {
            selectAllRows();
            dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails?.name }));
        }
    }

    useEffect(()=> {
        selectAllRows();
        dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails?.name }));
        dispatch(getSpecificCampaignSmsThunkMiddleware({ campaignName: campaignDetails?.name, id: ShowReportData?.id }))
    }, []);

    return <>
        <div className="w-full flex justify-center items-start gap-x-1 h-[80vh]">
            <div className='flex w-full lg:w-1/3 flex-col h-full bg-slate-50 border'>
                <div className='flex w-full border-b border-solid rounded-md'>
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
                {allReportData?.length !== 0 &&
                    (<div className='h-full table-container overflow-y-scroll '>
                        {allReportData &&
                            allReportData?.map((item, index) => (
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
                    (allReportData?.length === 0) && (
                        <CustomNoCampaignDataComponenet />
                    )
                }
            </div>

            {allReportData?.length !== 0 && (<div className="lg:w-2/3 w-full h-full">
                <div>
                    {selectedCampaign &&
                        // <InsideCampaignTable data={selectedCampaign}
                        // />
                        <InsideRoutes links={links} onChange={ChangeInside}>
                            <div name="reports">
                                <div className="p-3 flex flex-col w-full">
                                    {
                                        ShowReportData && (
                                            <ReportSection
                                                // dataInCampaign={filteredData ? filteredData[0] : []}
                                                dataInCampaign={ShowReportData}
                                            />
                                        )
                                    }
                                </div>
                            </div>
                            <div name="message">
                                <div className="rounded-lg w-full mx-auto">
                                    <div className="bg-gray-600 p-2 text-white font-medium text-[15px] rounded-t-md">
                                        <h2 className="font-poppins not-italic leading-normal">Contacts</h2>
                                        <button className="flex justify-center font-poppins not-italic leading-normal items-center gap-x-2">
                                            Export
                                        </button>
                                    </div>
                                    <div className="h-full w-full">
                                        <DataTable
                                            columns={columns}
                                            data={specificCampaignSms?.sms ? [...specificCampaignSms.sms].slice().reverse() : []}
                                            // data={ShowReportData}
                                            fixedHeader
                                            paginationPerPage={8}
                                            pagination
                                            selectableRows
                                            onRowClicked={(row) => rowClickHandler(row)}
                                            // onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
                                            // selectableRowSelected={row => selectedRows.some(selectedRow => selectedRow.id === row.id)}
                                            // onRowSelected={() => { console.log("insideSmsCampaigns on Row Selected!") }}
                                            highlightOnHover
                                            customStyles={tableCustomStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </InsideRoutes>
                    }
                </div>
            </div>)}
            {
                (allReportData?.length === 0) && (
                    <div className="lg:w-2/3 w-full h-full bg-white" >
                        <CustomNoCampaignDataComponenet />
                    </div>
                )
            }
        </div>
    </>
}

const CustomNoCampaignDataComponenet = () => {
    return (
        <div className="w-full p-10 flex justify-center text-center h-full text-[14px]">
            There are no campaigns started
        </div>
    );
};

export default CampaignReports;