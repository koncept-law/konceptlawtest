import React, { useEffect, useState } from "react";
import { IoCloudDone } from "react-icons/io5";
import { MdOutlineDateRange, MdModeEditOutline, MdDelete, MdDeleteOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import EditCampaign from "../modals/EditCampaign";
import { useDispatch, useSelector } from "react-redux";
import { deleteCampaigns, getCampaignByNameThunkMiddleware, setCampaigns } from "../../redux/features/campaigns";
import { useNavigate } from "react-router-dom";
import ConfirmMessage from "../../components/common/ConfirmMessage";
import moment from "moment/moment";
import { getNotificationThunkMiddleware } from "../../redux/features/notification";

const DetailsCard = ({ data = null, active = false }) => {
    const { user } = useSelector(state => state.user);
    const permission = (user?.email === "hdfc" ? false : true);

    const { singleUser, allCampaigns, campaignDetails } = useSelector(state => state.campaigns);
    // console.log("detailsCard in singleuser", singleUser);
    const [isHovered, setIsHovered] = useState(false);
    const [isOpenUpdateCampaing, setIsOpenUpdateCampaing] = useState(false);
    const [DeleteMode, setDeleteMode] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedRow, setSelectedRow] = useState(false);

    useEffect(()=>{
        if(DeleteMode){
            dispatch(setCampaigns({ campaignDetails: [...allCampaigns].reverse()[0] }));
            setDeleteMode(false);
        }
    }, [allCampaigns]);

    const selectCampagin = () => {
        dispatch(
            getCampaignByNameThunkMiddleware(
                {
                    campaignName: data?.name,
                }
            )
        );
        dispatch(getNotificationThunkMiddleware(campaignDetails?.name));
    }

    const handleDeleteCampaign = (id) => {
        const singleUserArr = []
        singleUserArr.push(id);
        dispatch(deleteCampaigns({ userId: singleUserArr, accountId: singleUser.accountId }, (call)=> {
            if(call){
                setDeleteMode(true);
            }
        }));
    }

    const openDocument = () => {
        if (data) {
            dispatch(
                getCampaignByNameThunkMiddleware(
                    {
                        campaignName: data?.name,
                    },
                    (error) => {
                        if(!error){
                            navigate("/campaigns/campaigndetails");
                        }
                    }
                )
            );
        }
    }

    // console.log("Campaign Data", data);

    return <>
        <EditCampaign visible={isOpenUpdateCampaing} data={data} onClose={() => setIsOpenUpdateCampaing(false)} />
        {
            selectedRow ? <>
                < ConfirmMessage yes="Yes, I am sure" deleteBtn={true} saveOrsend="" className="flex-col" no="No, I'm not sure!" value={(e) => {
                    if (e) {
                        // e.preventDefault();
                        if (data?._id) {
                            handleDeleteCampaign(data?._id)
                        }
                    }
                    setSelectedRow(false);
                }}>
                    <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
                    <h2 className="text-lg w-full text-center text-slate-700 font-normal">Do You Want to Delete This Campaign?<br />
                        <span className="font-semibold text-lg capitalize">
                            {data?.name}
                        </span>
                    </h2>
                </ConfirmMessage >
            </> : null
        }

        <div
            className={`w-full p-1 rounded-md flex my-2 flex-col shadow-md shadow-slate-200 cursor-pointer justify-start items-start bg-white border border-solid transition-all duration-300 ${isHovered ? 'border-blue-600' : ''} ${active ? 'border-blue-600' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={selectCampagin}
        >
            <div className="w-full flex justify-start relative items-center px-1">
                <h2 className="font-medium not-italic leading-normal text-start my-1 font-poppins text-[16px]">{data?.name}</h2>
                {/* <div className={`flex justify-center absolute top-0 right-0 overflow-hidden transition-all ${isHovered ? 'h-full' : 'h-0'} items-center gap-x-2`}> */}
                <div className={`flex justify-center absolute top-0 right-0 overflow-hidden transition-all ${true ? 'h-full' : 'h-0'} items-center gap-x-2`}>
                    {/* {
                        permission ? <>
                            <button className="p-1 rounded-3xl cursor-pointer bg-blue-600 text-white" onClick={() => setIsOpenUpdateCampaing(true)}>
                                <MdModeEditOutline size={"15px"} />
                            </button>
                        </> : null
                    } */}

                    <button className="p-1 rounded-3xl cursor-pointer bg-green-600 text-white" onClick={openDocument}>
                        <GoEye size={"15px"} />
                    </button>

                    {
                        permission ? <>
                            <button className="p-1 rounded-3xl cursor-pointer bg-red-600 text-white" onClick={() => setSelectedRow(true)}>
                                <MdDelete size={"15px"} />
                            </button>
                        </> : null
                    }
                </div>
            </div>
            <h2 className="h-[1px] w-full bg-gray-400 my-2"></h2>
            <div className="grid grid-cols-2 gap-x-4 w-full px-2 my-1.5">
                <div className="flex justify-start items-center w-full text-[13px] font-poppins text-[#000000] not-italic leading-normal font-medium gap-x-2">
                    <FaUserCircle size={"18px"} className="text-blue-600" />
                    <span>{singleUser?.firstName + (singleUser?.lastName ? ` ${singleUser?.lastName}` : "")}</span>
                </div>
                <div className="flex justify-start items-center w-full text-[13px] font-poppins text-[#000000] not-italic leading-normal font-medium gap-x-2">
                    <MdOutlineDateRange size={"18px"} className="text-red-600" />
                    <span>{moment(data?.Date).format("YYYY-MM-DD - HH:mm:ss")}</span>
                </div>
            </div>
        </div>
    </>
}

export default DetailsCard;
