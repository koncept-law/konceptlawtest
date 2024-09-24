import React, { memo } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCampaignByNameThunkMiddleware, getCountInCampaignThunkMiddleware } from "../../../../redux/features/campaigns";
import usePath from "../../../../hooks/usePath";

const Topbar = memo(({ 
  // path="", 
  message = ""
}) => { 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = usePath();

  const { campaignDetails } = useSelector((state) => state.campaigns);

  const refreshHandler = () => {
    dispatch(
      getCampaignByNameThunkMiddleware({ campaignName: campaignDetails.name })
    );
    dispatch(getCountInCampaignThunkMiddleware(campaignDetails.name));
  };

  return (
    <div className=" flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-0 rounded-md">
      <div className=" flex items-center flex-wrap gap-4">
        {/* <button
          // onClick={() => navigate("/campaigns")}
          // onClick={()=> navigate(-1)}
          // onClick={()=> navigate(path !== "" ? `${path}`: -1)}
          onClick={() => path.back()}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoMdArrowRoundBack size={26} />
        </button>
        <h1 className=" font-semibold text-xl">{campaignDetails?.name}</h1> */}
      </div>
      <div className="flex justify-center items-center gap-x-2">
        { message ? message: "" }
        {/* <button
          onClick={refreshHandler}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          Refresh
        </button> */}
      </div>
    </div>
  );
});

export default Topbar;
