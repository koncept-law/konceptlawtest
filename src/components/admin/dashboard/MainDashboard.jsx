import React, { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@material-tailwind/react";

import { LuSearch } from "react-icons/lu";
import { FaFileExport } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoReloadSharp } from "react-icons/io5";
import DetailsCard from "../../../common/cards/DetailsCard";
import Stats from "../campaigns/campaignDetails/Stats";

import { LuDownload } from "react-icons/lu";
import { IoEyeSharp } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { MdAccountBox, MdEmail, MdMarkEmailRead, MdSms, MdWhatsapp } from "react-icons/md";
import { FiFileText } from "react-icons/fi";
import ExportModal from "../../../common/modals/ExportModal";
import AddCampaign from "../campaigns/AddCampaign";
import { accountDemographicsReportThunkMiddleware, downloadCampaignFilesThunkMiddleware, downloadCampaignSinglePdfFileThunkMiddleware, getAllCampaignReportsThunkMiddleware, getAllCampaignThunkMiddleware, getCampaignByNameThunkMiddleware, searchCampaignWiseLoanAccNoThunkMiddleware, setCampaigns, unqiueAccountNoDataThunkMiddleware } from "../../../redux/features/campaigns";
import { Link, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { numberConvertion } from "../../../functions/NumberConvertion";
import ViewDocumentModal from "../../../common/modals/ViewDocumentModal";
import { HiDocumentPlus, HiMiniDocumentDuplicate } from "react-icons/hi2";
import { Dropdown, Menu, Tooltip } from "antd";
import { setNotificationThunkMiddleware } from "../../../redux/features/notification";
import { FiUpload } from "react-icons/fi";
import { BiSolidMessageCheck } from "react-icons/bi";
import { FaWhatsappSquare } from "react-icons/fa";
import { toastify } from "../../toast";
// import UploadMenu from "../../../common/menu/UploadMenu";
import { RiFileExcel2Fill } from "react-icons/ri";
import FilterField from "../../../common/fields/FilterField";

const StatsCard = ({ title, value, icon, iconClass = "", textClass = "" }) => {
    return (
        <>
            <div
                key={value}
                className="bg-white rounded-md cursor-pointer flex w-full items-center  px-4 py-2 shadow-lg "
            >
                <div className="flex items-center gap-y-2 gap-x-5">
                    <div className={` w-fit h-fit p-2.5 rounded-full text-white text-xl ${iconClass}`}>
                        {icon}
                    </div>
                    <div>
                        <h1 className={`font-bold text-2xl ${textClass}`}>{numberConvertion(value)}</h1>
                        <h1 className=" font-medium text-[14px] font-poppins not-italic leading-normal">{title}</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

const MainDashboard = () => {
    const { campaignDetails, allCampaigns, singleUser, accountReports, unqiueAccountNoData } = useSelector(
        (state) => state.campaigns
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log("all campaigns", allCampaigns)
    // console.log("accountReport Data", accountReports);

    const { user } = useSelector(state => state.user);
    const permission = (user?.email === "hdfc" ? false : true);

    const [isOpenExport, setIsOpenExport] = useState(false);
    const [isOpenAddCampaign, setIsOpenAddCampaign] = useState(false);
    const [isOpenDocument, setIsOpenDocument] = useState(false);

    const activeRef = useRef(null);
    const accountNoRef = useRef(null);
    const accountNowithcampaign = useRef(null);

    const scrollToActive = () => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    useEffect(() => {
        if (activeRef.current) {
            // activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            scrollToActive();
        }
    }, []);

    useEffect(() => {
        // console.log("singleUser", singleUser);
        dispatch(accountDemographicsReportThunkMiddleware({ accountId: singleUser?.accountId }));
        dispatch(getAllCampaignThunkMiddleware({ accountId: singleUser?.accountId }));
    }, [singleUser]);

    useEffect(() => {
        try {
            if (allCampaigns && !campaignDetails) {
                dispatch(setCampaigns({ campaignDetails: [...allCampaigns].reverse()[0] }));
                dispatch(getCampaignByNameThunkMiddleware({ campaignName: [...allCampaigns].reverse()[0]?.name }));
            }
        } catch (err) {
            console.error("Error: MainDashboard Campaign Details Reverse:", err);
        }
    }, [allCampaigns]);

    const isFilePresent = useMemo(() => {
        return campaignDetails?.pdfsUploaded && campaignDetails?.pdfsUploaded !== "0"
            ? true
            : false;
    }, [campaignDetails])

    const isDataMappedCorrectly = useMemo(
        () => campaignDetails?.isDataMappedCorrectly,
        [campaignDetails]
    );

    const isDownloadSinglePdfReady = useMemo(
        () => campaignDetails?.isDownloadSinglePdfReady,
        [campaignDetails]
    );

    const { downloadCampaignFileStatus } = useSelector((state) => state.progress);


    const refresh = () => {
        dispatch(getAllCampaignThunkMiddleware({ accountId: singleUser?.accountId }));
        dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails?.name }));
    }

    const data = [
        {
            title: "Upload Contact Excel",
            value: (
                campaignDetails?.itemsInExcel || campaignDetails?.pdfsUploaded
            ),
            icon: <RiFileExcel2Fill size={"15px"} />,
            iconClass: "bg-[#0284c7]",
            textClass: "text-[#0284c7]",
        },
        {
            title: "Total Documents",
            value: (
                campaignDetails?.type === "pdfType" ?
                    (campaignDetails?.pdfsUploaded === "" ? campaignDetails?.itemsInExcel : campaignDetails?.pdfsUploaded)
                    : (campaignDetails?.totalMainFilesUploaded !== 0 ? campaignDetails?.totalMainFilesUploaded : campaignDetails?.pdfsUploaded)
            ),
            icon: <MdAccountBox size={"15px"} />,
            iconClass: "bg-[#0284c7]",
            textClass: "text-[#0284c7]",
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
            value: campaignDetails?.totalEmail ? campaignDetails?.totalEmail : 0,
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

    const searchRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    // const [searchQuery, setSearchQuery] = useState({ type: "name", text: '' });

    const filteredData = allCampaigns?.filter(item => {
        return (
            // searchQuery?.type === "name" ? 
            // item.name.toLowerCase().includes(searchQuery?.text.toLowerCase()):
            // searchQuery?.type === "date" ? 
            // item.Date.includes(searchQuery?.text):
            // item.name.toLowerCase().includes(searchQuery?.text.toLowerCase())
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleFilter = (e) => {
        setSearchQuery(e);
    }

    const downloadSinglePdf = () => {
        dispatch(
            downloadCampaignSinglePdfFileThunkMiddleware({
                campaignName: campaignDetails.name,
            })
        );
    }

    const accountData = [
        // {
        //     title: "Total Uploaded Documents",
        //     value: accountReports?.totalUploadedDocuments ? numberConvertion(accountReports?.totalUploadedDocuments) : 0,
        //     icon: <HiMiniDocumentDuplicate size={"18px"} />,
        //     iconClass: "bg-[#0284c7]",
        //     textClass: "text-[#0284c7]",
        // },
        {
            title: "Total Documents",
            value: accountReports?.totalDocuments ? numberConvertion(accountReports?.totalDocuments) : 0,
            icon: <HiMiniDocumentDuplicate size={"18px"} />,
            iconClass: "bg-[#0284c7]",
            textClass: "text-[#0284c7]",
        },
        {
            title: "Total Created Documents",
            value: accountReports?.totalCreatedDocuments ? numberConvertion(accountReports?.totalCreatedDocuments) : 0,
            icon: <HiDocumentPlus size={"18px"} />,
            iconClass: "bg-[#0284c7]",
            textClass: "text-[#0284c7]",
        },
        {
            title: "Total SMS",
            value: accountReports?.totalSms ? numberConvertion(accountReports?.totalSms) : 0,
            icon: <MdSms size={"18px"} />,
            iconClass: "bg-[#3b82f6]",
            textClass: "text-[#3b82f6]",
        },
        {
            title: "Total Email",
            value: accountReports?.totalEmail ? numberConvertion(accountReports?.totalEmail) : 0,
            icon: <MdEmail size={"18px"} />,
            iconClass: "bg-[#c026d3]",
            textClass: "text-[#c026d3]",
        },
        {
            title: "Total Whatsapp",
            value: accountReports?.totalWhatsapp
                ? numberConvertion(accountReports?.totalWhatsapp)
                : 0,
            icon: <MdWhatsapp size={"19px"} className="text-white" />,
            iconClass: "bg-green-500",
            textClass: "text-green-500",
        },
        {
            title: "Click Reports",
            value: accountReports?.totalClickReports
                ? numberConvertion(accountReports?.totalClickReports)
                : 0,
            icon: <FiFileText size={"18px"} className="text-white" />,
            iconClass: "bg-[#3b82f6]",
            textClass: "text-[#3b82f6]",
        },
    ];

    const downloadFilesHandler = () => {
        if (isFilePresent && !downloadCampaignFileStatus) {
            dispatch(
                downloadCampaignFilesThunkMiddleware({
                    campaignName: campaignDetails.name,
                    campaignType: campaignDetails.type,
                })
            );
        }
    };

    const handleUnqiueAccount = (e) => {
        e.preventDefault();
        let accountNo = accountNoRef.current.value;
        // console.log(singleUser)
        if (accountNo && accountNo !== "") {
            dispatch(unqiueAccountNoDataThunkMiddleware({
                id: singleUser?._id,
                // unique_account_no: Number.parseInt(accountNo),
                loanAccountNo: Number.parseInt(accountNo),
            }))

            setIsOpenDocument(true);
        } else {
            toastify({ msg: "Loan Account Number Not Fill", type: "error" })
        }
    }

    const handleLoanAccountWithCampaignName = (e) => {
        e.preventDefault();
        let loanAccount = accountNowithcampaign.current.value;
        if (loanAccount && loanAccount !== "") {
            // console.log("handle loan account with campaign name", campaignDetails.name, loanAccount);
            dispatch(searchCampaignWiseLoanAccNoThunkMiddleware({ campaignName: campaignDetails?.name, loanAccountNo: loanAccount }));
            setIsOpenDocument(true);
        }
    }

    const dropdownMenu = (
        <Menu
            className="custom-menu" // Apply custom class here
            style={{ width: 250, backgroundColor: '#1e293b' }} // Set background color here
        >
            <h2 className="w-full text-start text-white not-italic leading-normal font-poppins font-medium px-2 py-1">{isDataMappedCorrectly ? "Select Campaign" : "Campaigns Not Available"}</h2>
            <h2 className="w-full my-1 h-[1px] bg-gray-600"></h2>
            {/* {
                isDataMappedCorrectly ? <>
                    <Menu.Item className="w-full" onClick={() => {
                        navigate("/campaigns/sms/categories");
                    }}>
                        <div className="w-full flex justify-start gap-x-3 items-center text-white">
                            <MdSms size={"17px"} />
                            <span className="font-poppins not-italic leading-normal font-medium text-[14.5px]">Sms</span>
                        </div>
                    </Menu.Item>

                    <Menu.Item className="w-full" onClick={() => {
                        navigate("/campaigns/campaigndetails/whatsapp");
                    }}>
                        <div className="w-full flex justify-start gap-x-3 items-center text-white">
                            <MdWhatsapp size={"18px"} />
                            <span className="font-poppins not-italic leading-normal font-medium text-[14px]">Whatsapp</span>
                        </div>
                    </Menu.Item>

                    <Menu.Item className="w-full" onClick={() => {
                        navigate("/campaigns/campaigndetails/bulkemail");
                    }}>
                        <div className="w-full flex justify-start gap-x-3 items-center text-white">
                            <MdEmail size={"18px"} />
                            <span className="font-poppins not-italic leading-normal font-medium text-[14px]">Email</span>
                        </div>
                    </Menu.Item>
                </> : <h2 className="flex justify-center text-[#e0e0e0] text-[13px] text-center not-italic leading-normal font-poppins items-center w-full my-4">
                    Please review the campaign details for further information.
                </h2>
            } */}
            <Menu.Item className="w-full" onClick={() => {
                navigate("/campaigns/sms/categories");
            }}>
                <div className="w-full flex justify-start gap-x-3 items-center text-white">
                    <MdSms size={"17px"} />
                    <span className="font-poppins not-italic leading-normal font-medium text-[14.5px]">Sms</span>
                </div>
            </Menu.Item>

            <Menu.Item className="w-full" onClick={() => {
                navigate("/campaigns/campaigndetails/whatsapp");
            }}>
                <div className="w-full flex justify-start gap-x-3 items-center text-white">
                    <MdWhatsapp size={"18px"} />
                    <span className="font-poppins not-italic leading-normal font-medium text-[14px]">Whatsapp</span>
                </div>
            </Menu.Item>

            <Menu.Item className="w-full" onClick={() => {
                // navigate("/campaigns/campaigndetails/bulkemail");
                navigate("/campaigns/campaigndetails/email/categories")
            }}>
                <div className="w-full flex justify-start gap-x-3 items-center text-white">
                    <MdEmail size={"18px"} />
                    <span className="font-poppins not-italic leading-normal font-medium text-[14px]">Email</span>
                </div>
            </Menu.Item>
        </Menu>
    );

    return <>
        {/* modals */}
        <ExportModal visible={isOpenExport} onCancel={() => setIsOpenExport(false)} />
        <AddCampaign modal={isOpenAddCampaign} toggle={() => setIsOpenAddCampaign(false)} />
        <ViewDocumentModal open={isOpenDocument} setOpen={() => setIsOpenDocument(false)} />

        <div className="flex w-full flex-col h-[30%] xl:h-[23%]">
            <Stats items={accountData} />
            <div className="flex gap-x-2 justify-start mt-2 w-full items-start">
                <div className="flex gap-x-2 justify-start w-full items-center">
                    {/* <FilterField onChange={handleFilter} /> */}

                    <div className="flex justify-center border border-solid overflow-hidden rounded-md">
                        <input ref={searchRef} type="text" placeholder="Search Campaign Name" className="outline-none px-2 text-[15px] placeholder:text-[14px] py-0.5 w-[180px]" onChange={(e) => setSearchQuery(e.target.value)} />
                        <Button className="bg-slate-800 px-2 flex justify-center items-center shadow-none py-1 hover:shadow-none rounded-none text-white" onClick={() => {
                            searchRef.current.value = "";
                            setSearchQuery("");
                        }}>
                            <RxCross2 size={"17px"} />
                        </Button>
                    </div>

                    <form onSubmit={handleUnqiueAccount} className="flex justify-center border border-solid overflow-hidden rounded-md">
                        <input ref={accountNoRef} type="text" placeholder="Enter Loan Account Number" className="outline-none text-[15px] placeholder:text-[13px] px-2 py-0.5 w-[200px]" />
                        <Button
                            type="submit"
                            className="bg-slate-800 px-3 flex justify-center items-center shadow-none py-1 hover:shadow-none rounded-none text-white"
                        // onClick={handleUnqiueAccount}
                        >
                            <LuSearch size={"16px"} />
                        </Button>
                    </form>
                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-1 px-4 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center text-[14px] gap-x-1.5" onClick={() => setIsOpenExport(true)}>
                        <FaFileExport size={"17px"} />
                        <span>Export</span>
                    </Button>

                    <Tooltip title="Add Campaign" placement="bottom">
                        <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-1 px-4 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center text-[14px] gap-x-1.5" onClick={() => setIsOpenAddCampaign(true)}>
                            <FaPlus size={"17px"} />
                            <span>Add</span>
                        </Button>
                    </Tooltip>

                    <Tooltip title="Document Templates" placement="bottom">
                        <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-1 px-3 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center text-[14px] gap-x-1.5" onClick={() => {
                            navigate("/campaigns/documenttemplates");
                        }}>
                            <IoEyeSharp size={"18px"} />
                            <span>Templates</span>
                        </Button>
                    </Tooltip>

                    <Tooltip title="Reload" placement="rightBottom">
                        <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-1.5 px-4 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center text-[14px] gap-x-1.5" onClick={refresh}>
                            <IoReloadSharp size={"17px"} />
                        </Button>
                    </Tooltip>
                </div>
                {/* <div className="flex justify-center items-center">
                <Dropdown
                    overlay={UploadMenu}
                    // trigger={['hover']}
                    trigger={["click"]}
                    placement="rightBottom"
                    overlayStyle={{ width: 200 }} // Optional: Ensure consistency in width
                >
                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-1 px-2 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[14px] items-center gap-x-1.5">
                        <FiUpload size={"17px"} />
                        <span>Upload</span>
                    </Button>
                </Dropdown>
            </div> */}
            </div>
        </div>

        {/* change by me */}
        {/* <div className="flex justify-center mt-3 items-center h-[70vh] w-full"> */}
        <div className="flex justify-start h-[70%] xl:h-[77%] items-start w-full">
            {/* left */}
            <div className="w-[35%] h-full custom-scroll px-2 overflow-y-scroll">
                {
                    // allCampaigns ? [...allCampaigns]?.reverse()?.map((data, index) => (<DetailsCard key={index} data={data} active={data?.name === campaignDetails?.name} />)) : <h2>Loading...</h2>
                    filteredData ? [...filteredData]?.reverse()?.map((data, index) => (
                        <div
                            key={index}
                            ref={data?.name === campaignDetails?.name ? activeRef : null}
                            className="w-full"
                        >
                            <DetailsCard
                                data={data}
                                active={data?.name === campaignDetails?.name}
                            />
                        </div>
                    )) : <h2>Loading...</h2>
                }
            </div>
            {/* right */}
            <div className="w-[65%] h-full flex flex-col p-3 justify-start items-start ">
                <div className="w-full flex justify-between gap-x-2 items-start">
                    <div className="flex flex-col gap-y-2 justify-start items-start">
                        <Tooltip title="Open Campaign Details" placement="rightTop">
                            <Link to={"/campaigns/campaigndetails"} onClick={() => {
                                dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails?.name }));
                            }}>
                                <h2 className="font-semibold font-poppins not-italic cursor-pointer hover:text-blue-700 active:text-green-700 transition-all leading-normal text-lg text-[#000000]">{campaignDetails?.name}</h2>
                            </Link>
                        </Tooltip>
                        <div className="flex justify-center items-center gap-x-2">
                            <form onSubmit={handleLoanAccountWithCampaignName} className="flex justify-center border border-solid overflow-hidden rounded-md">
                                <input ref={accountNowithcampaign} type="text" placeholder="Enter Loan Account Number" className="outline-none text-[15px] placeholder:text-[13px] px-2 py-0.5 w-[200px]" />
                                <Button type="submit" className="bg-slate-800 px-2 flex justify-center items-center shadow-none py-0.5 hover:shadow-none rounded-none text-white"
                                // onClick={() => {
                                // dispatch(setNotificationThunkMiddleware({
                                //     message: "Result Find Sucessfully to unqiue number!",
                                //     path: "/",
                                //     type: "success"
                                // }))
                                // }}
                                >
                                    <LuSearch size={"14px"} />
                                </Button>
                            </form>
                            <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-1 px-4 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center text-[14px] gap-x-1.5" onClick={() => setIsOpenExport(true)}>
                                <FaFileExport size={"17px"} />
                                <span>Export</span>
                            </Button>

                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-1 justify-center items-center gap-x-2">
                        <Button
                            className={`font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[10px] lg:text-[14px] items-center gap-x-1.5 ${!isDownloadSinglePdfReady ? "cursor-not-allowed bg-slate-700" : ""}`}
                            onClick={isDownloadSinglePdfReady ? downloadSinglePdf : () => { }}
                        >
                            <LuDownload size={"18px"} />
                            {/* <span>Sample</span> */}
                            <span>Sample PDF</span>
                        </Button>

                        {/* <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[14px] items-center gap-x-1.5" onClick={() => {
                            navigate("/campaigns/documenttemplates");
                        }}>
                            <IoEyeSharp size={"18px"} />
                            <span>Templates</span>
                        </Button> */}

                        <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[10px] lg:text-[14px] items-center gap-x-1.5" onClick={() => {
                            dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails?.name }));
                            navigate("/campaigns/campaigndetails/reports");
                        }}>
                            <IoEyeSharp size={"18px"} />
                            <span>Reports</span>
                        </Button>

                        {
                            campaignDetails?.type !== "pdfType" ? <>
                                <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[10px] lg:text-[14px] items-center gap-x-1.5" onClick={() => {
                                    if (isDataMappedCorrectly) {
                                        navigate("/campaigns/documentscategorydownload");
                                    } else {
                                        toastify({ msg: "Data Not Mappad!", type: "error" })
                                    }
                                }}>
                                    <IoEyeSharp size={"18px"} />
                                    {/* <span>Categories</span> */}
                                    <span>All Category</span>
                                </Button>
                            </> : <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[10px] lg:text-[14px] items-center gap-x-1.5" onClick={downloadFilesHandler}>
                                <IoEyeSharp size={"18px"} />
                                <span>PDFs</span>
                            </Button>
                        }

                        {/* <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[14px] items-center gap-x-1.5" onClick={() => {
                            dispatch(
                                downloadCampaignFilesThunkMiddleware({
                                    campaignName: campaignDetails?.name,
                                    campaignType: campaignDetails?.type,
                                })
                            );
                        }}>
                            <LuSend size={"18px"} />
                            <span>Campaign</span>
                        </Button> */}

                        <Dropdown
                            overlay={dropdownMenu}
                            // trigger={['hover']}
                            trigger={["click"]}
                            placement="rightBottom"
                            overlayStyle={{ width: 200 }} // Optional: Ensure consistency in width
                        >
                            <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[10px] lg:text-[14px] items-center gap-x-1.5">
                                <LuSend size={"18px"} />
                                <span>Campaign</span>
                            </Button>
                        </Dropdown>

                        <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-0.5 px-1 rounded-md shadow-sm hover:shadow-sm flex justify-center text-[10px] lg:text-[12px] items-center gap-x-1.5" onClick={() => {
                            // navigate("/campaigns/campaigndetails/reports");
                            dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails?.name }));
                            navigate("/campaigns/campaigndetails");
                        }}>
                            <IoEyeSharp size={"18px"} />
                            <span>Campaign Details</span>
                        </Button>
                    </div>
                </div>

                <div className="h-[1px] bg-gray-400 w-full my-2"></div>

                <div className="grid w-full gap-4 justify-start items-start grid-cols-3">
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
            </div>
        </div>
    </>
}

export default MainDashboard;