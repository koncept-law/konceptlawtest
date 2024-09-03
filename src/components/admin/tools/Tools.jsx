import { Button } from "@material-tailwind/react";
import React, { useRef, useState } from "react";

import { RiFileExcel2Fill } from "react-icons/ri"; // book
import { SiConvertio } from "react-icons/si"; // convert
import { MdRocketLaunch } from "react-icons/md"; // rocket
import { FaTools } from "react-icons/fa";
import { RiBracesFill } from "react-icons/ri";
import { RxDoubleArrowRight } from "react-icons/rx";
import { RxDoubleArrowLeft } from "react-icons/rx";
import MergeBook from "./MergeBook";
import Converter from "./Converter";
import DynamicMerge from "./DynamicMerge";
import UploadFolder from "../../../common/fields/UploadFolder";

const Tools = () => {
    const [openMerge, setOpenMerge] = useState(false);
    const [openConverter, setOpenConverter] = useState(false);
    const [openDynamice, setOpenDynamice] = useState(false);

    const folderRef = useRef(null);

    const filesNameChange = (folders) => {
        // Simulate event data
        const updatedFolders = folders.map((folder, index) => ({
            ...folder,
            name: `${index + 1}` // Example renaming logic
        }));

        console.log(updatedFolders); // Log the new array with updated folder names

        // setFolders(updatedFolders); // Update state with new folder names
    };

    return <>
        <MergeBook open={openMerge} setOpen={setOpenMerge} />
        <Converter open={openConverter} setOpen={setOpenConverter} />
        <DynamicMerge open={openDynamice} setOpen={setOpenDynamice}  />

        <div className="flex flex-col w-full justify-center px-4 items-center">
            <h2 className="font-semibold font-poppins not-italic leading-normal flex gap-x-3 justify-start items-center text-slate-800 text-3xl text-start w-full">
                <FaTools size={22} />
                <span className="text-purple-800">Tools</span>
            </h2>
            <div className="w-full flex justify-start items-center my-3 gap-x-4">
                <Button className="text-white bg-blue-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={()=> setOpenMerge(true)}>
                    <RiFileExcel2Fill size={30} />
                    <span>Merge Book</span>
                </Button>

                <Button className="text-white bg-green-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={() => setOpenConverter(true)}>
                    <SiConvertio size={30} />
                    <div className="flex justify-center gap-x-1 items-center">
                        <span>Convert</span>
                        <div className="flex justify-center items-center gap-x-0.5">
                            <RxDoubleArrowLeft size={15} />
                            <RxDoubleArrowRight size={15} />
                        </div>
                        <span className="lowercase">to</span>
                        <RiBracesFill size={16} />
                    </div>
                </Button>
                
                <Button className="text-white bg-purple-700 font-poppins not-italic leading-normal capitalize py-4 px-8 font-semibold flex flex-col justify-center items-center gap-y-2" onClick={()=> setOpenDynamice(true)}>
                    <MdRocketLaunch size={30} />
                    <span>Dynamic Merge</span>
                </Button>

                {/* <UploadFolder folderRef={folderRef} onChange={filesNameChange} /> */}
            </div>
        </div>
    </>
}

export default Tools;