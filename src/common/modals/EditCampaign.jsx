import React, { useRef, useState } from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { editCampaignThunkMiddleware } from "../../redux/features/campaigns";

const EditCampaign = ({ visible = false, onClose = function(){}, data = null }) => {
    const  { singleUser } = useSelector(state => state.campaigns);
    const [EditValue, setEditValue] = useState("");
    const inpRef = useRef(null);
    const dispatch = useDispatch();

    const handleSubmitEdits = () => {
        // console.log({ campaignId: data?._id, campaignName: EditValue, accountId: singleUser?.accountId });
        if(EditValue !== ""){
            dispatch(editCampaignThunkMiddleware({ campaignId: data?._id, campaignName: EditValue, accountId: singleUser?.accountId }));
            inpRef.current.value = "";
            onClose(false)
        }else {
            inpRef.current.style.borderColor = "red";
        }
    }

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            centered
            closable={false}
            footer={[]}
        >
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex w-full justify-between items-center px-3 py-2">
                    <h2 className="text-lg font-semibold font-poppins not-italic leading-normal text-[#000]">Update Campaign</h2>
                    <button className="cursor-pointer border border-solid shadow-md rounded-md text-[#000] p-2" onClick={onClose}>
                        <RxCross2 size={"18px"} />
                    </button>
                </div>

                <div className="w-full h-[1px] bg-slate-400 my-1"></div>

                <div className="flex justify-center my-6 gap-x-2 items-center w-full">
                    <label htmlFor="campaignName" className="not-italic leading-normal font-poppins font-semibold text-[15px] text-[#000]">Campaign Name:</label>
                    <input ref={inpRef} type="text" placeholder="Campaign Name" id="campaignName" name="campaignName" className="outline-none rounded-md px-2 py-1 w-1/2 text-[15px] not-italic leading-normal font-poppins font-medium text-[#000] border border-solid" onChange={(e)=>setEditValue(e.target.value)} />
                </div>

                <div className="w-full h-[1px] bg-slate-400 my-1"></div>

                <div className="flex justify-end p-3 items-center w-full gap-x-2">
                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-800 capitalize py-2 px-3 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center gap-x-1.5" onClick={handleSubmitEdits}>
                        <span className="w-full text-center">Upload</span>
                    </Button>

                    <Button className="font-poppins not-italic leading-normal text-white font-medium bg-slate-700 capitalize py-2 px-3 rounded-md shadow-sm hover:shadow-sm flex justify-center items-center gap-x-1.5" onClick={onClose}>
                        <span className="w-full text-center">Cancel</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditCampaign;
