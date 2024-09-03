import React, { useEffect, useMemo, useState } from "react";
import { toastify } from "../../toast";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastifyError } from "../../../constants/errors";

const UploadFile = ({ progressData, setProgressData }) => {
  const { displayDataHandler, refressDataHandler } = useTableDataContext();
  const { user, userList } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [newFolder, setNewFolder] = useState(null);
  const [selectExistingFolder, setSelectExistingFolder] = useState(null);
  const [selectedExcelFile, setSelectedExcelFiles] = useState(null);
  const [selectedDocsFile, setSelectedDocsFiles] = useState(null);
  const [checkPending, setCheckPending] = useState(null);

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
      const response = await axios.get(`https://t.konceptlaw.in/api/foldersName`, {
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
      // if (error.response?.status === 403) {
      //   localStorage.clear();
      //   navigate("/login");
      // } else if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" });
      // } else {
      //   toastify({ msg: error.message, type: "error" });
      // }
      toastifyError(error, (call) => {
        if(call){
          navigate("/login");
        }
      })
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

  const checkExcelFileHandler = async () => {
    try {
      setCheckPending(true);
      if (!selectedExcelFile) {
        return toastify({
          msg: "Please select a Excel File",
          type: "error",
        });
      }

      const formData = new FormData();
      formData.append("excel", selectedExcelFile);

      const response = await axios.post(
        "https://t.konceptlaw.in/api/checkfields",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
          },
          credentials: "include",
        }
      );

      if (response.status === 200) {
        toastify({
          msg: response.data,
          type: "success",
        });
      }
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.clear();
        navigate("/login");
      }

      if (error.response.data?.error) {
        toastify({
          msg: `${error.response.data.error} Missing Fields are: ${error.response.data.missingFields}`,
          type: "error",
        });
      } else {
        toastify({
          msg: "Error checking excel files",
          type: "error",
        });
      }
    } finally {
      setCheckPending(false);
    }
  };

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
      if (selectedDocsFile && selectedExcelFile) {
        if (newFolder) {
          const response = await axios.get(
            `https://t.konceptlaw.in/api/foldersName`,
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

            await axios.post(
              `https://t.konceptlaw.in/api/updateMongoFolder`,
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
          formData.append("docx", selectedDocsFile);
          formData.append("folderName", pathName);
          formData.append("userEmail", user?.email);
          formData.append(
            "rootFolder",
            user?.profile === "superAdmin" ? userRole : user?.profile
          );

          const response = await axios.post(
            "https://t.konceptlaw.in/api/genatedDocsUpload",
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

            toastify({
              msg: response.data,
              type: "success",
            });
          }

          const intervalId = setInterval(async () => {
            try {
              const response = await axios.post(
                "https://t.konceptlaw.in/api/progressBarServer",
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
                //  Reset
                clearInputField();

                setNewFolder(null);
                setSelectExistingFolder(null);
                setSelectedDocsFiles(null);
                setSelectedExcelFiles(null);
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
            "https://t.konceptlaw.in/api/genratedDocsUploadFirebase",
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
            toastify({
              msg: response.data,
              type: "success",
            });
          }

          const intervalId = setInterval(async () => {
            try {
              const response = await axios.get(
                "https://t.konceptlaw.in/api/progressBar",
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
      // if (error.response?.status === 403) {
      //   localStorage.clear();
      //   navigate("/login");
      // }
      // if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" });
      // } else {
      //   toastify({
      //     msg: "Error uploading files",
      //     type: "error",
      //   });
      // }
      toastifyError(error, (call) => {
        if(call){
          navigate("/login");
        }
      })
    } finally {
      setPending(false);
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

  const percentageUpload = useMemo(() => {
    if (progressData) {
      return Math.round((progressData.progress / progressData.totalData) * 100);
    }
    return 0;
  }, [progressData]);

  useEffect(() => {
    getFolderList();
  }, []);
  return (
    <div className="h-[94vh] overflow-y-auto px-6 py-4 flex md:gap-4">
      <div className=" bg-white mx-auto h-full rounded-lg shadow-lg p-4 w-full">
        <form
          onSubmit={uploadHandler}
          className="flex flex-col justify-between h-full"
          id="myForm"
        >
          <div className=" flex flex-col gap-2 rounded">
            <label htmlFor="" className="text-sm font-semibold">
              Select User Role :
            </label>
            <select
              name=""
              id=""
              className=" border-2 rounded p-2 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={userRoleHandler}
              value={userRole}
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
              value={selectExistingFolder}
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
              value={newFolder}
            />
          </div>

          <div className=" flex w-full flex-wrap justify-between items-end gap-4">
            <div className="flex-1 flex flex-col gap-1 rounded">
              <label htmlFor="" className="text-sm font-semibold">
                Select Excel File:
              </label>
              <input
                type="file"
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onChange={changeExcelFileHandler}
              />
            </div>
            <button
              type="button"
              disabled={checkPending}
              onClick={checkExcelFileHandler}
              className="px-6 py-2 rounded min-w-[8rem] h-fit modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300"
            >
              {checkPending ? "Checking..." : "Check Excel"}
            </button>
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
              disabled={percentageUpload}
              className="p-3 rounded modelHeadingBackground text-white font-bold hover:bg-transparenttransition-all duration-300 w-full"
            >
              {percentageUpload
                ? `Uploading ${percentageUpload}%`
                : "Upload File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
