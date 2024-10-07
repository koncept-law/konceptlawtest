import React from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";

import { MdDeleteOutline } from "react-icons/md";
import { Button } from "@material-tailwind/react";

import { MdOutlineLockReset } from "react-icons/md";

const ResetModal = ({ open = false, setOpen = function(){}, title="", resetEvent = function(){} }) => {
    const handleCancel = () => setOpen(!open);

    return (
        <>
            <Modal
                open={open}
                onCancel={handleCancel}
                centered
                footer={[]}
                closable={false}
            >
                <div className="flex bg-white flex-col w-full">
                    <div className="px-3 py-3 text-[#000000] w-full flex justify-end items-center">
                        <button className="cursor-pointer active:text-red-700 transition-all" onClick={handleCancel}>
                            <RxCross2 size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col text-slate-700 justify-center items-center">
                        <MdOutlineLockReset size={70} />
                        <h2 className="text-lg font-poppins not-italic leading-normal my-2 font-semibold">{title !== "" ? title: "Do You Want to Reset This Campaign?"}</h2>
                        <div className="w-full flex justify-end items-center gap-x-2 py-2 px-4">
                            <Button className="font-poppins not-italic py-2 shadow-sm px-4 leading-normal capitalize border border-solid rounded-md bg-gray-50 text-[#000000]" onClick={handleCancel}>
                                No
                            </Button>

                            <Button className="font-poppins not-italic font-medium py-2 px-4 leading-normal rounded-md capitalize bg-red-700 text-[#FFFFFF]" onClick={()=> {
                                resetEvent(true);
                                handleCancel();
                            }}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ResetModal;
