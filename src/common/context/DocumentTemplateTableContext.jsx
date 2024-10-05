import React, { createContext, useContext, useState } from "react";
import { toastify } from "../../components/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toastifyError } from "../../constants/errors";

const DocumentTemplateTableContext = createContext();

export const DocumentTemplateTableContextProvider = ({ children }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderData, setFolderData] = useState(null);
  const [displayFolderData, setDisplayFolderData] = useState(null);
  const [isFilterData, setIsFilterData] = useState(false);
  const [pendingFile, setPendingFile] = useState(false);
  const [refressData, setRefressData] = useState(false);

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

  const refressDataHandler = () => {
    setRefressData((prev) => !prev);
  };

  const GetFolderFiles = async (folderName) => {
    try {
      setPendingFile(true);

      let folder, rootFolder, url;
      if (
        ["hdfc", "tracking"].some((substring) => folderName.includes(substring))
      ) {
        const folderSplit = folderName?.split("/");
        rootFolder = folderSplit[0];
        folder = folderSplit[1];
        url = "https://t.kcptl.in/api/getFolderData";
      } else {
        folder = folderName;
        url = "https://t.kcptl.in/api/folder";
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
    <DocumentTemplateTableContext.Provider
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
      }}
    >
      {children}
    </DocumentTemplateTableContext.Provider>
  );
};

export const useDocumentTemplateTableContext = () => useContext(DocumentTemplateTableContext);
