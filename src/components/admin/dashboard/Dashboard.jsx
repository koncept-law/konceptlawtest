import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.scss";
import { jwtDecode } from "jwt-decode";
const Dashboard = () => {
  return (
    <div className=" p-4 min-h-[94vh] w-full flex justify-center items-center">
      <div className="flex flex-wrap gap-10 items-center justify-center py-20">
        <Link
          to="https://districts.ecourts.gov.in/delhi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className=" hover:-translate-y-1 transition-all ease-in duration-300 lg:w-96 h-40 custom-tile flex items-center sm:w-72 w-72 overflow-hidden cursor-pointer relative shadow-lg rounded-2xl voilet">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-white">
                District Courts Of Delhi
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="https://sms.konceptlawassociates.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="hover:-translate-y-1 transition-all ease-in duration-300 lg:w-96 h-40 custom-tile flex items-center sm:w-72 w-72 overflow-hidden relative shadow-lg rounded-2xl blue">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-white">SMS</div>
            </div>
          </div>
        </Link>

        <Link
          to="https://cubeivr.in/quickCall/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="hover:-translate-y-1 transition-all ease-in duration-300 lg:w-96 h-40 custom-tile flex items-center sm:w-72 w-72 overflow-hidden relative shadow-lg rounded-2xl pink">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-white">
                Quick Call
              </div>
            </div>
          </div>
        </Link>

        <Link
          to="https://manage.karix.solutions/login"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="hover:-translate-y-1 transition-all ease-in duration-300 lg:w-96 h-40 custom-tile flex items-center sm:w-72 w-72 overflow-hidden relative shadow-lg rounded-2xl red">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-white">Email</div>
            </div>
          </div>
        </Link>

        <Link
          to="https://crm.konceptlawassociates.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="hover:-translate-y-1 transition-all ease-in duration-300 lg:w-96 h-40 custom-tile flex items-center sm:w-72 w-72 overflow-hidden relative shadow-lg rounded-2xl yellow">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-white">Whatsapp</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
