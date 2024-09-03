import React from "react";

// icons
import { FaRegFolderOpen } from "react-icons/fa"; // folder

const FolderViewer = ({ folders = [], selected="", selectFolder=function(){} }) => {
    
    return <>
        <div className="h-full w-full overflow-y-scroll">
            {
                folders?.length > 0 ? folders?.map((item, index) => (
                    <div key={index} className={`flex justify-start items-center text-[#000] py-2 gap-x-2 px-3 ${selected === item ? "bg-[#42cae88d]": "hover:bg-[#42cae834]"} w-full cursor-pointer`} onClick={()=> selectFolder(item)}>
                        <FaRegFolderOpen size={"18px"} />
                        <span>{item}</span>
                    </div>
                )): <h2 className="my-4 font-poppins not-italic leading-normal font-semibold text-slate-700">Folder not Available</h2>
            }
        </div>
    </>
}

export default FolderViewer;