import React, { useEffect, useState } from "react";
import FilterSidebar from "./FilterSidebar";
import UploadModal from "./UploadModal";
import TrackingTable from "./TrackingTable";
import axios from "axios";
import { useSelector } from "react-redux";

const Tracking = () => {
  const { trackingSidebar } = useSelector((state) => state.miscellaneous);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal((prev) => !prev);

  const [refressData, setRefressData] = useState(false);
  const [uploadProgressData, setUploadProgressData] = useState(null);

  useEffect(() => {
    const getUploadStatus = async () => {
      try {
        const response = await axios.get("https://t.kcptl.in/api/progress");
        setUploadProgressData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUploadStatus();
  }, []);
  return (
    <>
      <div className="h-[94vh] overflow-y-auto  px-6 py-4 flex md:gap-4">
        {/* Sidebar  */}
        <div className=" h-full sticky z-10 ">
          <div
            className={`absolute h-full md:sticky w-[16rem] sidebarBackground rounded-lg overflow-scroll ${
              trackingSidebar ? " translate-x-0" : "translate-x-[-110%]"
            }  md:translate-x-0 transition-all duration-300`}
          >
            <FilterSidebar
              toggle={toggle}
              uploadProgressData={uploadProgressData}
            />
          </div>
        </div>

        {/* Document Table  */}
        <div className=" w-full md:flex-1 px-4 py-2 overflow-y-scroll bg-white rounded-lg ">
          <TrackingTable uploadProgressData={uploadProgressData} />
        </div>
      </div>

      {/* Upload Document Modal  */}
      <UploadModal
        modal={modal}
        toggle={toggle}
        setRefressData={setRefressData}
        setUploadProgressData={setUploadProgressData}
      />
    </>
  );
};

export default Tracking;
