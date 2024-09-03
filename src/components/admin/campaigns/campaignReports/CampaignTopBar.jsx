import React, { memo, useEffect } from 'react'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllCampaignReportsThunkMiddleware } from '../../../../redux/features/campaigns';

// hooks
import usePath from "../../../../hooks/usePath";

export const  CampaignTopBar = memo(({ 
  title = "", 
  // path="" 
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = usePath();
  const { campaignDetails , campaignReports } = useSelector((state) => state.campaigns);

  useEffect(() => { }, [campaignDetails , campaignReports]);
  // console.log(campaignDetails)

  const refreshHandler = () => {
    dispatch(
      getAllCampaignReportsThunkMiddleware({campaignName : campaignDetails.name})
    );
    // console.log(campaignDetails)
  };

  return (
    <div className="h-fit px-4 py-2 flex w-full justify-between bg-white rounded-md">
      <div className=" flex items-center gap-4">
        <button
          // onClick={() => navigate("/campaigns/campaigndetails")}
          // onClick={() => navigate(path !== "" ? path: -1)}
          onClick={() => path.back()}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoMdArrowRoundBack size={26} />
        </button>
        <h1 className=" text-xl font-semibold">{title}</h1>
      </div>
      <div>
        <button
          onClick={refreshHandler}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          Refresh
        </button>
      </div>
    </div>
  )
})

export default CampaignTopBar;
