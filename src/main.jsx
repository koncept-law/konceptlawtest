import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { TableDataContextProvider } from "./common/context/TableDataContext.jsx";
import { SidebarProvider } from "./common/context/SidebarContext.jsx";
import { TrackingTableDataContext } from "./common/context/TrackingTableDataContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ExcelDataContextProvider } from "./common/context/ExcelDataContext.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <TableDataContextProvider>
        <ExcelDataContextProvider>
          <TrackingTableDataContext>
            <App />
          </TrackingTableDataContext>
        </ExcelDataContextProvider>
      </TableDataContextProvider>
    </Provider>
  </BrowserRouter>
  // </React.StrictMode>
);
