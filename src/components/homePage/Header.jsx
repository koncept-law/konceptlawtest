import React from "react";
import { Link } from "react-router-dom";
import logo from "./../../assets/konceptLogo.png";

const Header = () => {
  return (
    <div className=" flex items-center justify-between w-[90%] mx-auto py-[2rem]">
      {/* Logo  */}
      <div>
        <div className=" flex items-center gap-2">
          <div className=" w-[5rem] h-[4rem] flex">
            <img src={logo} alt="logo" className=" w-full h-full" />
          </div>
          <div>
            <p className=" text-2xl font-bold logo-color">
              Koncept Law Associates
            </p>
          </div>
        </div>
      </div>

      {/* NavItem  */}
      <div className=" text-white text-xl font-bold border-2 grid place-items-center border-white rounded ">
        <Link className="px-6 py-1" to={"/login"}>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Header;
