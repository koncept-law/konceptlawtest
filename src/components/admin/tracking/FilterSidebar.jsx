import React, { useEffect, useState } from "react";
import { useTrackingTableDataContext } from "../../../common/context/TrackingTableDataContext";
import { toastify } from "../../toast";

const FilterSidebar = ({ toggle, pending, uploadProgressData }) => {
  const { DisplayTrackingDataHandler, trackingData } =
    useTrackingTableDataContext();

  const [edNumber, setEdNumber] = useState(null);

  const filterHandler = (e) => {
    e.preventDefault();
    if (!edNumber) {
      return toastify({
        msg: "Enter Ed Number",
        type: "error",
      });
    }

    const filterData = trackingData.filter((value) => {
      return value.ED === edNumber;
    });
    DisplayTrackingDataHandler(filterData);
  };

  function resetHandler(e) {
    e.preventDefault();
    document.getElementById("myForm").reset();
    DisplayTrackingDataHandler(trackingData);
  }

  const flag = uploadProgressData?.progress === uploadProgressData?.totalData;
  return (
    <div className="p-2">
      <div className="space-y-3">
        <div
          onClick={flag && toggle}
          className="w-full py-1 px-2 rounded buttonBackground"
        >
          <button
            disabled={pending}
            className=" text-lg font-bold text-center text-white w-full"
          >
            Upload
          </button>
        </div>

        <div className="  overflow-hidden ">
          <form className=" space-y-3" id="myForm">
            <div className=" flex flex-col gap-2 rounded">
              <label htmlFor="" className=" font-semibold text-white">
                ED Number :
              </label>
              <input
                type="text"
                placeholder="Enter ED Number"
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onChange={(e) => setEdNumber(e.target.value)}
              />
            </div>

            <div className=" flex items-center justify-between gap-10">
              <button
                onClick={filterHandler}
                className="p-2 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
              >
                Filter
              </button>
              <button
                onClick={resetHandler}
                className="p-2 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
