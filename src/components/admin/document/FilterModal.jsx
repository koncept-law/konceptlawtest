import axios from "axios";
import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { toastify } from "../../toast";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FilterModal = ({ filterModal, toggleFilterModal }) => {
  const {
    displayDataHandler,
    setPendingHandler,
    pendingFile,
    selectFolderHandler,
  } = useTableDataContext();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const changeFileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    // Handle file change here if needed
  };

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  function clearInputField() {
    document.getElementById("myForm").reset();
  }

  const filterHandler = async (e) => {
    try {
      e.preventDefault();
      setPendingHandler(true);
      if (!selectedFile && !fileName) {
        return toastify({
          msg: "Please select a file or enter a file name",
          type: "error",
        });
      }

      const formData = new FormData();

      if (selectedFile) {
        formData.append("File", selectedFile);
      } else {
        formData.append("fileName", fileName);
      }

      if (["hdfc", "tracking"].includes(user?.profile)) {
        formData.append("rootFolder", user?.profile);
        const response = await axios.post(
          `t.kcptl.in/api/search`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "konceptLawToken"
              )}`,
            },
            credentials: "include",
          }
        );
        if (response.status === 200) {
          const data = await response.data;
          selectFolderHandler(null);
          if (data.length > 0) {
            displayDataHandler(data);
          } else {
            displayDataHandler(null);
          }

          toggleFilterModal();
          setFileName("");
          setSelectedFile(null);
        }
      } else {
        const response = await axios.post(
          `t.kcptl.in/api/search`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "konceptLawToken"
              )}`,
            },
            credentials: "include",
          }
        );

        const response1 = await axios.post(
          `t.kcptl.in/api/search`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "konceptLawToken"
              )}`,
            },
            credentials: "include",
          }
        );

        if (response.status === 200 && response1.status === 200) {
          selectFolderHandler(null);
          let filterData = [];

          const data = await response.data;
          const data1 = await response1.data;

          if (data.length > 0) {
            filterData = [...filterData, ...data];
          }
          if (data1.length > 0) {
            filterData = [...filterData, ...data1];
          }

          if (filterData.length > 0) {
            displayDataHandler(filterData);
          } else {
            displayDataHandler(null);
          }

          toggleFilterModal();
          setFileName("");
          setSelectedFile(null);
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      } else if (error.response?.data) {
        // toastify({ msg: error.response.data, type: "error" });
        toastify({ msg: error.response.data.message, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
      toggleFilterModal();
      setSelectedFile(null);
    } finally {
      clearFile();
      clearInputField();
      setPendingHandler(false);
    }
  };

  return (
    <>
      {/*Filter Document Model  */}
      <div
        className={` ${
          filterModal ? "fixed" : "hidden"
        } fixed top-0 left-0 w-[100%] h-[100%] z-40 flex  justify-center items-center`}
      >
        {/* OverLay  */}
        <div className="absolute w-[100%] h-[100%] bg-black opacity-25"></div>

        {/* Conetnt  */}
        <div className=" bg-white rounded-lg w-[90%] md:w-[60%]  p-2 absolute z-10  mt-10">
          {/* Model Header  */}
          <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
            <h1 className="text-white text-xl font-semibold">
              Filter Document
            </h1>
            <span
              className=" text-black text-xl cursor-pointer"
              onClick={toggleFilterModal}
            >
              <MdOutlineClose />
            </span>
          </div>

          {/* Modal Body  */}
          <div className="px-2 py-1  my-2 h-[100%] border-purple-800 rounded">
            <form onSubmit={filterHandler} className=" space-y-3" id="myForm">
              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Enter File Name :
                </label>
                <input
                  type="text"
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={(e) => setFileName(e.target.value)}
                  value={fileName}
                  disabled={selectedFile ? true : false}
                />
              </div>

              <div>
                <span className="m-2">OR</span>
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Upload Excel File:
                </label>
                <input
                  type="file"
                  multiple
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={changeFileHandler}
                  disabled={fileName ? true : false}
                  ref={fileInputRef}
                />
              </div>

              <div className=" py-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleFilterModal}
                  className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
                >
                  {pendingFile ? "Filtering..." : "Filter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
