import React, { useState } from "react";
import { toastify } from "../../toast";
import DataTable from "react-data-table-component";
import Papa from "papaparse";
import { useTrackingTableDataContext } from "../../../common/context/TrackingTableDataContext";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { logo1, logo2 } from "./ImageBase64";
import { MdOutlineClose } from "react-icons/md";
import { MdFolderZip } from "react-icons/md";

const exportPDF = async (jsonData) => {
  const doc = new jsPDF();

  let currentY = 10;
  const logoHeight = 20;

  doc.addImage(logo1, "PNG", 10, currentY, 40, logoHeight);

  const pageWidth = doc.internal.pageSize.getWidth();
  doc.addImage(logo2, "PNG", pageWidth - 30 - 10, currentY, 30, logoHeight);

  currentY += logoHeight + 15;
  doc.setFontSize(16);
  doc.text("Track Consignment", 15, currentY);

  currentY += 10;
  doc.setFontSize(12);
  doc.text(`Consignment Number:`, 20, currentY);
  doc.setFontSize(10);
  doc.text(jsonData.ED, 80, currentY);

  const events = jsonData.events;
  const eventsLength = events.length;

  const trackingDetailColumns = [
    {
      title: "Booked At",
      dataKey: "bookedAt",
    },
    {
      title: "Booked On",
      dataKey: "bookedOn",
    },
    {
      title: "Delivery Location",
      dataKey: "deliveryLocation",
    },
    {
      title: "Delivery Confirmed On",
      dataKey: "deliveryConfirmedOn",
    },
  ];

  const [datePart, timePart] = events[eventsLength - 1].datetime.split("T");
  const [date, time] = [datePart, timePart.slice(0, -5)];

  const [datePart1, timePart1] = events[0].datetime.split("T");
  const [date1, time1] = [datePart1, timePart1.slice(0, -5)];

  const trackingDetailData = [
    {
      bookedAt: events[eventsLength - 1].location,
      bookedOn: `${date} ${time}`,
      deliveryLocation: events[0].location,
      deliveryConfirmedOn: `${date1} ${time1}`,
    },
  ];

  currentY += 10;
  autoTable(doc, {
    columns: trackingDetailColumns,
    body: trackingDetailData,
    startY: currentY,
  });

  currentY += 25;
  doc.setFontSize(12);
  doc.text(`Event Details For:`, 20, currentY);
  doc.setFontSize(10);
  doc.text(jsonData.ED, 60, currentY);

  currentY += 5;
  doc.setFontSize(12);
  doc.text(`Current Status:`, 20, currentY);
  doc.setFontSize(10);
  doc.text(jsonData.status, 60, currentY);

  const eventDetailColumns = [
    {
      title: "Date",
      dataKey: "date",
    },
    {
      title: "Time",
      dataKey: "time",
    },
    {
      title: "Office",
      dataKey: "office",
    },
    {
      title: "Event",
      dataKey: "event",
    },
  ];

  const eventDetailData = await events.map((event) => {
    const [datePart, timePart] = event.datetime.split("T");
    const [date, time] = [datePart, timePart.slice(0, -5)];
    return {
      date: date,
      time: time,
      office: event.location,
      event: event.status,
    };
  });

  currentY += 10;
  autoTable(doc, {
    columns: eventDetailColumns,
    body: eventDetailData,
    startY: currentY,
  });

  return doc;
};

