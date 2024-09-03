import { Button } from "@material-tailwind/react";
import React, { useState } from "react";

// icons
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa6"; // back
import { FaArrowRight } from "react-icons/fa6"; // next
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Select } from "antd";
import usePath from "../../../../../hooks/usePath";

const SmsApplication = () => {
    const navigate = useNavigate();
    const { campaignTemplates, campaignDetails, singleUser } = useSelector(
        (state) => state.campaigns
    );
    const path = usePath();

    const [ShowSaveConfirmMessage, setShowSaveConfirmMessage] = useState(false);

    const NextEvent = () => {
    }

    const BackEvent = () => {
        // navigate("/campaigns/sms/categories");
        path.back();
    }

    return <>
        <div className="w-full">
            {/* Topbar  */}
            <div className="h-fit px-4 py-2 shadow-md shadow-slate-200 flex md:flex-row flex-col gap-y-2 md:my-0  w-full justify-between bg-white rounded-md">
                <div className=" flex items-center gap-4">
                    <button
                        onClick={() => navigate("/campaigns/campaigndetails")}
                        className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                    >
                        <IoMdArrowRoundBack size={26} />
                    </button>
                    <h1 className=" text-xl font-poppins not-italic font-medium text-slate-700 leading-normal">Sms Campaign Application</h1>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        // onClick={smsLogsHandler}
                        className=" flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded-md text-white font-semibold"
                    >
                        Logs
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            //   if (selectedTemplate) {
                            //     setShowSaveConfirmMessage(true);
                            //   }
                        }}
                        className=" flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white font-semibold"
                    >
                        Save
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            //   if (selectedTemplate) {
                            //     setShowSaveAndSendConfirmMessage(true);
                            //   }
                        }}
                        className=" flex items-center gap-1 bg-gray-600 px-2 py-1 rounded-md text-white font-semibold"
                    >
                        Save & Send
                    </button>
                </div>
            </div>

            <div className="w-full flex flex-col">
                <div className="flex justify-between w-full items-end my-4">
                    <label htmlFor="" className="text-lg font-poppins not-italic leading-normal font-semibold">
                        Select Applications :
                    </label>
                    <div className="flex justify-center items-center gap-x-4">
                        <Button className="bg-gray-100 text-[#242424] text-[15px] gap-x-2 flex justify-center items-center capitalize font-poppins not-italic leading-normal py-2 px-4" onClick={BackEvent}>
                            <FaArrowLeft size={16} />
                            <span>Back</span>
                        </Button>

                        <Button className="bg-slate-800 text-gray-50 gap-x-2 flex justify-center items-center capitalize font-poppins not-italic leading-normal text-[15px] py-2 px-4" onClick={NextEvent}>
                            <span>Next</span>
                            <FaArrowRight size={16} />
                        </Button>
                    </div>
                </div>
                <div className="w-full flex flex-col">
                    <div className="flex justify-between w-full items-center">

                        {/* <Button className=" flex items-center text-center justify-center bg-blue-600 rounded-sm text-white font-semibold text-[15px] font-poppins capitalize font-poppins not-italic leading-normal px-2 py-1">
                            <Link
                                // onClick={sendSmsHandler}
                                to="/campaigns/campaigndetails/sms/createtemplate"
                                className="w-full"
                            >
                                Create Template
                            </Link>
                        </Button> */}
                    </div>

                    {
                        campaignTemplates && (
                            <Select
                                placeholder="Select an Option"
                                // defaultValue={{ label: "Select an Option", value: "select" }}
                                className="rounded flex-1 my-3 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                                // options={selectOptions}
                                options={[{ label: "Select A Template", value: "" }, ...(campaignTemplates?.map((option, index) => ({ label: option?.templateName, value: index })) || [])]}
                            // onChange={(value) => setSelectedTemplateIndex(value)}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    </>
}

export default SmsApplication;