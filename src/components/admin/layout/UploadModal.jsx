import React, { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { toastify } from "../../toast";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UploadModal = ({ toggle, modal, progressData, setProgressData }) => {
  const { displayDataHandler, refressDataHandler } = useTableDataContext();
  const { user, userList } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [newFolder, setNewFolder] = useState(null);
  const [selectExistingFolder, setSelectExistingFolder] = useState(null);
  const [selectedExcelFile, setSelectedExcelFiles] = useState(null);
  const [selectedDocsFile, setSelectedDocsFiles] = useState(null);

  const changeExcelFileHandler = (event) => {
    setSelectedExcelFiles(event.target.files[0]);
  };

  const changeDocFileHandler = (event) => {
    setSelectedDocsFiles(event.target.files[0]);
  };

  const [pending, setPending] = useState(false);
  const [folderList, setFolderList] = useState([]);

  const [userRole, selectUserRole] = useState(null);

  const groupFoldersByProfile = async (folders) => {
    const groupedFolders = [];
    const tempMap = new Map();

    await folders.forEach((folder) => {
      const profile = folder.profile || "superAdmin"; // Handle folders without profile
      if (!tempMap.has(profile)) {
        tempMap.set(profile, []);
      }
      tempMap.get(profile).push(folder.folderName);
    });

    for (const [profile, folders] of tempMap.entries()) {
      groupedFolders.push({ profile, folders });
    }

    return groupedFolders;
  };

  const getFolderList = async () => {
    try {
      setPending(true);
      const response = await axios.get(`https://m.konceptlaw.in/api/foldersName`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
        },
        credentials: "include",
      });

      if (response?.status === 200) {
        const data = response.data;
        const grpData = await groupFoldersByProfile(data);
        setFolderList(grpData);
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
    } finally {
      setPending(false);
    }
  };

  const userRoleHandler = (e) => {
    selectUserRole(e.target.value);
  };

  function clearInputField() {
    document.getElementById("myForm").reset();
  }

  const uploadHandler = async (e) => {
    e.preventDefault();
    setPending(true);

    if (!userRole) {
      return toastify({
        msg: "Please select user",
        type: "error",
      });
    }

    if (!selectExistingFolder && !newFolder) {
      return toastify({
        msg: "Please select a Exisiting Folder or Enter New Folder Name",
        type: "error",
      });
    }

    try {
      //   toggle();

      if (selectedDocsFile && selectedExcelFile) {
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

          const formData = new FormData();
          formData.append("excel", selectedExcelFile);
          formData.append("docs", selectedDocsFile);
          formData.append("folderName", pathName);
          formData.append("userEmail", user?.email);
          formData.append(
            "rootFolder",
            user?.profile === "superAdmin" ? userRole : user?.profile
          );

          const response = await axios.post(
            "https://m.konceptlaw.in/api/genatedDocsUpload",
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
            // Refresh Data
            refressDataHandler();

            //  Reset
            clearInputField();
            setNewFolder(null);
            setSelectExistingFolder(null);
            setSelectedDocsFiles(null);
            setSelectedExcelFiles(null);
            displayDataHandler(null);
            toggle();
            toastify({
              msg: response.data,
              type: "success",
            });
          }

          const intervalId = setInterval(async () => {
            try {
              const response = await axios.post(
                "https://m.konceptlaw.in/api/progressBarServer",
                {
                  userEmail: user?.email,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "konceptLawToken"
                    )}`,
                  },
                  credentials: "include",
                }
              );
              setProgressData(() => response.data);

              if (response.data?.totalData === response.data?.progress) {
                toastify({ msg: "Uploaded Successfully", type: "success" });
                setPending(false);
                setProgressData(() => null);
                clearInterval(intervalId);
              }
            } catch (error) {
              toastify({ msg: error.response.data, type: "error" });
              setPending(false);
              setProgressData(() => null);
              clearInterval(intervalId);
            }
          }, 2000);
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

          const formData = new FormData();
          formData.append("excel", selectedExcelFile);
          formData.append("docs", selectedDocsFile);
          formData.append("folderName", pathName);
          formData.append(
            "rootFolder",
            user?.profile === "superAdmin" ? userRole : user?.profile
          );

          const response = await axios.post(
            "https://m.konceptlaw.in/api/genratedDocsUploadFirebase",
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
            // Refresh Data
            refressDataHandler();

            //  Reset
            clearInputField();
            setNewFolder(null);
            setSelectExistingFolder(null);
            setSelectedDocsFiles(null);
            setSelectedExcelFiles(null);
            displayDataHandler(null);
            toggle();
            toastify({
              msg: response.data,
              type: "success",
            });
          }

          const intervalId = setInterval(async () => {
            try {
              const response = await axios.get(
                "https://m.konceptlaw.in/api/progressBar",
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "konceptLawToken"
                    )}`,
                  },
                  credentials: "include",
                }
              );

              setProgressData(() => response.data);

              if (response.data.totalData === response.data.progress) {
                toastify({ msg: "Uploaded Successfully", type: "success" });
                setPending(false);
                setProgressData(() => null);
                clearInterval(intervalId);
              }
            } catch (error) {
              toastify({ msg: error.response.data, type: "error" });
              setPending(false);
              setProgressData(() => null);
              clearInterval(intervalId);
            }
          }, 2000);
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
      }  else {
        toastify({
          msg: "Error uploading files",
          type: "error",
        });
      }
      console.log(error);
    }
  };

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

  useEffect(() => {
    getFolderList();
  }, []);

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
            <form onSubmit={uploadHandler} className=" space-y-3" id="myForm">
              <div className=" flex flex-col gap-2 rounded">
                <label htmlFor="" className="text-sm font-semibold">
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
                  Select Excel File:
                </label>
                <input
                  type="file"
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={changeExcelFileHandler}
                />
              </div>

              <div className=" flex flex-col gap-1 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Select Doc File:
                </label>
                <input
                  type="file"
                  className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                  onChange={changeDocFileHandler}
                />
              </div>

              <div className=" py-4">
                <button
                  type="submit"
                  disabled={pending}
                  className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
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
