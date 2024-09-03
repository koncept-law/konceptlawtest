import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CampaignTopBar from "./CampaignTopBar";

// changes by devankar
// import AllCampaignsSidebar from "./AllCampaignsSidebar.jsx";
import AllCampaignsSidebar from "./AllCampaignsSidebar1";
import { getAllCampaignReportsThunkMiddleware } from "../../../../redux/features/campaigns";
import Loader from "../../../common/Loader";
import CampaignReports from "./CampaignReports";
// import { getAllCampaignThunkMiddleware } from "../../../../redux/features/campaigns";
// import { gettingCampaignDetailsData } from "../../../../redux/features/campaigns";

const AllCampaignsData = () => {
  const dispatch = useDispatch();
  const { campaignDetails, campaignReports } = useSelector((state) => state.campaigns);
  useEffect(() => {
    dispatch(getAllCampaignReportsThunkMiddleware({ campaignName: campaignDetails?.name }))
  }, [dispatch , campaignDetails]);

  useEffect(() => {

  }, [campaignReports, campaignDetails]);

  return (
    <>
      {!campaignReports && <Loader />}

      <div className="h-fit w-full px-2 py-2 flex gap-2 md:gap-4 flex-col">
        {/* <button className="bg-blue-600 text-white">Refresh</button> */}
        <CampaignTopBar title={campaignDetails?.name} path="/campaigns/campaigndetails" />
        <div className="flex justify-start items-start w-full gap-2">
          <div className="w-full">
            {/* <button className="bg-gray-600 p-4 text-white" onClick={handleClick}>Click me</button> */}
            <AllCampaignsSidebar
              // data={campaignDetails}
              // countData={dummyCount}
              // refreshData={refreshCampaignData}
            />
            {/* <CampaignReports data={campaignDetails} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCampaignsData;
