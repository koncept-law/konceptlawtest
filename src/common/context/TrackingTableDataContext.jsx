import { data } from "autoprefixer";
import React, { createContext, useContext, useState } from "react";

const TrackingTableContext = createContext();

export const TrackingTableDataContext = ({ children }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [displayTrackingData, setDisplayTrackingData] = useState(null);

  const TrackingDataHandler = (data) => {
    setTrackingData(data);
    setDisplayTrackingData(data);
  };
  const DisplayTrackingDataHandler = (data) => {
    setDisplayTrackingData(data);
  };

  return (
    <TrackingTableContext.Provider
      value={{
        trackingData,
        TrackingDataHandler,
        displayTrackingData,
        DisplayTrackingDataHandler,
      }}
    >
      {children}
    </TrackingTableContext.Provider>
  );
};

export const useTrackingTableDataContext = () =>
  useContext(TrackingTableContext);
