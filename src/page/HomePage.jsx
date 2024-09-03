import React from "react";
import Header from "../components/homePage/Header";
import "./HomePage.scss";
import Bottom from "../components/homePage/Bottom";
import { useInView } from "react-intersection-observer";
import animationData from "../assets/homePage/animationData/homePage.json";
import Experiance from "../components/homePage/Experiance";
import { FaUsers } from "react-icons/fa6";
import { FaBriefcase } from "react-icons/fa";
import { FaHammer } from "react-icons/fa";
import Footer from "../components/homePage/Footer";

const HomePage = () => {
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="">
      {/* Home Content with Header  */}
      <div
        ref={ref}
        className={` ${
          inView && "animate-slideRight"
        } imageBackground min-h-[100vh] px-4 sm:px-10 md:px-[6rem] flex flex-col`}
      >
        {/* Header */}
        <Header />

        {/* Mian Content  */}
        <div className=" flex-1 py-10 flex items-center justify-center ">
          <div
            className={`md:px-[2rem] lg:px-[6rem] p-4 grid sm:grid-cols-2 md:grid-cols-3 gap-8   ${
              inView && "animate-slideUp"
            } `}
          >
            <div className="flex gap-4 p-3 bg-white hover:bg-[#1a4789] hover:text-white transition-all duration-300 shadow-xl rounded-xl relative ">
              <div className=" text-3xl mt-1">
                <FaUsers />
              </div>

              <div className=" space-y-2 ">
                <h1 className=" text-2xl font-semibold">Civil Litigation</h1>
                <p className="">
                  The Civil Law is certainly and indubitably the most important
                  and magnificent branch of the law in India. The civil law in
                  India comprises of the laws formed and followed at federal and
                  state levels, and rulings by courts of law made from time to
                  time in the country.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 bg-white hover:bg-[#1a4789] hover:text-white transition-all duration-300 shadow-xl rounded-xl">
              <div className=" text-3xl mt-1">
                <FaBriefcase />
              </div>

              <div className=" space-y-2">
                <h1 className=" text-2xl font-semibold">Cheque Bounces</h1>
                <p className="">
                  If you are facing any cheque bounce issue where the debtor has
                  issued a cheque with insufficient funds or the cheque has been
                  dishonoured and want to take legal action against such a
                  party, you can find the cheque bounce lawyers at Koncept Law
                  Associates.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-3 bg-white hover:bg-[#1a4789] hover:text-white transition-all duration-300 shadow-xl rounded-xl">
              <div className=" text-3xl mt-1">
                <FaHammer />
              </div>

              <div className=" space-y-2">
                <h1 className=" text-2xl font-semibold">Criminal Cases</h1>
                <p className="">
                  We specialises in criminal law services and representing
                  clients in criminal law cases in district courts in Delhi. We
                  have extensive legal practice in in criminal cases related to
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Experiance />
      <Bottom />
      <Footer />
    </div>
  );
};

export default HomePage;
