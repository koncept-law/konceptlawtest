import React, { useMemo, useState } from "react";
import CampaignsTable from "../CampaignsTable";
import Topbar from "./Topbar";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";

const CampaignFilterData = () => {
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

  const columns = useMemo(() => {
    return [
      {
        name: "Name",
        selector: (row) => row.name,
      },
      {
        name: "Link",
        selector: (row) => row.link,
      },
    ];
  }, []);

  const { filteredCampaignData } = useSelector((state) => state.campaigns);

  const [selectedRows, setSelectedRows] = useState(null);
  const handleSelectedRowsChange = (newSelectedRows) => {
    setSelectedRows(newSelectedRows.selectedRows);
  };

  return (
    <>
      <div className="h-[94vh] overflow-y-auto px-6 py-4 flex gap-2 md:gap-4 flex-col">
        <Topbar data={selectedRows} />
        <div className="p-3 bg-white h-full rounded-md overflow-hidden overflow-y-auto">
          <div className="">
            <DataTable
              columns={columns}
              data={filteredCampaignData ? filteredCampaignData : []}
              pagination
              selectableRows
              onSelectedRowsChange={handleSelectedRowsChange}
              customStyles={tableCustomStyles}
              responsive={true}
              noDataComponent={<CustomNoDataComponenet />}
              progressComponent={<CustomProgressComponenet />}
            />
          </div>
        </div>
      </div>
    </>
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

export default CampaignFilterData;
