import React, { useMemo, useState } from "react";
import { Dropdown, Menu, Tooltip } from "antd";
import { LuLogOut, LuSearch, LuUser } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunkMiddleware } from "../../../redux/features/user";
import { toastify } from "../../toast";
import NotificationModal from "../../../common/modals/NotificationModal";
import { Button } from "@material-tailwind/react";

import "./CustomMenu.css";
import SwitchUserBox from "../users/SwitchUserBox";
import AddUser from "../users/AddUser";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoReloadSharp } from "react-icons/io5";
import { getAllCampaignThunkMiddleware, getCampaignByNameThunkMiddleware } from "../../../redux/features/campaigns";
import AddCampaign from "../campaigns/AddCampaign";
import { FaFileExport, FaPlus } from "react-icons/fa";
import ExportModal from "../../../common/modals/ExportModal";
import ViewDocumentModal from "../../../common/modals/ViewDocumentModal";

import usePath from "../../../hooks/usePath";
import { FaAnglesLeft } from "react-icons/fa6";

const DashboardNavbar = () => {
    const { singleUser, campaignDetails } = useSelector(state => state.campaigns);
    const { user } = useSelector(state => state.user);
    const permission = (user?.profile === "superAdmin");

    const { allNotification } = useSelector(state => state.notification);
    const notificationCount = useMemo(() => {
        return allNotification && allNotification?.length ? allNotification?.length : 0;
    }, [allNotification])

    const dispatch = useDispatch();
    const [OpenNotification, setOpenNotification] = useState(false);
    const [open, setOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [isOpenDocument, setIsOpenDocument] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const path = usePath();

    const logoutHandle = () => {
        dispatch(logoutThunkMiddleware());
        toastify({ msg: "Logout Successfully", type: "success" });
    };

    const refresh = () => {
        dispatch(getAllCampaignThunkMiddleware({ accountId: singleUser?.accountId }));
        dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails?.name }));
    }

    const userMenu = (
        <Menu
            className="custom-menu"
            style={{ width: 250, backgroundColor: '#1e293b' }} // Set background color here
        >
            <Menu.Item key="account" onClick={() => {
                navigate("/all-accounts")
            }}>
                <span>Switch Account</span>
            </Menu.Item>
            {/* {
                permission ? <>
                    <Menu.Item key="addUser" onClick={() => setAddOpen(true)}>
                        <span>Add User</span>
                    </Menu.Item>
                </> : null
            }
            <Menu.Item key="profile">
                <span>Profile</span>
            </Menu.Item> */}
            <Menu.Item key="logout" onClick={logoutHandle}>
                <Tooltip title="Logout" placement="leftBottom">
                    <span>Logout</span>
                </Tooltip>
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <NotificationModal isVisible={OpenNotification} onClose={() => setOpenNotification(false)} />
            {/* <SwitchUserBox open={open} setOpen={setOpen} /> */}
            <AddUser open={addOpen} setOpen={() => setAddOpen(false)} />
            <ViewDocumentModal 
                open={isOpenDocument} 
                setOpen={() => setIsOpenDocument(false)} 
                globalSearch={true}
            />

            {/* change by me */}
            {/* <nav className="bg-white w-full flex justify-between shadow-md shadow-slate-200 items-center py-1.5 px-3"> */}
            <nav className="bg-white w-full flex justify-between h-[7%] shadow-md shadow-slate-200 items-center py-1.5 px-3">
                <h2 className="font-poppins not-italic flex justify-center items-center gap-x-0.5 leading-normal font-medium text-lg">
                    {
                        !location.pathname?.match("all-accounts")
                            ? <>
                                <Tooltip title="Back" placement="bottom">
                                    <Button
                                        onClick={() => path.back()}
                                        className="w-fit flex items-center gap-1 mx-2 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                                    >
                                        <FaAnglesLeft size={16} />
                                    </Button>
                                </Tooltip>
                                <Link to={"/dashboard"}>
                                    <h2 className="hover:text-blue-700 hover:underline hover:underline-offset-4 hover:decoration-[2px]">{singleUser?.firstName + (singleUser?.lastName ? ` ${singleUser?.lastName}` : "")}</h2>
                                </Link>
                            </>
                            : null
                    }
                    {/* <CgFormatSlash size={20} />
                    <h2 className="text-[17px]">{campaignDetails?.name}</h2> */}
                </h2>
                <div className="flex justify-center items-center gap-x-2">
                    {
                        !location.pathname?.match("all-accounts")
                            ? <>
                                <Tooltip title="Loan Account Number" placement="bottom">
                                    <Button
                                        type="submit"
                                        className="bg-slate-800 px-2.5 flex justify-center items-center shadow-none py-[7.5px] hover:shadow-none rounded-md text-white"
                                        onClick={() => setIsOpenDocument(true)}
                                    >
                                        <LuSearch size={"16px"} />
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Refresh" placement="bottom">
                                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-[7.5px] px-2 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center text-[14px]" onClick={refresh}>
                                        <IoReloadSharp size={"17px"} />
                                    </Button>
                                </Tooltip>
                            </>
                            : null
                    }

                    <Tooltip title="Notification" placement="bottom">
                        <div className="relative inline-block">
                            <Button className="font-poppins font-medium text-white bg-blue-700 p-2" onClick={() => setOpenNotification(true)}>
                                <FaRegBell size={"18px"} />
                            </Button>
                            <div className={`absolute rounded-3xl text-white bg-blue-400 w-[18px] h-[18px] flex justify-center items-center text-[10px] -top-1 -right-1.5`}>
                                {notificationCount}
                            </div>
                        </div>
                    </Tooltip>

                    <Tooltip title="Switch Account" placement="bottom">
                        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                            <Button className="font-poppins font-medium text-white bg-green-700 p-2">
                                <LuUser size={"18px"} />
                            </Button>
                        </Dropdown>
                    </Tooltip>

                    <Tooltip title="Logout" placement="bottom">
                        <Button className="font-poppins font-medium text-white bg-red-700 p-2" title="logout" onClick={logoutHandle}>
                            <LuLogOut size={"18px"} />
                        </Button>
                    </Tooltip>
                </div>
            </nav>
        </>
    );
};

export default DashboardNavbar;
