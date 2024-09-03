import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [openDocumentSidebar, setOpenDocumentSidebar] = useState(false);
  const [openTrackingFilterSidebar, setOpenTrackingFilterSidebar] =
    useState(false);
  const [openExcelDocumentSidebar, setOpenExcelDocumentSidebar] =
    useState(false);

  const doucmentSidebartoggleHandler = () => {
    setOpenDocumentSidebar((prev) => !prev);
  };

  const trackingFilterSidebartoggleHandler = () => {
    setOpenTrackingFilterSidebar((prev) => !prev);
  };
  const excelDocumentSidebartoggleHandler = () => {
    setOpenExcelDocumentSidebar((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{
        openDocumentSidebar,
        doucmentSidebartoggleHandler,

        openTrackingFilterSidebar,
        trackingFilterSidebartoggleHandler,

        openExcelDocumentSidebar,
        excelDocumentSidebartoggleHandler,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
