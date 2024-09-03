import React, { createContext, useContext, useState } from "react";
import { toastify } from "../../components/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastifyError } from "../../constants/errors";

const ExcelDataContext = createContext();

export const ExcelDataContextProvider = ({ children }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderData, setFolderData] = useState(null);
  const [displayFolderData, setDisplayFolderData] = useState(null);
  const [isFilterData, setIsFilterData] = useState(false);

  const [pendingFile, setPendingFile] = useState(false);
  const [folderList, setFolderList] = useState([]);
  const [userRole, selectUserRole] = useState(null);
  const [refressData, setRefressData] = useState(false);
  const [refressFolderList, setRefressFolderList] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [percentageUpload, setPercentageUpload] = useState(0);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const selectFolderHandler = (data) => {
    setSelectedFolder(data);
  };

  const displayDataHandler = (data) => {
    setDisplayFolderData(data);
  };

  const folderDataHandler = (data) => {
    setFolderData(data);
  };

  const toggleIsFilterData = () => {
    setIsFilterData(false);
  };

  const setPendingHandler = (data) => {
    setPendingFile(data);
  };

  const setFolderListHandler = (data) => {
    setFolderList(data);
  };

  const setUserRoleHandler = (data) => {
    selectUserRole(data);
  };

  const refressDataHandler = () => {
    setRefressData((prev) => !prev);
  };

  const refressFolderListHandler = () => {
    setRefressFolderList((prev) => !prev);
  };

  const GetFolderFiles = async (folderName) => {
    try {
      setPendingFile(true);

      let folder, rootFolder, url;
      if (folderName) {
        const folderSplit = folderName?.split("/");
        rootFolder = folderSplit[0];
        folder = folderSplit[1];
        // url = "https://m.konceptlaw.in/api/getFolderDataPdf";
        url = "https://m.konceptlaw.in/api/getFolderDataPdf";
      }

      const response = await axios.post(
        url,
        {
          folderName: folder,
          profile: user?.profile,
          rootFolder: rootFolder,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("konceptLawToken")}`,
          },
          credentials: "include",
        }
      );

      if (response?.status === 200) {
        const data = response.data;
        if (data.files.length != 0) {
          displayDataHandler(data?.files);
          folderDataHandler(data?.files);
        } else {
          displayDataHandler(null);
          folderDataHandler(null);
        }
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
      toastifyError(error, (call)=> {
        if(call === "logout"){
          navigate("/login");
        }
      })
    } finally {
      setPendingFile(false);
    }
  };

  return (
    <ExcelDataContext.Provider
      value={{
        GetFolderFiles,

        pendingFile,
        setPendingHandler,

        folderData,
        folderDataHandler,

        displayFolderData,
        displayDataHandler,

        selectedFolder,
        selectFolderHandler,

        isFilterData,
        toggleIsFilterData,

        refressData,
        refressDataHandler,

        refressFolderList,
        refressFolderListHandler,

        userRole,
        setUserRoleHandler,

        folderList,
        setFolderListHandler,

        uploadingStatus,
        setUploadingStatus,

        isUploading,
        setIsUploading,

        percentageUpload,
        setPercentageUpload,
      }}
    >
      {children}
    </ExcelDataContext.Provider>
  );
};

export const useExcelDataContext = () => useContext(ExcelDataContext);
