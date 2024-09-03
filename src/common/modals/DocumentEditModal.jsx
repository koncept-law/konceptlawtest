import React, { useRef, useState } from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";

import { MdOutlineUploadFile } from "react-icons/md";
import { Button } from "@material-tailwind/react";
import { AiFillEdit } from "react-icons/ai";
import { toastify } from "../../components/toast";

const DocumentEditModal = ({ 
    open = false, 
    setOpen = function(){},
    handleEditEvent = function(){},
}) => {
    const handleClose = () => setOpen(!open);
    const fileRef = useRef(null);
    const [FileName, setFileName] = useState("");
    const [FileData, setFileData] = useState(null);

    const clickEvent = () => {
        fileRef.current.click();
    }

    const SelectEvent = (e) => {
        let file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            setFileData(file);
        } else {
            setFileName("");
            fileRef.current.value = "";
        }
        // console.log(file);
    }

    const EditEvent = () => {
        if(FileData){
            // console.log("edit file:", FileData);
            handleEditEvent(FileData);
            setFileData(null);
            setFileName("");
            fileRef.current.value = "";
        }else {
            toastify({ msg: "Error: No file selected. Please select a file to continue.", type: "error" });
        }
    }

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={[]}
            centered
            closable={false}
        >
            <div className="w-full flex flex-col">
                <div className="flex justify-between text-[#FFFFFF] bg-[#000000] items-center py-3 px-4">
                    <div className="flex justify-center items-center gap-x-2">
                        <AiFillEdit size={17} />
                        <h2 className="font-poppins not-italic leading-normal font-medium text-[15px]">Edit Template</h2>
                    </div>
                    <button className="cursor-pointer active:text-red-700 transition-all" onClick={handleClose}>
                        <RxCross2 size={20} />
                    </button>
                </div>

                <div className="bg-white w-full px-2 ">
                    <div className="border flex-col py-10 mt-4 rounded-md cursor-pointer gap-y-1 flex text-slate-700 justify-center items-center border-dotted border-slate-700 w-full" onClick={clickEvent}>
                        <MdOutlineUploadFile size={55} />
                        <h2 className="font-poppins not-italic leading-normal text-slate-700 text-lg font-semibold">{FileName !== "" ? FileName : "Upload File"}</h2>
                    </div>

                    <div className="w-full flex justify-end gap-x-2 items-center py-2">
                        <Button className="py-2 px-4 bg-green-700 text-white rounded-md shadow-sm hover:shadow-none font-poppins capitalize font-medium leading-normal not-italic" onClick={EditEvent}>
                            Edit
                        </Button>
                        <Button className="py-2 px-4 bg-gray-100 text-[#000000] border border-solid border-gray-300 rounded-md shadow-sm hover:shadow-none font-poppins capitalize font-medium leading-normal not-italic" onClick={()=> {
                            fileRef.current.value = "";
                            setFileName("");
                            setFileData(null);
                        }}>
                            Reset
                        </Button>
                        <Button className="py-2 px-4 bg-blue-700 text-[#FFFFFF] border border-solid rounded-md shadow-sm hover:shadow-none font-poppins capitalize font-medium leading-normal not-italic" onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                </div>

                <input ref={fileRef} type="file" className="hidden" onChange={SelectEvent} />
            </div>
        </Modal>
    );
};

export default DocumentEditModal;