const CustomTableTitle = ({
  tableTitle,
  trackingData,
  TrackingDataHandler,
  uploadProgressData,
}) => {
  const [isZiping, setIsZipping] = useState(false);
  const [zipPorgressBoxShow, setZipPorgressBoxShow] = useState(false);
  const [zipedPercentage, setZipedPercentage] = useState(0);

  const CSVExporter = (data) => {
    if (data) {
      let transformedData = data.map((item) => {
        return {
          ["S. No"]: item["SNO"],
          ["LEGAL CASEID"]: item["LEGAL CASEID"],
          ["ED"]: item.ED,
          ["CUSTOMER NAME"]: item["CUSTOMER NAME"],
          ["STATUS"]: item.status,
        };
      });

      const csv = Papa.unparse(transformedData);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tableTitle}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      toastify({ msg: "Select Folder to Export to CSV", type: "error" });
    }
  };

  const updateProgressUI = async (percentage) => {
    setZipedPercentage(percentage);
    console.log(`Progress: ${percentage}%`);
  };

  const exportPDFIntoBactheSize = async (dataArray) => {
    setIsZipping(true);
    setZipPorgressBoxShow(true);
    if (dataArray && dataArray.length) {
      try {
        let currentBatchSize = 0;
        const maxSize = 300 * 1024 * 1024; // 300MB in bytes
        let batchNumber = 1;
        let zip = new JSZip();
        let pdfFolder = zip.folder(`TrackingDetails_Part${batchNumber}`);

        let processedFiles = 0;
        const totalFiles = dataArray.length;

        for (let i = 0; i < totalFiles; i++) {
          if (dataArray[i].events[0] !== "") {
            const doc = await exportPDF(dataArray[i]);
            const pdfBlob = doc.output("blob");
            const pdfSize = pdfBlob.size;

            if (currentBatchSize + pdfSize > maxSize) {
              // Generate and download the current batch's zip file
              const content = await zip.generateAsync({ type: "blob" });
              saveAs(content, `TrackingDetails_Part${batchNumber}.zip`);

              // Reset for next batch
              batchNumber++;
              zip = new JSZip();
              pdfFolder = zip.folder(`TrackingDetails_Part${batchNumber}`);
              currentBatchSize = 0;
            }

            // Add PDF to the current batch
            pdfFolder.file(`${dataArray[i].SNO}.pdf`, pdfBlob, {
              binary: true,
            });
            currentBatchSize += pdfSize;

            processedFiles++;
            updateProgressUI(((processedFiles / totalFiles) * 100).toFixed(0));
            console.log(`Added PDF ${i + 1} to zip`);
          }
        }

        if (currentBatchSize > 0) {
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, `TrackingDetails_Part${batchNumber}.zip`);
        }
      } catch (error) {
        console.error("Error Downloading During Zip:", error);
      } finally {
        setIsZipping(false);
      }
    } else {
      toastify({
        msg: "No Data to Export in PDF File",
        type: "error",
      });
      setIsZipping(false);
    }
  };

  const getPriviousDataHandler = async () => {
    try {
      const response = await axios.get(`https://t.konceptlaw.in/api/previousData`);

      if (response?.status === 200) {
        const data = await response.data;
        TrackingDataHandler(data);
        toastify({ msg: "Recent Data", type: "success" });
      }
    } catch (error) {
      if (error.response?.data) {
        // toastify({ msg: error.response.data, type: "error" });
        toastify({ msg: error.response.data.message, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
    }
  };

  const hardResetHandler = async () => {
    try {
      const response = await axios.get(`https://t.konceptlaw.in/api/stop`);

      if (response?.status === 200) {
        const data = await response.data;
        window.location.reload();
        toastify({ msg: data, type: "success" });
      }
    } catch (error) {
      if (error.response?.data) {
        // toastify({ msg: error.response.data, type: "error" });
        toastify({ msg: error.response.data.message, type: "error" });
      } else {
        toastify({ msg: error.message, type: "error" });
      }
    }
  };

  let percentage =
    (uploadProgressData?.progress / uploadProgressData?.totalData) * 100;

  return (
    <>
      <div
        className={`flex flex-wrap gap-4 items-center justify-between mb-2 bg-white rounded-lg `}
      >
        <span className="text-xl font-semibold">
          {tableTitle ? tableTitle : "Tracking Details"}
        </span>

        {uploadProgressData &&
          uploadProgressData?.totalData !== uploadProgressData?.progress && (
            <div className={`w-[16rem] bg-gray-200 rounded-full h-[1.5rem] `}>
              <div
                className="bg-blue-600 h-full transition-all duration-300  rounded-full flex items-center justify-center text-white font-semibold"
                style={{
                  width: `${percentage.toFixed(0)}%`,
                }}
              >
                {percentage.toFixed(0)}%
              </div>
            </div>
          )}

        {tableTitle && (
          <div className=" flex flex-wrap items-center gap-2">
            {uploadProgressData &&
              uploadProgressData?.totalData !==
                uploadProgressData?.progress && (
                <button
                  onClick={hardResetHandler}
                  className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
                >
                  Hard Reset
                </button>
              )}

            <button
              onClick={getPriviousDataHandler}
              className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
            >
              Recent Data
            </button>
            {trackingData && trackingData.length > 0 && (
              <>
                <button
                  onClick={() => exportPDFIntoBactheSize(trackingData)}
                  className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
                  disabled={isZiping}
                >
                  Export to PDF
                </button>
                <button
                  onClick={() => CSVExporter(trackingData)}
                  className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
                >
                  Export to CSV
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Uploading Content Box  */}
      <div className="fixed z-20 right-2 bottom-2 bg-white p-2 rounded-full shadow-2xl cursor-pointer">
        {/* Uploading Status Icon  */}
        <span
          className=" text-3xl"
          onClick={() => setZipPorgressBoxShow((prev) => !prev)}
        >
          <MdFolderZip />
        </span>

        {/* Uploading Content Item */}
        <div
          className={` absolute bottom-0 right-0 bg-white w-[16rem] sm:w-[20rem]  rounded-lg shadow-2xl p-2 ${
            zipPorgressBoxShow ? " translate-y-0" : " translate-y-[120%]"
          }  transition-all duration-300`}
        >
          <div className=" w-full flex justify-end">
            <span
              className=" text-xl cursor-pointer"
              onClick={() => setZipPorgressBoxShow(false)}
            >
              <MdOutlineClose />
            </span>
          </div>

          {/* Item */}
          {isZiping ? (
            <div className=" py-2">
              <div className=" flex items-center justify-between">
                <span> {zipedPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full z-40"
                  style={{
                    width: `${zipedPercentage}%`,
                  }}
                ></div>
              </div>
            </div>
          ) : (
            <p className=" text-sm">No Zip is in progress.</p>
          )}
        </div>
      </div>
    </>
  );
};

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

const TrackingTable = ({ uploadProgressData }) => {
  const { displayTrackingData, TrackingDataHandler } =
    useTrackingTableDataContext();

  const prevPdf = async (jsonData) => {
    const doc = await exportPDF(jsonData);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, "_blank");
  };

  const trackingColumn = [
    {
      name: "S. No",
      selector: (row) => row["SNO"],
    },
    {
      name: "LEGAL CASEID",
      selector: (row) => row["LEGAL CASEID"],
    },
    {
      name: "ED",
      selector: (row) => row.ED,
    },
    {
      name: "Customer Name",
      selector: (row) => row["CUSTOMER NAME"],
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
    },
    {
      name: "Download PDF",
      selector: (row) => {
        return (
          <>
            {row.events !== "" && (
              <button
                onClick={() => prevPdf(row)}
                className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
                disabled={row.events == ""}
              >
                Export to PDF
              </button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="">
      <CustomTableTitle
        tableTitle={"Tracking Details"}
        trackingData={displayTrackingData}
        TrackingDataHandler={TrackingDataHandler}
        uploadProgressData={uploadProgressData}
      />
      <div className="">
        <DataTable
          columns={trackingColumn}
          data={displayTrackingData ? displayTrackingData : []}
          pagination
          selectableRows
          customStyles={tableCustomStyles}
          responsive={true}
        />
      </div>
    </div>
  );
};

export default TrackingTable;
