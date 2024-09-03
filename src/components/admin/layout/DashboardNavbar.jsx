import React, { useMemo, useState } from "react";
import { Dropdown, Menu, Tooltip } from "antd";
import { LuLogOut, LuUser } from "react-icons/lu";
import { FaRegBell } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunkMiddleware } from "../../../redux/features/user";
import { toastify } from "../../toast";
import NotificationModal from "../../../common/modals/NotificationModal";
import { Button } from "@material-tailwind/react";

import "./CustomMenu.css";
import SwitchUserBox from "../users/SwitchUserBox";
import AddUser from "../users/AddUser";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
    const { singleUser } = useSelector(state => state.campaigns);
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
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandle = () => {
        dispatch(logoutThunkMiddleware());
        toastify({ msg: "Logout Successfully", type: "success" });
    };

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

            {/* change by me */}
            {/* <nav className="bg-white w-full flex justify-between shadow-md shadow-slate-200 items-center py-1.5 px-3"> */}
            <nav className="bg-white w-full flex justify-between h-[7%] shadow-md shadow-slate-200 items-center py-1.5 px-3">
                <h2 className="font-poppins not-italic leading-normal font-medium text-lg">
                    {
                        !location.pathname?.match("all-accounts")
                            ? (singleUser?.firstName + (singleUser?.lastName ? ` ${singleUser?.lastName}` : ""))
                            : null
                    }
                </h2>
                <div className="flex justify-center items-center gap-x-2">
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
