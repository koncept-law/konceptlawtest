import React from "react";

const EntryModal = ({ onClose, onConfirm }) => {
  return (
    <div className=" w-full h-full bg-black fixed top-0 left-0 z-40 bg-opacity-50 grid place-items-center">
      <div className=" bg-[#1a4789] w-[90%] md:w-[75%]  lg:w-[50%] rounded-lg animate-slideBottom transition-all duration-300">
        <p className="px-5 py-6 text-white text-lg">
          As per The Bar Council of India Rules and The Advocates Act, 1961, an
          advocate cannot approach his/her client or advertise or promote his
          profession by way of advertisements or solicitation. Thus, this
          website has not been created to approach or solicit our client or
          advertise. we provide some necessary information about our practice
          and services to our existing clients. The contents of this website
          shall not be considered as Legal Advice as the contents thereof is not
          exhaustive. It is only introductory. In cases where the user has any
          legal issues, he/she in all cases must seek independent legal advice.
        </p>
        <div className=" bg-white px-4 py-4 flex items-center justify-end gap-4">
          <button
            className=" text-white bg-[#1a4789] px-4 py- rounded-md text-xl font-bold hover:-translate-y-1 transition-all duration-300"
            onClick={onConfirm}
          >
            I AGREE
          </button>
          <button
            className=" text-white bg-[#1a4789] px-4 py- rounded-md text-xl font-bold hover:-translate-y-1 transition-all duration-300"
            onClick={onClose}
          >
            DISAGREE
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryModal;
