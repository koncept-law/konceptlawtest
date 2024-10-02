import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  getCampaignEmailTemplateThunkMiddleware,
  getCampaignLogsThunkMiddleware,
  sendCampaignEmailThunkMiddleware,
  testEmailSendThunkMiddleware,
} from "../../../../../redux/features/campaigns";
import JoditEditor from 'jodit-react';
import EmailBox from "./EmailBox";
import { Select } from "antd";
import EmailTestModal from "../../../../../common/modals/EmailTestModal";
import { RiMessage2Line } from "react-icons/ri";
import { Button } from "@material-tailwind/react";
import { toastify } from "../../../../toast";

import { FaAnglesLeft } from "react-icons/fa6"; // left
import { FaAnglesRight } from "react-icons/fa6"; // right
import { TfiLayoutLineSolid } from "react-icons/tfi";
import createAxiosInstance from "../../../../../config/axiosConfig";
import MobileFrame from "../../../../../common/MobileFrame";
import EmailTemplateEditor from "./EmailTemplateEditor";

import { MdCreate } from "react-icons/md";
import { toastifyError } from "../../../../../constants/errors";
import ConfirmModal from "../../../../../common/modals/ConfirmModal";
import usePath from "../../../../../hooks/usePath";
import InputWithSelectField from "../../../../../common/fields/InputWithSelectField";
import { useForm } from "react-hook-form";
import DropdownOption from "../../../../../common/fields/DropdownOption";
import FilterOption from "../../../../../functions/FilterOption";

