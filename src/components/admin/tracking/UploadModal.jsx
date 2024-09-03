import React, { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { useTrackingTableDataContext } from "../../../common/context/TrackingTableDataContext";
import { toastify } from "../../toast";
import axios from "axios";

const UploadModal = ({ modal, toggle, setUploadProgressData }) => {
  const { trackingData, TrackingDataHandler } = useTrackingTableDataContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [typeOfData, setTypeOfData] = useState(null);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef(null);

  const changeFileHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadHandler = async (e) => {
    try {
      e.preventDefault();
      if (!selectedFile) {
        toastify({ msg: "Select File to Upload", type: "error" });
        return;
      }

      setPending(true);
      const formData = new FormData();
      formData.append("File", selectedFile);
      formData.append("typeOfData", typeOfData);

      const response = await axios.post(
        "https://m.konceptlaw.in/api/convert",
        formData
      );

      if (response.status === 201) {
        toastify({ msg: response.data, type: "success" });
        toggle();
        clearInputField();
      }

      const intervalId = setInterval(async () => {
        try {
          const response1 = await axios.get("https://m.konceptlaw.in/api/progress");
          setUploadProgressData(response1.data);

          if (response1.data.totalData === response1.data.progress) {
            clearInterval(intervalId);

            const response2 = await axios.get(
              `https://m.konceptlaw.in/api/previousData`
            );

            if (response2.status === 200) {
              const data = await response2.data;
              TrackingDataHandler(data);
              setUploadProgressData(null);
              clearInputField();
              setSelectedFile(null);
              setPending(false);
              toastify({ msg: "Uploaded Successfully", type: "success" });
            }
          }
        } catch (error) {
          clearInterval(intervalId);
          setPending(false);
          toastify({ msg: error.response.data, type: "error" });
        }
      }, 2000);
    } catch (error) {
      if (error.response?.data) {
        // toastify({ msg: error.response.data, type: "error" });
        toastify({ msg: error.response.data.message, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
      toggle();
      clearInputField();
      setPending(false);
      setSelectedFile(null);
    }
  };

  function clearInputField() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      {/*Uplaod Document Model  */}
      <div
        className={` ${
          modal ? "fixed" : "hidden"
        } fixed top-0 left-0 w-[100%] h-[100%] z-40 flex  justify-center`}
      >
        {/* OverLay  */}
        <div className="absolute w-[100%] h-[100%] bg-black opacity-25"></div>

        {/* Conetnt  */}
        <div className=" bg-white rounded-lg w-[90%] md:w-[60%]  p-2 absolute z-10  mt-10">
          {/* Model Header  */}
          <div className="modelHeadingBackground p-3 border-blue-800 rounded flex items-center justify-between">
            <h1 className="text-white text-xl font-semibold">Upload</h1>
            <span
              className=" text-black text-xl cursor-pointer"
              onClick={toggle}
            >
              <MdOutlineClose />
            </span>
          </div>

          {/* Modal Body  */}
          <div className="px-2 py-1  my-2 h-[100%] border-purple-800 rounded">
            <form className=" space-y-3" id="myForm">
              <div className=" flex flex-col gap-1  rounded">
                <label htmlFor="dataType" className=" font-semibold">
                  Select Existing Folder :
                </label>
                <select
                  name="dataType"
                  id="dataType"
                  className=" border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={(e) => setTypeOfData(e.target.value)}
                >
                  <option value="">Select Type of Data</option>
                  <option value="old">Old Data</option>
                  <option value="fresh">Fresh Data</option>
                </select>
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Select Document :
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={changeFileHandler}
                />
              </div>

              <div className=" py-4">
                <button
                  type="submit"
                  className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
                  disabled={pending}
                  onClick={uploadHandler}
                >
                  {pending ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadModal;
