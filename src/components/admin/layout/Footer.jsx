import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="px-5 pb-3">
      <div className="bg-white py-3 shadow rounded px-10 flex items-center justify-center">
        <p>
          Copyright ©{" "}
          <Link to={"/"} className="text-gray-700 font-bold">
            Koncept Law Associates
          </Link>
          . All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
