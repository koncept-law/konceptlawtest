import { Button } from "@material-tailwind/react";
import { Tooltip, Menu, Dropdown, Progress } from "antd";
import React, { useState, useEffect } from "react";
import { IoFileTrayStackedOutline } from "react-icons/io5";
import { LuUploadCloud } from "react-icons/lu";
import { MdOutlineFileOpen } from "react-icons/md";

const Uploader = ({
    progress = 0,
    progressTitle = "",
    upload = false,
    isOpen = false,
}) => {
    // Manage dropdown visibility state
    const [visible, setVisible] = useState(isOpen);

    // Sync state with isOpen prop
    useEffect(() => {
        setVisible(isOpen);
    }, [isOpen]);

    // Define menu items for the dropdown
    const menu = (
        <Menu className="w-[350px]">
            <div className="p-3 main-text flex flex-col justify-start items-start gap-y-1">
                <div className="text-[16px] font-medium flex justify-start items-center gap-x-2">
                    <MdOutlineFileOpen size={18} />
                    <span>Upload and Download Files</span>
                </div>
                <div className="flex justify-center w-full text-gray-600 items-center py-3">
                    {upload ? (
                        <div className="w-full">
                            <h2 className="text-black font-medium">{progressTitle}</h2>
                            <Progress className=" w-full" percent={progress} />
                        </div>
                    ) : (
                        <IoFileTrayStackedOutline size={30} />
                    )}
                </div>
            </div>
        </Menu>
    );

    return (
        <div className="fixed bottom-4 text-white right-4">
            <Tooltip title="Upload/Download" placement="top">
                <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    visible={visible}
                    onVisibleChange={(flag) => setVisible(flag)} // Toggle visibility state
                >
                    <Button className="rounded-full p-3 bg-blue-700">
                        <LuUploadCloud size={25} />
                    </Button>
                </Dropdown>
            </Tooltip>
        </div>
    );
};

export default Uploader;
