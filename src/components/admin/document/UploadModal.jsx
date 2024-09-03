import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { FaCloudUploadAlt } from "react-icons/fa";
import { toastify } from "../../toast";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UploadModal = ({
  modal,
  toggle,
  folderList,
  setRefressData,
  userRole,
}) => {
  const { displayDataHandler } = useTableDataContext();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [newFolder, setNewFolder] = useState(null);
  const [selectExistingFolder, setSelectExistingFolder] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uplodFileCount, setUploadFileCount] = useState(0);
  const [totalFileCount, setTotalFileCount] = useState(0);
  const [percentageUpload, setPercentageUpload] = useState(0);

  const [uploadingStatus, setUploadingStatus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const changeFileHandler = (event) => {
    setSelectedFiles(event.target.files);
  };

  function clearInputField() {
    document.getElementById("myForm").reset();
  }

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (!selectExistingFolder && !newFolder) {
      return toastify({
        msg: "Please select a Exisiting Folder or Enter New Folder Name",
        type: "error",
      });
    }

    //Firebase Configration
    const firebaseConfig = {
      apiKey: "AIzaSyBYEcPQq3egqA5Q4lsmilDouWY7-2aPdEQ",
      authDomain: "koncept-law-associates.firebaseapp.com",
      projectId: "koncept-law-associates",
      storageBucket: "koncept-law-associates.appspot.com",
      messagingSenderId: "708264549426",
      appId: "1:708264549426:web:d3180edcdcb5b38662b02b",
      measurementId: "G-94B0SSJMBK",
    };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    try {
      toggle();
      setTotalFileCount(selectedFiles.length);

      if (selectedFiles.length > 0) {
        setIsUploading(true);
        setUploadingStatus(true);
        let uploadedFiles = 0;

        updateProgressUI(uploadedFiles, selectedFiles.length);

        if (newFolder) {
          const response = await axios.get(
            `https://m.konceptlaw.in/api/foldersName`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "konceptLawToken"
                )}`,
              },
              credentials: "include",
            }
          );

          const allFolders = response.data;

          const foundFolder = allFolders.find(
            (folder) => folder.folderName === newFolder
          );

          if (!foundFolder) {
            console.log("we  are in not found Folder");

            await axios.post(
              `https://m.konceptlaw.in/api/updateMongoFolder`,
              {
                newFolder,
                role: userRole,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "konceptLawToken"
                  )}`,
                  "Content-Type": "application/json",
                },
                credentials: "include",
              }
            );
          }
        }

        //HDFC upload on server(vultr) and Other Upload on Firebase
        if (
          ["hdfc", "tracking"].includes(userRole) ||
          ["hdfc", "tracking"].includes(user?.profile)
        ) {
          let pathName;
          if (selectExistingFolder) {
            const [role, folder] = selectExistingFolder?.split("/");
            pathName = `${folder}`;
          } else {
            pathName = `${newFolder}`;
          }
          for (let i = 0; i < selectedFiles.length; i++) {
            const formData = new FormData();
            formData.append("file", selectedFiles[i]);
            formData.append("folderName", pathName);
            formData.append(
              "rootFolder",
              user?.profile === "superAdmin" ? userRole : user?.profile
            );

            const response = await axios.post(
              "https://m.konceptlaw.in/api/uploadOnServer",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            if (response.status === 200) {
              // console.log(response.data, "=", i);
              uploadedFiles++;
              setUploadFileCount(uploadedFiles);
              updateProgressUI(uploadedFiles, selectedFiles.length);
            }
          }

          setUploadFileCount(uploadedFiles);
          setIsUploading(false);
          setUploadingStatus(false);

          // Refresh Data
          setRefressData((prev) => !prev);

          //  Reset
          clearInputField();
          setNewFolder(null);
          setSelectExistingFolder(null);
          setSelectedFiles([]);
          displayDataHandler(null);

          toastify({
            msg: "All files uploaded successfully",
            type: "success",
          });
        } else {
          let pathName;
          if (user?.profile === "superAdmin") {
            if (userRole === "superAdmin") {
              pathName = `${
                selectExistingFolder ? selectExistingFolder : newFolder
              }`;
            } else {
              if (selectExistingFolder) {
                pathName = `${selectExistingFolder}`;
              } else {
                pathName = `${userRole}/${newFolder}`;
              }
            }
          } else {
            if (selectExistingFolder) {
              pathName = `${selectExistingFolder}`;
            } else {
              pathName = `${user?.profile}/${newFolder}`;
            }
          }

          for (const file of selectedFiles) {
            const storageRef = ref(storage, `${pathName}/${file.name}`);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {},
              (error) => {
                setIsUploading(false);
              },
              async () => {
                uploadedFiles++;
                setUploadFileCount(uploadedFiles);
                updateProgressUI(uploadedFiles, selectedFiles.length);

                await axios.post(
                  `https://m.konceptlaw.in/api/saveData`,
                  {
                    name: file.name,
                    link: `${pathName}/${file.name}`,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        "konceptLawToken"
                      )}`,
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }
                );

                if (uploadedFiles === selectedFiles.length) {
                  setUploadFileCount(uploadedFiles);
                  setIsUploading(false);
                  setUploadingStatus(false);

                  // Refresh Data
                  setRefressData((prev) => !prev);

                  //  Reset
                  clearInputField();
                  setNewFolder(null);
                  setSelectExistingFolder(null);
                  setSelectedFiles([]);
                  displayDataHandler(null);

                  toastify({
                    msg: "All files uploaded successfully",
                    type: "success",
                  });
                }
              }
            );
          }
        }
      } else {
        toastify({
          msg: "Please select files to upload",
          type: "error",
        });
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }
      if (error.response?.data?.message) {
        toastify({ msg: error.response.data?.message, type: "error" });
      } else if (error.response?.data) {
        toastify({ msg: error.response.data, type: "error" });
      } else {
        toastify({
          msg: "Error uploading files",
          type: "error",
        });
      }

      setIsUploading(false);
    }
  };

  function updateProgressUI(uploaded, total) {
    const progressPercentage = ((uploaded / total) * 100).toFixed(2);
    setUploadFileCount(uploaded);
    setPercentageUpload(progressPercentage);
  }

  let userFolders = [];

  if (user?.profile === "superAdmin") {
    const userProfile = folderList.find((obj) => obj.profile === userRole);
    if (userProfile) {
      userFolders = userProfile.folders;
    }
  } else {
    const userProfile = folderList.find((obj) => obj.profile === user?.profile);
    if (userProfile) {
      userFolders = userProfile.folders;
    }
  }

  return (
    <>
      {/*Uplaod Document Model  */}
      <div
        className={` ${
          modal ? "fixed" : "hidden"
        } fixed top-0 left-0 w-[100%] h-[100%] z-40 flex  justify-center items-center`}
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
            <form onSubmit={uploadHandler} className=" space-y-3" id="myForm">
              <div className=" flex flex-col gap-1  rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Select Existing Folder :
                </label>
                <select
                  name=""
                  id=""
                  className=" border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={(e) => setSelectExistingFolder(e.target.value)}
                  disabled={newFolder}
                >
                  <option value="">Select Exisiting Folder</option>
                  {userFolders &&
                    userFolders.map((item, index) => (
                      <option value={item} key={index}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <span className="m-2">OR</span>
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Create New Folder :
                </label>
                <input
                  type="text"
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={(e) => setNewFolder(e.target.value)}
                  disabled={selectExistingFolder}
                />
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Select Document :
                </label>
                <input
                  type="file"
                  multiple
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={changeFileHandler}
                />
              </div>

              <div className=" py-4">
                <button
                  type="submit"
                  className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Uploading Progress Content Box  */}
      <div className="fixed right-2 bottom-2 bg-white p-2 rounded-full shadow-2xl cursor-pointer">
        {/* Uploading Status Icon  */}
        <span
          className=" text-3xl"
          onClick={() => setUploadingStatus((prev) => !prev)}
        >
          <FaCloudUploadAlt />
        </span>

        {/* Uploading Content Item */}
        <div
          className={` absolute bottom-0 right-0 bg-white w-[16rem] sm:w-[20rem]  rounded-lg shadow-2xl p-2 ${
            uploadingStatus ? " translate-y-0" : " translate-y-[120%]"
          }  transition-all duration-300`}
        >
          <div className=" w-full flex justify-end">
            <span
              className=" text-xl cursor-pointer"
              onClick={() => setUploadingStatus(false)}
            >
              <MdOutlineClose />
            </span>
          </div>

          {/* Item */}
          {isUploading ? (
            <div className=" py-2">
              <div className=" flex items-center justify-between">
                <span>
                  {uplodFileCount}/{totalFileCount} files uploaded
                </span>
                <span> {percentageUpload}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full z-40"
                  style={{
                    width: `${percentageUpload}%`,
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <p className=" text-sm">No Upload is in progress.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadModal;
