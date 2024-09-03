import React from "react";
import logo from "../../assets/homePage/logo.svg";
import { useInView } from "react-intersection-observer";

const Bottom = () => {
  const { ref, inView, entry } = useInView({
    /* Optional options */
    triggerOnce: true,
  });

  return (
    <div className="bg-[#1a193b] px-4  sm:px-10 md:px-[6rem] py-10 flex flex-col gap-10 ">
      <div
        className={` ${
          inView && "animate-zoomOut"
        } lg:w-[60%] px-10 py-6 text-[#57e4ff] flex flex-col`}
      >
        <span className="  text-xl sm:text-3xl md:text-5xl">
          We'd Love To Hear From You
        </span>
        <span className="text-2xl sm:text-4xl lg:text-6xl">CONTACT US</span>
      </div>

      <div
        className=" flex items-center gap-16 lg:gap-10  flex-col lg:flex-row"
        ref={ref}
      >
        <div
          className={`${
            inView && "animate-zoomOut"
          } w-full sm:w-[70%] lg:w-[50%]  `}
        >
          <div className="bg-white px-6 py-4 border-b border-black">
            <h1 className=" text-[#0a1a44] text-2xl font-semibold">
              Get In Touch
            </h1>
            <div className=" pt-2 text-lg -space-y-2">
              <p className="text-[#0a1a44]">9810201011</p>
              <p>konceptlegalllp@yahoo.in</p>
            </div>
          </div>

          <div className="bg-white px-6 py-4">
            <h1 className=" text-[#0a1a44] text-2xl font-semibold">
              Find Us Here
            </h1>
            <div className=" pt-2 text-lg -space-y-2">
              <p className="text-[#0a1a44]">
                98, Priyadarshani Vihar, Delhi – 110 009
              </p>
              {/* <p className="text-[#0a1a44]">Delhi 110009</p> */}
            </div>
          </div>
          <div className="  bg-[#57e4ff] px-6 py-4 text-center">
            <h1 className=" text-[#0a1a44] text-2xl font-semibold">
              Working Hours
            </h1>
            <div className=" pt-2 text-lg -space-y-2">
              <p className="text-[#0a1a44]">Monday - Friday</p>
              <p className="text-[#0a1a44]">10 am to 6 pm</p>
            </div>
          </div>
        </div>

        <div className={`${inView && "animate-zoomOut"} flex-1`}>
          <div className=" h-[20rem] w-auto">
            <img src={logo} alt="logo" className=" h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottom;
