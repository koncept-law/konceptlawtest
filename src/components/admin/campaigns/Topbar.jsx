import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { IoReload } from "react-icons/io5";
import {
  filterCampaignFilesThunkMiddleware,
  getAllCampaignThunkMiddleware,
} from "../../../redux/features/campaigns";
import { useDispatch, useSelector } from "react-redux";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [searchValue, setSearchValue] = useState("");
  const { singleUser } = useSelector((state) => state.campaigns);

  useEffect(()=>{},[singleUser])
  // const refreshHandler = () => {
  //   dispatch(getAllCampaignThunkMiddleware({accountId : singleUser.accountId}));
  // };

  // const searchHandler = (e) => {
  //   e.preventDefault();
  //   dispatch(
  //     filterCampaignFilesThunkMiddleware({ fileName: searchValue }, () => {
  //       navigate("filterdata");
  //     })
  //   );
  // };

  return (
    <div className="flex items-center justify-between w-full h-fit py-2 gap-4 bg-white px-4 rounded-md flex-wrap">
      {/* <div className=" flex items-center flex-wrap gap-4">
        <h1 className="font-semibold text-xl">Campaigns</h1>

        <button
          onClick={toggle}
          className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoMdAdd size={26} />
          Add
        </button>

        <button
          onClick={refreshHandler}
          className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoReload size={26} />
        </button>
      </div> */}
      <div className=" flex items-center flex-wrap gap-4">
        <h1 className="capitalize font-semibold text-xl">User : {singleUser.firstName}&nbsp;&nbsp;{singleUser.lastName}</h1>
      </div>

      <div>
        <button onClick={(e) => {
          navigate("/campaigns/documenttemplates")
        }}
          className="flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >Document Templates</button>
      </div>

      {/* <form
        onSubmit={searchHandler}
        className=" sm:w-[25rem] flex items-center flex-wrap gap-4  rounded"
      >
        <input
          type="text"
          className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
          placeholder="Search Now"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button
          type="submit"
          className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoSearch size={26} /> Search
        </button>
      </form> */}
    </div>
  );
};

export default Topbar;
