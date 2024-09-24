import { Tooltip } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import usePath from "../../hooks/usePath";
import { CgFormatSlash } from "react-icons/cg";

const MyPath = ({
    singleUser,
    campaignDetails
}) => {
    const path = usePath();
    return <>
        <div className="flex justify-start items-center gap-x-0.5">
            <Tooltip title="Home" placement="bottom">
                <Link to={"/dashboard"}>
                    <h2 className="hover:text-blue-700 cursor-pointer text-[17px] hover:underline hover:underline-offset-4 hover:decoration-[2px]">{singleUser?.firstName + (singleUser?.lastName ? ` ${singleUser?.lastName}` : "")}</h2>
                </Link>
            </Tooltip>
            {
                path.location.pathname.match("campaigns") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="Campaign" placement="bottom">
                        <Link to={"/campaigns/campaigndetails"}>
                            <h2 className="hover:text-blue-700 hover:underline text-[17px] cursor-pointer hover:underline-offset-4 hover:decoration-[2px]">{campaignDetails?.name}</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("reports") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="View Reports" placement="bottom">
                        <Link to={"/campaigns/campaigndetails"}>
                            <h2 className="hover:text-blue-700 hover:underline text-[17px] cursor-pointer hover:underline-offset-4 hover:decoration-[2px]">Reports</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("/email/categories") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="Email Categories" placement="bottom">
                        <Link to={"/campaigns/campaigndetails/email/categories"}>
                            <h2 className="hover:text-blue-700 hover:underline flex text-[17px] justify-start gap-x-0.5 items-center cursor-pointer hover:underline-offset-4 hover:decoration-[2px]">Email <CgFormatSlash size={20} /> Categories</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("/email/bulkemail") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="Bulk Email" placement="bottom">
                        <Link to={"/campaigns/campaigndetails/email/bulkemail"}>
                            <h2 className="hover:text-blue-700 hover:underline flex text-[17px] justify-start gap-x-0.5 items-center cursor-pointer hover:underline-offset-4 hover:decoration-[2px]">Email <CgFormatSlash size={20} /> BulkEmail</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("/sms/categories") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="SMS Email" placement="bottom">
                        <Link to={"/campaigns/sms/categories"}>
                            <h2 className="hover:text-blue-700 hover:underline flex text-[17px] justify-start gap-x-0.5 items-center cursor-pointer hover:underline-offset-4 hover:decoration-[2px]">SMS <CgFormatSlash size={20} /> Categories</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("/sms/application") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="SMS Email" placement="bottom">
                        <Link to={"/campaigns/sms/application"}>
                            <h2 className="hover:text-blue-700 hover:underline flex text-[17px] justify-start gap-x-0.5 items-center cursor-pointer hover:underline-offset-4 hover:decoration-[2px]">SMS <CgFormatSlash size={20} /> Application</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("whatsapp") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="Whatsapp" placement="bottom">
                        <Link to={"/campaigns/campaigndetails/whatsapp"}>
                            <h2 className="hover:text-blue-700 hover:underline cursor-pointer text-[17px] hover:underline-offset-4 hover:decoration-[2px]">Whatsapp</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("documenttemplates") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="View Templates" placement="bottom">
                        <Link to={"/campaigns/documenttemplates"}>
                            <h2 className="hover:text-blue-700 hover:underline cursor-pointer text-[17px] hover:underline-offset-4 hover:decoration-[2px]">Document Templates</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
            {
                path.location.pathname.match("tools") ? <>
                    <CgFormatSlash size={20} />
                    <Tooltip title="Tools" placement="bottom">
                        <Link to={"/tools"}>
                            <h2 className="hover:text-blue-700 hover:underline cursor-pointer text-[17px] hover:underline-offset-4 hover:decoration-[2px]">Tools</h2>
                        </Link>
                    </Tooltip>
                </> : null
            }
        </div>
    </>
}

export default MyPath;