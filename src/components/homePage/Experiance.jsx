import React from "react";
import { HiOutlineUserGroup } from "react-icons/hi";

const Experiance = () => {
  return (
    <div className="w-full  px-4 sm:px-10 md:px-[6rem] py-10 pb-[8rem] flex items-center gap-[4rem] lg:gap-[2rem] xl:gap-[4rem] flex-col-reverse  lg:flex-row transition-all duration-300 bg-gray-100">
      {/* Left About Contet  */}
      <div className="w-[100%] sm:w-[70%] lg:w-[35%]  relative h-[70vh] xl:h-[65vh] ">
        <div className="w-[80%] h-[90%] imageBackground p-6 rounded-[3rem]  absolute left-6 -bottom-2 sm:-bottom-6  "></div>
        <div className="w-[100%] top-16 md:top-0 left-0 absolute h-[80%] md:h-full ">
          <img
            src="https://www.govindnarayanlaw.in/img/about.jpg"
            alt="about us"
            className="rounded-l-[3rem] w-full h-full "
          />
        </div>

        <div className="absolute -bottom-12 left-0 w-[50%] h-[28%] imageBackground border-[0.8rem] border-white rounded-r-[2rem] rounded-tl-[2rem] text-white text-center grid place-items-center ">
          <div>
            <h1 className="text-3xl sm:text-5xl font-bold relative">
              19+ <span className="text-xl absolute sm:ml-2 ">Th</span>
            </h1>
            <p className="sm:text-xl">Years Experience</p>
          </div>
        </div>
      </div>

      {/* Right About Banner */}
      <div className=" lg:flex-1 ">
        <div>
          <h3 className="text-secondary_color text-3xl font-bold  my-4">
            Koncept Law Associates
          </h3>
        </div>

        <div className="p-7 border-l-4 border-sky-600 rounded-tl-3xl">
          <p className=" text-lg text-text_color1">
            At <span className=" font-semibold"> Koncept Law Associates</span>,
            we first and foremost believe in securing our client's interest by
            keeping in mind the correct position of law and using our experience
            of more than 19 years in the field of litigation. The firm is
            established on core beliefs like transparency, loyalty, dedication
            and unwavering focus for achieving the ends of justice for our
            clients. We are well-experience and well-rounded professional, the
            firm is lucky enough to specialize in criminal cases, civil
            litigation, domestic voielence, Haryana real estate regularoty Act,
            cheque bounces, Hindu Marriage Act, Muslim Marriage Act, Domestic
            violence etc.. The goal is to amalgamate the skills developed
            through the years with relentless diligence to ensure the desired
            relief for the people we represent, while simultaneously upholding
            the rule of law.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Experiance;
