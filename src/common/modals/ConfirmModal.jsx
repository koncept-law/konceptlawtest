import React from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@material-tailwind/react";

import { IoCloudDoneSharp } from "react-icons/io5";

const ConfirmModal = ({ open = true, setOpen = function(){}, title = "", onConfirm=function(){} }) => {
    const handleCancle = () => setOpen(!open);

    return <>
        <Modal
            open={open}
            onCancel={handleCancle}
            centered
            closable={false}
            footer={null}
        >
            <div className="w-full">
                <div className="bg-gray-800 flex justify-between items-center px-4 py-3 text-white w-full">
                    <h2 className="font-poppins not-italic leading-normal font-light">Confirmation</h2>
                    <button className="cursor-pointer transition-all active:text-red-700" onClick={handleCancle}>
                        <RxCross2 size={18} />
                    </button>
                </div>

                <div className="bg-white w-full p-3">
                    <div className="my-3 flex justify-center items-center flex-col text-gray-800 w-full gap-y-3">
                        <IoCloudDoneSharp size={50} className="text-green-700" />
                        <h2 className="font-poppins not-italic text-center leading-normal">{title}</h2>
                    </div>
                    <div className="flex justify-end items-center w-full gap-x-2">
                        <Button className="bg-gray-100 shadow-md py-2 px-4 font-poppins capitalize not-italic leading-normal font-medium rounded-md hover:shadow-md text-[#000]" onClick={handleCancle}>
                            No
                        </Button>
                        <Button className="bg-green-700 shadow-md capitalize py-2 px-4 font-poppins not-italic leading-normal font-medium rounded-md hover:shadow-md text-[#FFF]" onClick={onConfirm}>
                            Yes
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    </>
}

export default ConfirmModal;