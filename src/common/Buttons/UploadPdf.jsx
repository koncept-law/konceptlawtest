import React, { useState } from "react"
import { Button } from "@material-tailwind/react";
import { FaFilePdf } from "react-icons/fa6"; // pdf
import { toast } from "react-toastify";

const UploadPdf = ({ onClick=function(){} }) => {
    const [active, setActive] = useState(false);

    return <Button className={`text-white capitalize font-poppins not-italic leading-normal text-[15px] flex justify-center items-center gap-x-2 ${active ? "bg-green-600": "bg-slate-600"} font-medium py-1 h-fit px-3 rounded-sm`} onClick={()=> {
        setActive(!active);
        if(active){
            toast.error("PDF Selection Cancelled", {position:"bottom-right", autoClose: 1000});
        }else {
            toast.success("PDF Selection Confirmed", {position:"bottom-right", autoClose: 1000});
        }
        onClick(!active);
    }}>
        <FaFilePdf size={"16px"} />
        <span>Upload PDF</span>
    </Button>
}

export default UploadPdf;