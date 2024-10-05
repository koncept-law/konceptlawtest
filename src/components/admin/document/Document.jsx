import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UploadModal from "./UploadModal";
import DocumentTable from "./DocumentTable";
import FilterModal from "./FilterModal";
import { useNavigate } from "react-router-dom";
import { toastify } from "../../toast";
import axios from "axios";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunkMiddleware } from "../../../redux/features/user";

const Document = () => {
  const dispatch = useDispatch();
  const { documentSidebar } = useSelector((state) => state.miscellaneous);
  const { refressData: contextRefress } = useTableDataContext();
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [pending, setPending] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [userRole, selectUserRole] = useState(null);
  const [refressData, setRefressData] = useState(false);

  const toggle = () => {
    if (user?.profile === "superAdmin" && !userRole) {
      return toastify({ msg: "Please Select User", type: "error" });
    }
    setModal((prev) => !prev);
  };

  const [filterModal, setFilterModal] = useState(false);
  const toggleFilterModal = () => {
    setFilterModal((prev) => !prev);
  };

  const userRoleHandler = (e) => {
    selectUserRole(e.target.value);
  };

  const groupFoldersByProfile = async (folders) => {
    const groupedFolders = [];
    const tempMap = new Map();

    await folders.forEach((folder) => {
      const profile = folder.profile || "superAdmin"; // Handle folders without profile
      if (!tempMap.has(profile)) {
        tempMap.set(profile, []);
      }
      // if(profile === "superAdmin" && !folder.profile){
      //   tempMap.get(profile).push(folder.folderName);
      // }
      tempMap.get(profile).push(folder.folderName);
    });

    // console.log("temp before grouping" , tempMap)
    for (const [profile, folders] of tempMap.entries()) {
      groupedFolders.push({ profile, folders });
    }

    return groupedFolders;
  };

  const getFolderList = async () => {
    try {
      setPending(true);
      const response = await axios.get(`t.kcptl.in/api/foldersName`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
        },
        credentials: "include",
      });

      if (response?.status === 200) {
        const data = response.data;
        // console.log( "folders list" , response.data);
        const grpData = await groupFoldersByProfile(data);
        setFolderList(grpData);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403) {
        dispatch(logoutThunkMiddleware());
      } else if (error.response?.data) {
        toastify({ msg: error.response.data.message, type: "error" });
        // toastify({ msg: error.response.data, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    getFolderList();
  }, [contextRefress]);

  // console.log("folder list in document tab" , folderList)

  return (
    <>
      <div className="h-[94vh] w-full overflow-y-auto px-6 py-4 flex md:gap-4">
        {/* Sidebar  */}
        <div className="sticky z-10 ">
          <div
            className={`absolute h-full md:sticky w-[16rem] sidebarBackground rounded-lg overflow-scroll ${
              documentSidebar ? " translate-x-0" : "translate-x-[-110%]"
            }  md:translate-x-0 transition-all duration-300`}
          >
            <Sidebar
              toggle={toggle}
              folderList={folderList}
              pending={pending}
              toggleFilterModal={toggleFilterModal}
              userRoleHandler={userRoleHandler}
            />
          </div>
        </div>

        {/* Document Table  */}
        <div className=" w-full md:flex-1 px-4 py-2 overflow-y-scroll bg-white rounded-lg">
          <DocumentTable setRefressData={setRefressData} />
        </div>
      </div>

      {/* Upload Document Modal  */}
      <UploadModal
        modal={modal}
        toggle={toggle}
        folderList={folderList}
        setRefressData={setRefressData}
        userRole={userRole}
      />

      <FilterModal
        filterModal={filterModal}
        toggleFilterModal={toggleFilterModal}
      />
    </>
  );
};

export default Document;