const BulkEmail = () => {

  const textRef = useRef(null)
  const messageRef = useRef(null);
  const sampleMessageRef = useRef(null);
  const axios = createAxiosInstance();
  const path = usePath();
  const {
    control,
    formState: {
      errors
    },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const [subject, setSubject] = useState("");
  // const [text, setText] = useState("");
  const [html, setHtml] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailModal, setEmailModal] = useState(false);
  const [bankName, setBankName] = useState("");
  const [DropDownList, setDropDownList] = useState([]);
  const [variablesData, setVariablesData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [isfillVariables, setIsFillVariables] = useState(false);
  // const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);
  // const emailTextRef = useRef(null)

  const emailOption = [
    // { label: "dhimandeepak957@gmail.com", value: "dhimandeepak957@gmail.com" },
    { label: "konceptlegalllp@yahoo.in", value: "konceptlegalllp@yahoo.in" },
    { label: "bahlkamal@gmail.com", value: "bahlkamal@gmail.com" },
    { label: "advambikamehra@gmail.com", value: "advambikamehra@gmail.com" },
    { label: "info@konceptlawassociates.com", value: "info@konceptlawassociates.com" }
  ]

  const { campaignEmailTemplates, campaignDetails, emailCategories } = useSelector(
    (state) => state.campaigns
  );
  const { singleUser } = useSelector(state => state.campaigns);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleDropdownApi = async () => {
      try {
        const response = await axios.post("https://t.konceptlaw.in/campaign/readExcelHeaders", { campaignName: campaignDetails.name });
        const data = response.data;
        setDropDownList(data)
      } catch (error) {
        // console.error(error)
        toastifyError(error, (call) => {
          if (call === "logout") {
            navigate("/login");
          }
        })
      }
    }
    handleDropdownApi();
    dispatch(getCampaignEmailTemplateThunkMiddleware());
  }, []);

  console.log("single user", singleUser);

  const templateData = useMemo(() => {
    // Filter and map over campaignEmailTemplates to create options only for matching accountId
    return campaignEmailTemplates
      ? campaignEmailTemplates
        .filter((item) => item?.accountId === singleUser?.accountId) // Filter matching accountId
        .map((item) => ({
          label: <DropdownOption title={item?.templateName} value={item} />,
          value: item?.templateName,
        }))
      : [];
  }, [campaignEmailTemplates, singleUser?.accountId]);

  const selectTemplate = useMemo(() => {
    return campaignEmailTemplates?.filter((item) => (item?.templateName === selectedTemplate))[0];
  }, [selectedTemplate]);

  console.log("Template Data:", templateData);
  console.log("select template",selectTemplate)

  const testEmailHandler = (e) => {
    // console.log(e);
    if (!e["cc"]) {
      toastify({ msg: "'CC' is not defined. Please check your configuration.", type: "error" })
      setOpenConfirm(false);
      return null;
    }
    let data = {
      campaignName: campaignDetails?.name,
      variables: variablesData,
      type: selectTemplate?.type,
      html: selectTemplate?.html,
      category: emailCategories?.category,
      subject: subject,
      message: messageRef.current.innerText,
      sampleMessage: sampleMessageRef.current.innerText,
      templateId: selectTemplate?.templateId,
      templateName: selectTemplate?.templateName,
      cc: e["cc"],
    }
    console.log("save and send", data)
    if (subject && subject !== "") {
      dispatch(
        testEmailSendThunkMiddleware(data)
      );
      navigate("/campaigns/campaigndetails/reports");
      setOpenConfirm(false);
    } else {
      toastify({ msg: "subject not fill", type: "error" })
    }
    setOpenConfirm(false);
  };

  const sampleEmailHandler = async (e, event) => {
    console.log(e);
    const response = await axios.post("/campaign/getValueBySingleHeader", { campaignName: campaignDetails.name, header: campaignDetails?.longLink });
    let getValue = response.data;

    // if (!e["cc"]) {
    //   toastify({ msg: "'CC' is not defined. Please check your configuration.", type: "error" })
    //   setOpenConfirm(false);
    //   return null;
    // }
    let data = {
      campaignName: campaignDetails?.name,
      variables: variablesData,
      type: selectTemplate?.type,
      html: selectTemplate?.html,
      category: emailCategories?.category,
      subject: subject,
      message: messageRef.current.innerText,
      sampleMessage: sampleMessageRef.current.innerText,
      templateId: selectTemplate?.templateId,
      templateName: selectTemplate?.templateName,
      cc: e["cc"],
      long_link: getValue?.value,
    }

    // console.log(data);

    let html = selectTemplate?.html;
    // Replace all occurrences of each variable with its corresponding value
    Object.keys(variablesData).forEach((variable) => {
      const regex = new RegExp(`{{\\${variable}}}`, 'g'); // Create a regex to match the placeholder
      html = html.replace(regex, variablesData[variable]); // Replace the placeholders in the HTML
    });

    console.log("save and send", data)
    let form = {
      campaignName: campaignDetails?.name,
      email: event["email"],
      cc: e["cc"],
      html: data?.sampleMessage,
    }

    console.log(form);

    if (subject && subject !== "") {
      const response = await axios.post("/campaign/sample-email", form);
      if (response.status === 200) {
        toastify({ msg: response.data?.message | "Sample Email Send Successfully" });
      }
    } else {
      toastify({ msg: "subject not fill", type: "error" })
    }
  };

  const navigate = useNavigate();
  const emailLogsHandler = () => {
    dispatch(
      getCampaignLogsThunkMiddleware(
        {
          campaignName: campaignDetails.name,
          logsType: "Email",
        },
        () => {
          navigate("logs");
        }
      )
    );
  };

  const handleSelectedTemplate = (value) => {
    if (value === "select") {
      setSelectedTemplate("")
    } else {
      if (value !== "" || value !== "select") {
        setSelectedTemplate(value)
      }
    }
  }

  // console.log("selected template", selectedTemplate)

  return (
    <>
      <EmailTestModal
        isModalVisible={emailModal}
        setIsModalVisible={setEmailModal}
        onSubmit={handleSubmit((data, event) => sampleEmailHandler(data, event))}
      />
      <ConfirmModal
        open={openConfirm}
        setOpen={setOpenConfirm}
        title={
          <>Are you sure you want to <strong>Save & Send</strong> bulk emails? This action will immediately send emails to all selected recipients.</>
        }
        onConfirm={handleSubmit(testEmailHandler)}
      />
      <div className="overflow-y-auto h-[90vh] w-full py-2 md:gap-4 space-y-1">
        {/* Topbar  */}
        <div className="h-fit px-4 py-1 flex sm:flex-row flex-col gap-y-4 sm:gap-y-0 w-full justify-between bg-white rounded-md">
          <div className=" flex items-center gap-4">
            {/* <button
              // onClick={() => navigate("/campaigns/campaigndetails/email/categories")}
              onClick={() => path.back()}
              className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
            >
              <IoMdArrowRoundBack size={26} />
            </button>
            <h1 className=" text-xl font-semibold">Bulk Email Campaign</h1> */}
            <h1 className=" text-xl font-semibold">Send Bulk Email</h1>
          </div>
          <div className="flex flex-wrap sm:items-center items-start gap-2">
            <button
              onClick={emailLogsHandler}
              className=" flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded-md text-white font-semibold"
            >
              Logs
            </button>
            <button
              onClick={() => navigate("/campaigns/campaigndetails/email/create-template")}
              className=" flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white font-semibold"
            >
              Create Template
            </button>

            <Button className={`flex justify-center items-center gap-x-1 font-poppins capitalize font-medium not-italic leading-normal text-white shadow-sm rounded-sm py-1 text-[15px] bg-slate-700 px-3 ${selectedTemplate !== "" && subject !== "" && !isfillVariables && watch("cc") !== "" ? "" : "cursor-not-allowed bg-slate-500"
              }`}
              onClick={
                selectedTemplate !== "" && subject !== "" && !isfillVariables && watch("cc") !== "" ? () => setOpenConfirm(true) : () => { }
              }>
              <span>Save & Send</span>
            </Button>

            {/* <button
              // onClick={testEmailHandler}
              onClick={() => setOpenConfirm(true)}
              className=" flex items-center gap-1 bg-gray-600 px-2 py-1 rounded-md text-white font-semibold"
            >
              Save & Send
            </button> */}
          </div>
        </div>

        <div className=" bg-white rounded-md p-3">
          <div className="flex justify-end items-center w-full">
            {/* <h1 className=" font-bold py-2">Send Bulk Email</h1> */}
            <div className="flex justify-center gap-x-2 items-center">
              <Button className={`flex justify-center items-center gap-x-1 font-poppins capitalize font-medium not-italic leading-normal text-white shadow-sm rounded-sm py-1 text-[15px] bg-slate-700 px-3 ${selectedTemplate !== "" && subject !== "" && !isfillVariables && watch("cc") !== "" ? "" : "cursor-not-allowed bg-slate-500"
                }`}
                onClick={
                  selectedTemplate !== "" && subject !== "" && !isfillVariables && watch("cc") !== "" ? () => setEmailModal(true) : () => { }
                }>
                <RiMessage2Line size={"16px"} />
                <span>Sample Email</span>
              </Button>
            </div>
          </div>
          <form action="" className=" space-y-3">
            <div className=" flex flex-col gap-2 rounded" >
              <label htmlFor="" className="text-sm font-semibold">
                Select Template :
              </label>
              <Select
                placeholder="Select an Option"
                // defaultValue={{ label: "Select an Option", value: "select" }}
                className="rounded flex-1 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                // options={selectOptions}
                // options={[{ label: "Select A Template", value: "" }, ...(campaignWhatsappTemplates?.map((option, index) => ({ label: option?.templateName, value: index })) || [])]}
                // options={[{ label: "Select an Template", value: "select" }, { label: "Template 2", value: "templet2" }]}
                options={[{ label: "Select A Template", value: "" }, ...templateData]}
                onChange={(value) => handleSelectedTemplate(value)}
              />
            </div>

            <div className=" flex flex-col gap-1 rounded flex-1">
              <label htmlFor="" className="text-sm font-semibold">
                Subject :
              </label>
              <input
                type="text"
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onChange={(e) => setSubject(e.target.value)}
                value={subject}
              />
            </div>

            <div className=" flex flex-col gap-1 rounded flex-1">
              <label htmlFor="" className="text-sm font-semibold">
                CC :
              </label>
              <InputWithSelectField
                options={emailOption}
                placeholder="Write Email"
                selectPlaceholder="Select Email"
                control={control}
                name="cc"
              />
            </div>
            <EmailTemplateEditor
              messageRef={messageRef}
              sampleMessageRef={sampleMessageRef}
              template={selectTemplate}
              dropdown={DropDownList}
              isFill={(fill) => {
                if (fill) {
                  setIsFillVariables(false);
                } else {
                  setIsFillVariables(true);
                }
              }}
              onEdit={(data) => {
                setVariablesData(data);
              }}
            />
            <div className=" flex justify-center items-start gap-1 rounded">
              <div className="flex flex-col justify-center gap-y-6 w-1/2 items-center">
                <div className="flex justify-center items-center gap-x-2">
                  <FaAnglesRight size={18} />
                  <h2 className="font-poppins text-lg not-italic leading-normal font-medium text-red-600">Instructions</h2>
                  <FaAnglesLeft size={18} />
                </div>
                <div className="flex font-poppins not-italic text-[15px] leading-normal text-[#419229] font-semibold justify-center items-center gap-x-0.5">
                  <h2 className="font-bold text-[#000000] mr-2 text-lg">Excel Headers:</h2>
                  <span>CUSTOMER NAME</span>
                  <TfiLayoutLineSolid size={15} className="rotate-90 text-[#000000]" />
                  <span>Email Address</span>
                  <TfiLayoutLineSolid size={15} className="rotate-90 text-[#000000]" />
                  <span>LONG_LINK</span>
                  <TfiLayoutLineSolid size={15} className="rotate-90 text-[#000000]" />
                  <span>BANK NAME</span>
                </div>
              </div>
              <div className="flex justify-center gap-x-6 items-start w-1/2">
                <h2 className="text-lg font-poppins not-italic leading-normal font-semibold">Preview:</h2>
                <MobileFrame text={subject} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BulkEmail;
