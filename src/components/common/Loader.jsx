import React from "react";
import Spinner from "./Spinner";

const Loader = () => {
  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 grid place-items-center  z-50">
      <Spinner />
    </div>
  );
};

export default Loader;
