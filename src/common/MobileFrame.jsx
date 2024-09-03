import React, { useMemo } from "react";
import getCurrentTime from "../functions/getCurrentTime";

import { FaBatteryThreeQuarters } from "react-icons/fa6";
import { GiNetworkBars } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa6";
import { TiDownloadOutline } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdMarkEmailUnread } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { LuCornerUpLeft } from "react-icons/lu";

import pdfImage from "../assets/pdfImage.png";

const MobileFrame = ({ text = "" }) => {
    const currentTime = useMemo(() => {
        return getCurrentTime();
    }, []);

    return <>
        <div className="flex flex-col justify-start w-[200px] h-auto border-2 text-[#FFFFFF] border-solid border-[#0f172a] shadow-md bg-slate-900 rounded-md">
            <nav className="flex justify-between w-full py-1 px-2">
                <span className="text-[12px] font-semibold">{currentTime}</span>
                <div className="flex justify-center mt-0.5 gap-x-1.5">
                    <GiNetworkBars size={12} className="mt-0.5" />
                    <FaBatteryThreeQuarters size={18} />
                </div>
            </nav>
            <main className="flex text-[#FFFFFF] px-2 py-1.5 flex-col">
                <div className="flex justify-between">
                    <FaArrowLeft size={13} />
                    <div className="flex justify-center gap-x-1.5">
                        <TiDownloadOutline size={13} />
                        <RiDeleteBin6Line size={14} />
                        <MdMarkEmailUnread size={14} />
                        <BsThreeDotsVertical size={14} />
                    </div>
                </div>
                <div className="flex items-center my-3 justify-between">
                    <div className="flex justify-center gap-x-2">
                        <div className="bg-green-700 rounded-full p-1 text-white text-[13px] w-6 h-6 flex justify-center items-center">k</div>
                        <div className="flex flex-col justify-start gap-y-0">
                            <p className="font-poppins not-italic my-0 leading-normal font-semibold text-[10px]">Koncept Law Associates</p>
                            <div className="flex justify-start gap-x-1 text-[#ffffffb7] my-0 -mt-1">
                                <p className="font-poppins not-italic leading-normal font-semibold text-[10px]">to me</p>
                                <IoIosArrowDown size={12} className="mt-[2.8px]" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-x-1">
                        <MdOutlineEmojiEmotions size={12} className="text-[#ffffffb7]" />
                        <LuCornerUpLeft size={12} />
                        <BsThreeDotsVertical size={12} />
                    </div>
                </div>
                <div className="my-1 flex items-center font-poppins not-italic text-start leading-normal text-[#FFFFFF] text-[11px] font-medium gap-y-1 justify-start">
                    {text}
                </div>
                <div className="my-1 flex flex-col font-poppins not-italic leading-normal text-[#FFFFFF] text-[11px] font-medium gap-y-1 justify-start">
                    <span>Dear Ambika Mam,</span>
                    <span className="text-[10px]">Please find the attached document below.</span>
                    <span className="text-[10px]">Thank You!</span>
                </div>
                <a href="https://koncept-law.s3.ap-south-1.amazonaws.com/mainMerged/emiwithdidid/66bb9257e105680d03e991dd/458280174.pdf" target="_blank" className="my-1 w-full">
                    <img src={pdfImage} alt="pdf/image" className="w-full rounded-md" />
                </a>
            </main>
        </div>
    </>
}

export default MobileFrame;