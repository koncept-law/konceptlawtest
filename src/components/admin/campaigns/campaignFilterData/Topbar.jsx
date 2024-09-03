import React from "react";
import { IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { toastify } from "../../../toast";

const Topbar = ({ data }) => {
  const navigate = useNavigate();
  // console.log(data);

  const CSVExporter = (data) => {
    try {
      if (data && data.length) {
        const folderName = "Campaign Filtered Data";

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

  return (
    <div className="flex items-center justify-between w-full h-fit py-2 gap-4 bg-white px-4 rounded-md flex-wrap">
      <div className=" flex items-center flex-wrap gap-4">
        <button
          onClick={() => navigate("/campaigns")}
          className=" flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
        >
          <IoMdArrowRoundBack size={26} />
        </button>
        <h1 className="font-semibold text-xl">Campaigns Filtered Data</h1>
      </div>

      <div>
        <button
          onClick={() => CSVExporter(data)}
          className="buttonBackground  py-1 px-2 rounded-md text-white font-bold  transition-all duration-300"
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default Topbar;
