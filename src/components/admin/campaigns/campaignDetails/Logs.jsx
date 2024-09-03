import { Cell } from "jspdf-autotable";
import React, { useEffect } from "react";
import DataTable from "react-data-table-component";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CampaignsTable = () => {
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
        cursor: "pointer",
        "&:not(:last-of-type)": {
          borderBottomStyle: "solid",
          borderBottomWidth: "1px",
          borderBottomColor: "#42bbff",
        },
      },
    },
  };

  const navigate = useNavigate();

  const smsColumns = [
    {
      name: "Id",
      selector: (row) => row._id,
    },
    {
      name: "Campaign Name",
      selector: (row) => row.campaignName,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber,
    },
    {
      name: "status",
      selector: (row) => row.status,
    },
    {
      name: "Date/Time",
      selector: (row) => row.createdAt,
      cell: (row) => {
        const today = new Date();
        const date = today.toLocaleDateString();
        const time = today.toLocaleTimeString();

        return `${date} - ${time}`;
      },
    },
  ];

  const whatsappColumns = [
    {
      name: "Id",
      selector: (row) => row._id,
    },
    {
      name: "Campaign Name",
      selector: (row) => row.campaignName,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobileNumber?.split(":")[1],
    },
    {
      name: "status",
      selector: (row) => row.status,
    },
    {
      name: "Time",
      selector: (row) => row.createdAt,
      cell: (row) => {
        const today = new Date();
        const date = today.toLocaleDateString();
        const time = today.toLocaleTimeString();

        return `${date} - ${time}`;
      },
    },
  ];

  const emailColumns = [
    {
      name: "Id",
      selector: (row) => row._id,
    },
    {
      name: "Campaign Name",
      selector: (row) => row.campaignName,
    },
    {
      name: "Template Name",
      selector: (row) => row.templateName,
    },
    {
      name: "To",
      selector: (row) => row.to,
    },
    {
      name: "status",
      selector: (row) => row.status,
    },
    {
      name: "Date/Time",
      selector: (row) => row.createdAt,
      cell: (row) => {
        const today = new Date();
        const date = today.toLocaleDateString();
        const time = today.toLocaleTimeString();

        return `${date} - ${time}`;
      },
    },
  ];

  const { logsType, logs } = useSelector((state) => state.campaigns);
  const { getLoader } = useSelector((state) => state.loaders);

  return (
    <div className="h-[94vh] overflow-y-auto px-6 py-4 flex gap-2 md:gap-4 flex-col">
      <div className=" flex flex-wrap items-center justify-between gap-4 bg-white px-4 py-2 rounded-md">
        <div className=" flex items-center flex-wrap gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
          >
            <IoMdArrowRoundBack size={26} />
          </button>
          <h1 className=" font-semibold text-xl">{`${logsType} Logs`}</h1>
        </div>
      </div>
      <div className="p-3 bg-white h-full rounded-md overflow-hidden overflow-y-auto">
        <DataTable
          columns={
            logsType === "Whatsapp"
              ? whatsappColumns
              : logsType === "Email"
              ? emailColumns
              : smsColumns
          }
          data={logs ? logs : []}
          pagination
          customStyles={tableCustomStyles}
          progressPending={getLoader}
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

export default CampaignsTable;
