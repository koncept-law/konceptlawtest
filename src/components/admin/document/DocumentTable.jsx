import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { useTableDataContext } from "../../../common/context/TableDataContext";
import Papa from "papaparse";
import { toastify } from "../../toast";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useSelector } from "react-redux";

const CustomTableTitle = ({
  folderName,
  setRefressData,
  displayDataHandler,
  selectedRows,
}) => {
  const { displayFolderData, folderData } = useTableDataContext();
  const { user } = useSelector((state) => state.user);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadPercentage, setDownloadPercentage] = useState(0);

  const CSVExporter = (data) => {
    try {
      if (data && data.length) {
        if (!folderName) {
          folderName = "Data";
        }

        let transformedData = data.map((file) => {
          return {
            [folderName]: `${file.shortLink ? file.shortLink : file.link}`,
          };
        });

        const csv = Papa.unparse(transformedData);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${folderName}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        toastify({
          msg: "No File Selected to Export",
          type: "error",
        });
      }
    } catch (error) {
      toastify({ msg: "Error Occured in Exporting CSV File", type: "error" });
    }
  };

  const handleDeleteFolder = async (folderName) => {
    try {
      console.log(folderName);
      if (!folderName) {
        return toastify({
          msg: "Plese Select Folder to Delete",
          type: "error",
        });
      }
      setIsDeleting(true);

      let folder, rootFolder, url, url1;
      if (
        ["hdfc", "tracking"].some((substring) => folderName.includes(substring))
      ) {
        const folderSplit = folderName?.split("/");
        rootFolder = folderSplit[0];
        folder = folderSplit[1];

        url1 = "https://t.kcptl.in/api/deleteFolderDB";
        url = "https://t.kcptl.in/api/deleteFolder";

        await axios.post(url1, {
          folderName,
        });
      } else {
        folder = folderName;
        url = "https://t.kcptl.in/api/deleteFirebase";
      }

      const response = await axios.post(url, {
        folderName: folder,
        rootFolder: rootFolder,
      });

      if (response?.status === 200) {
        const data = await response.data;
        setRefressData((prev) => !prev);
        displayDataHandler(null);
        toastify({ msg: data, type: "success" });
      }
    } catch (error) {
      if (error.response?.data) {
        // toastify({ msg: error.response.data, type: "error" });
        toastify({ msg: error.response.data.message, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const updateProgressUI = async (percentage) => {
    setDownloadPercentage(percentage);
    console.log(`Progress: ${percentage}%`);
  };

  const DownloadFilesHandler = async (dataArray) => {
    setIsDownloading(true);
    if (dataArray && dataArray.length) {
      try {
        let currentBatchSize = 0;
        const maxSize = 300 * 1024 * 1024; // 300MB in bytes
        let batchNumber = 1;
        let zip = new JSZip();
        let filesFolder = zip.folder(`Document_Part${batchNumber}`);

        let processedFiles = 0;
        const totalFiles = dataArray.length;

        for (let i = 0; i < totalFiles; i++) {
          if (dataArray[i] !== "") {
            const fileUrl = `${dataArray[i].link}?t=${Date.now()}`;
            const fileBlob = await fetch(fileUrl).then((res) => res.blob());
            const fileSize = fileBlob.size;

            if (currentBatchSize + fileSize > maxSize) {
              // Generate and download the current batch's zip file
              const content = await zip.generateAsync({ type: "blob" });
              saveAs(content, `TrackingDetails_Part${batchNumber}.zip`);

              // Reset for next batch
              batchNumber++;
              zip = new JSZip();
              filesFolder = zip.folder(`Document_Part${batchNumber}`);
              currentBatchSize = 0;
            }

            // Add PDF to the current batch
            filesFolder.file(`${dataArray[i].name}`, fileBlob);

            currentBatchSize += fileSize;

            processedFiles++;
            updateProgressUI(((processedFiles / totalFiles) * 100).toFixed(0));
            console.log(`Added PDF ${i + 1} to zip`);
          }
        }

        if (currentBatchSize > 0) {
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, `Document_Part${batchNumber}.zip`);
        }
      } catch (error) {
        console.error("Error Downloading During Zip:", error);
      } finally {
        setIsDownloading(false);
        setDownloadPercentage(0);
      }
    } else {
      toastify({
        msg: "No File Selected to Download",
        type: "error",
      });
      setIsDownloading(false);
    }
  };

  const searchHandler = (e) => {
    if (e.target.value) {
      const searchData = displayFolderData.filter((item) => {
        return item.name.includes(e.target.value);
      });
      displayDataHandler(searchData);
    } else {
      displayDataHandler(folderData);
    }
  };

  return (
    <div
      className={` flex flex-wrap gap-4 items-center justify-between mb-2 bg-white rounded-lg `}
    >
      <span className="text-xl font-semibold capitalize">
        {displayFolderData && folderName
          ? folderName?.replace(`${user?.profile}/`, "")
          : "Document"}
      </span>

      {displayFolderData && (
        <div className=" flex flex-wrap items-center gap-2">
          <div className=" sm:w-[20rem] flex flex-col gap-1 rounded">
            <input
              type="text"
              className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={searchHandler}
              placeholder="Search Now"
            />
          </div>

          {user?.profile === "superAdmin" && (
            <button
              className="py-1 px-4 rounded-md buttonBackground text-white  font-bold transition-all duration-300"
              onClick={() => handleDeleteFolder(folderName)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}

          <button
            onClick={() => DownloadFilesHandler(selectedRows)}
            disabled={isDownloading}
            className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
          >
            {isDownloading
              ? `Downloading ${downloadPercentage}%`
              : "Download File"}
          </button>
          <button
            onClick={() => CSVExporter(selectedRows)}
            className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
          >
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
};

const DocumentTable = ({ setRefressData }) => {
  const { displayDataHandler, selectedFolder, displayFolderData, pendingFile } =
    useTableDataContext();
  const [selectedRows, setSelectedRows] = useState([]);

  const documentColumn = [
    {
      name: "Document Name",
      selector: (row) => row.name,
    },
  ];

  const tableCustomStyles = {
    headRow: {
      style: {
        background: "linear-gradient(90deg, #359FF3 0%, #8256FF 100%)",
        color: "#ffffff",
        fontWeight: "38px",
        fontSize: "14px",
        borderRadius: "5px",
        minHeight: "41px",
      },
    },
    rows: {
      style: {
        borderBottomStyle: "solid",
        borderBottomWidth: "1px",
        borderBottomColor: "#42bbff",
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#42bbff",
        },
      },
    },
  };

  const handleSelectedRowsChange = (newSelectedRows) => {
    setSelectedRows(newSelectedRows.selectedRows);
  };

  return (
    <div className="">
      <CustomTableTitle
        folderName={selectedFolder}
        setRefressData={setRefressData}
        displayDataHandler={displayDataHandler}
        selectedRows={selectedRows}
      />
      <div className="">
        <DataTable
          columns={documentColumn}
          data={displayFolderData ? displayFolderData : []}
          pagination
          selectableRows
          onSelectedRowsChange={handleSelectedRowsChange}
          customStyles={tableCustomStyles}
          progressPending={pendingFile}
          responsive={true}
          noDataComponent={<CustomNoDataComponenet />}
          progressComponent={<CustomProgressComponenet />}
        />
      </div>
    </div>
  );
};

const CustomNoDataComponenet = () => {
  return (
    <div className="w-full p-10 text-center">
      There are no records to displays
    </div>
  );
};
const CustomProgressComponenet = () => {
  return <div className="w-full p-10 text-center">Loading...</div>;
};

export default DocumentTable;
