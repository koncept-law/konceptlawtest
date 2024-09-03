import React from "react";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className=" w-full h-[100dvh] grid place-items-center">
      <div className=" text-center space-y-2">
        <h1 className=" text-gray-700 font-bold text-7xl">Oops!</h1>
        <h1 className=" text-gray-600 font-bold text-2xl">
          403 Permission Denied
        </h1>
        <p className=" text-gray-600 text-lg font-semibold">
          Sorry, you do not access to this page, please contact your
          admininstartor
        </p>
        <button
          onClick={() => navigate(-1)}
          className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold mx-auto"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Forbidden;
