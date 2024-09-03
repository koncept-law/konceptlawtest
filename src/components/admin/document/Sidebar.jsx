import React, { useEffect, useState } from "react";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { setMiscellaneous } from "../../../redux/features/miscellaneous";

const Sidebar = ({
  toggle,
  folderList,
  pending,
  toggleFilterModal,
  userRoleHandler,
}) => {
  const { user, userList } = useSelector((state) => state.user);
  const filterTemplateHandler = () => {
    const workbook = XLSX.utils.book_new();

    const data = [["FILTER"]];

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Filter Template.xlsx";
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
  };

  const [rootFolderOpen, setRootFolderOpen] = useState(null);

  const handleRootFolderToggle = (index) => {
    setRootFolderOpen((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="p-2">
      <div className=" space-y-3">
        <div
          onClick={filterTemplateHandler}
          className="w-full p-2 rounded buttonBackground"
        >
          <button className=" text-lg font-bold text-center text-white w-full">
            Download Filter Template
          </button>
        </div>

        <div
          onClick={toggleFilterModal}
          className="w-full p-2 rounded buttonBackground"
        >
          <button className=" text-lg font-bold text-center text-white w-full">
            Filter
          </button>
        </div>

        {user?.profile === "superAdmin" && (
          <div className=" flex flex-col gap-2 rounded">
            <label htmlFor="" className=" font-semibold text-white">
              Select User Role :
            </label>
            <select
              name=""
              id=""
              className=" border-2 rounded p-2 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={userRoleHandler}
            >
              <option value="">Select User Role</option>
              {userList &&
                userList.map((item, index) => (
                  <option
                    value={item.profile}
                    key={index}
                    className="capitalize"
                  >
                    {item.profile === "superAdmin" ? "bank" : item.profile}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div onClick={toggle} className="w-full p-2 rounded buttonBackground">
          <button
            disabled={pending}
            className=" rounded text-white text-lg font-bold hover:bg-transparenttransition-all duration-300 w-full"
          >
            Upload
          </button>
        </div>
      </div>

      <div className="py-2  overflow-hidden ">
        {!pending ? (
          folderList ? (
            folderList.map((folderItem, index) => (
              <RootFolder
                key={index}
                folderItem={folderItem}
                onRootToggle={() => handleRootFolderToggle(index)}
                isRootOpen={index === rootFolderOpen}
              />
            ))
          ) : (
            <div>
              <span className=" text-white">No Folder Found</span>
            </div>
          )
        ) : (
          <div className="w-full text-white py-6 text-center">Loading...</div>
        )}
      </div>
    </div>
  );
};

const RootFolder = ({ folderItem, onRootToggle, isRootOpen }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const dispatch = useDispatch();
  const { documentSidebar } = useSelector((state) => state.miscellaneous);

  const handleToggle = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
    dispatch(setMiscellaneous({ documentSidebar: !documentSidebar }));
  };

  return (
    <>
      <div
        className=" flex items-center gap-2 cursor-pointer"
        onClick={onRootToggle}
      >
        <span className="text-lg text-white">
          <IoIosArrowUp
            className={` transition-all ease-out duration-500 ${
              isRootOpen ? "rotate-180" : "rotate-90"
            }`}
          />
        </span>
        <span className=" text-blue-600 text-2xl">
          <FaFolder />
        </span>
        <span className=" text-lg  text-white hover:text-black transition-all duration-200 capitalize">
          {folderItem?.profile === "superAdmin" ? "Bank" : folderItem?.profile}
        </span>
      </div>

      {isRootOpen && (
        <div className=" ml-6">
          {folderItem?.folders.map((subFolder, index) => (
            <FolderList
              key={index}
              folderItem={subFolder}
              profile={folderItem?.profile}
              isOpen={index === openIndex}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      )}
    </>
  );
};

const FolderList = ({ folderItem, isOpen, onToggle, profile }) => {
  const {
    selectFolderHandler,
    displayDataHandler,
    folderData,
    pendingFile,
    GetFolderFiles,
    folderDataHandler,
  } = useTableDataContext();

  const SelectFolderHandler = (data) => {
    if (isOpen) {
      selectFolderHandler(null);
      displayDataHandler(null);
      folderDataHandler(null);
    } else {
      selectFolderHandler(data);
      GetFolderFiles(data);
    }
    onToggle();
  };

  return (
    <>
      <div
        className=" flex items-center gap-2 cursor-pointer"
        onClick={() => SelectFolderHandler(folderItem)}
      >
        <span className="text-lg text-white">
          <IoIosArrowUp
            className={` transition-all ease-out duration-500 ${
              isOpen ? "rotate-180" : " rotate-90"
            }`}
          />
        </span>
        <span className=" text-blue-600 text-2xl">
          <FaFolder />
        </span>
        <span className=" text-lg  text-white hover:text-black transition-all duration-200">
          {profile !== "bank"
            ? folderItem.replace(`${profile}/`, "")
            : folderItem}
        </span>
      </div>

      <DocumentList
        pending={pendingFile}
        folderOpen={isOpen}
        folderData={folderData}
      />
    </>
  );
};

const DocumentList = ({ pending, folderOpen, folderData }) => {
  return (
    <div className=" transition-all duration-300">
      {folderOpen && (
        <div className=" ml-6 my-1 transition-all duration-300">
          {!pending ? (
            folderData && folderData.length > 0 ? (
              folderData?.map((doc, index) => {
                return (
                  <div
                    key={index}
                    className=" flex gap-2 cursor-pointer group "
                  >
                    <span className=" text-blue-500 text-xl mt-1">
                      <FaFileAlt />
                    </span>
                    <span
                      className="line-clamp-1 text-white group-hover:text-black transition-all duration-300"
                      style={{
                        wordSpacing: "-0.5px",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {doc.name}
                    </span>
                  </div>
                );
              })
            ) : (
              <>
                <p className=" text-white text-center">No Data Found</p>
              </>
            )
          ) : (
            <>
              <p className=" text-white text-center">Loading..</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
