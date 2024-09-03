import React, { Suspense, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.scss";
import EntryModal from "./page/EntryModal";
import { useSelector } from "react-redux";
import Loader from "./components/common/Loader";
import Routes from "./router";

const App = () => {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const { loader } = useSelector((state) => state.loaders);

  const handleClose = () => {
    document.body.classList.remove("no-scroll");
    window.location.href = "https://www.google.com";
  };

  const handleConfirm = () => {
    setShowEntryModal(false);
    document.body.classList.remove("no-scroll");
  };

  useEffect(() => {
    setShowEntryModal(true);
    document.body.classList.add("no-scroll");
  }, []);

  return (
    <>
      {showEntryModal && (
        <EntryModal onClose={handleClose} onConfirm={handleConfirm} />
      )}

      {loader && <Loader />}

      <Suspense fallback={<Loader />}>
        <Routes />
        {/* <ToastContainer autoClose={1000} /> */}
        <ToastContainer />
      </Suspense>
    </>
  );
};

export default App;
