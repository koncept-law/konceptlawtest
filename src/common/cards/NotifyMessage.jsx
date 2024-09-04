import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteNotification, deleteNotificationThunkMiddleware, getGlobalNotificationThunkMiddleware, getNotificationThunkMiddleware } from "../../redux/features/notification";
import moment from "moment";
import usePath from "../../hooks/usePath";

const NotifyMessage = ({ type = "error", message = "", time="", campaignName="", id = null }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showCross, setShowCross] = useState(false);
    const { campaignDetails } = useSelector(state => state.campaigns);
    const path = usePath();

    const onHover = () => setShowCross(!showCross);

    const deleteEvent = () => {
        if(id){
            dispatch(deleteNotificationThunkMiddleware({ id: id, name: campaignDetails?.name }, (call) => {
                if(call){
                    if(path.startsWith("campaigns")){
                        dispatch(getNotificationThunkMiddleware(campaignDetails?.name));
                    }else {
                        dispatch(getGlobalNotificationThunkMiddleware());
                    }
                }
            }));
        }
    }

    return <>
        <div className={`flex justify-center my-2 relative cursor-pointer py-3 w-full rounded-md border border-solid ${type !== "error" ? "border-green-500 bg-[#137c25b7]" : "border-red-500 bg-[#b91c1c73]"}`} 
        onMouseLeave={onHover}
        onMouseEnter={onHover}
        onClick={() => {
            // if(path !== ""){
            //     navigate(path);
            // }
        }}>
            <p className="bg-white px-1 cursor-pointer absolute -top-2.5 text-[12px] font-poppins not-italic leading-normal font-semibold left-2 rounded-sm text-[#000000]">{moment(time).format("MM-DD-YYYY: hh:mm:ss")}</p>
            <button className={`bg-white p-1 cursor-pointer absolute ${showCross ? "top-0.5" : "-top-2 hidden"} hover:bg-gray-100 active:bg-gray-200 transition-all right-0.5 rounded-sm text-[#000000]`} onClick={deleteEvent}>
                <RxCross2 size={15} />
            </button>
            <h2 className={`not-italic leading-normal text-center font-poppins font-medium ${type !== "error" ? "text-[#080808]" : "text-[#080808]"}`}>{campaignName}: {message}</h2>
        </div>
    </>
}

export default NotifyMessage;