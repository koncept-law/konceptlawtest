import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCampaignSmsTemplateThunkMiddleware,
  getCampaignByNameThunkMiddleware,
  getCampaignLogsThunkMiddleware,
  getCampaignSmsTemplateThunkMiddleware,
  getSmsCampaignByNameThunkMiddleware,
  saveAndSendCampaignSmsAirtelTemplateThunkMiddleware,
  saveAndSendCampaignSmsTemplateThunkMiddleware,
  sendCampaignSmsTemplateThunkMiddleware,
  testCampaignSmsTemplateThunkMiddleware,
} from "../../../../redux/features/campaigns";
import { IoMdArrowRoundBack } from "react-icons/io";
import { TiArrowRepeat } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";

// icons
import { MdDeleteOutline } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { LiaSave } from "react-icons/lia";
import { TbFileUpload } from "react-icons/tb";

import { Select } from "antd";
// import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import axios from "axios";
import { toastify } from "../../../../components/toast.js";
import ConfirmMessage from "../../../common/ConfirmMessage.jsx";
import PhoneTestModal from "../../../../common/modals/PhoneTestModal.jsx";
import { RiMessage2Line } from "react-icons/ri";
import { Button } from "@material-tailwind/react";
import { toastifyError } from "../../../../constants/errors.js";
import usePath from "../../../../hooks/usePath.js";

import { SiAirtel } from "react-icons/si";
import { SiVexxhost } from "react-icons/si";
import DropdownOption from "../../../../common/fields/DropdownOption.jsx";

const SmsCampaign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = usePath();

  // const [selectVender, setSelectVender] = useState("airtel");
  const [selectVender, setSelectVender] = useState("enableX");

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);

  const { campaignTemplates, campaignDetails, singleUser, smsCategories } = useSelector(
    (state) => state.campaigns
  );
  // console.log("Single User", singleUser);
  const userName = singleUser?.firstName + (singleUser?.lastName ? ` ${singleUser?.lastName}` : "");
  // console.log("user name", userName);
  // console.log("sms Categories", smsCategories);

  const category = useMemo(() => {
    return smsCategories?.category?.categories ? smsCategories?.category?.categories : "all";
  }, [smsCategories]);

  // console.log("category:", category);

  const templateOptions = useMemo(() => {
    const defaultOption = { label: "Select A Template", value: "" };

    // Ensure campaignTemplates is always an array
    const templates = Array.isArray(campaignTemplates) ? campaignTemplates : [];

    if (selectVender === "airtel") {
      return [
        // defaultOption,
        ...templates
          ?.filter(option => option?.vender === "airtel") // Filter options for "airtel" vender
          ?.filter(item => item) // Remove any falsy values
      ];
    } else {
      return [
        // defaultOption,
        ...templates
          ?.filter(option => !option?.vender || option?.vender !== "airtel") // Filter options not "airtel" or no vender
          ?.filter(item => item) // Remove any falsy values
      ];
    }
  }, [selectVender, campaignTemplates, singleUser?.accountId]);

  const selectedTemplate = useMemo(
    // () => campaignTemplates ? campaignTemplates[selectedTemplateIndex] : null,
    () => campaignTemplates ? templateOptions[selectedTemplateIndex] : null,
    [selectedTemplateIndex, templateOptions]
  );

  // console.log(templateOptions);
  // console.log(selectedTemplate);

  useEffect(() => {
    dispatch(getCampaignSmsTemplateThunkMiddleware());
  }, []);

  const [ShowDeleteConfirmMessage, setShowDeleteConfirmMessage] = useState(false);
  const [ShowSaveConfirmMessage, setShowSaveConfirmMessage] = useState(false);
  const [ShowSaveAndSendConfirmMessage, setShowSaveAndSendConfirmMessage] = useState(false);

  const [selectedVariables, setSelectedVariables] = useState({});
  const [userDisplayVariables, setUserDisplayVariables] = useState({})
  const [messageInTemplate, setMessageInTemplate] = useState(``);
  const [dropDownList, setDropDownList] = useState(null);
  const [headerValue, setHeaderValue] = useState(null);
  const [activeInputMethods, setActiveInputMethods] = useState({}); // Track active input methods
  const [message, setMessage] = useState(``)
  const [textVariableCount, setTextVariableCount] = useState(null);
  const [variableCount, setVariableCount] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [OpenTestBox, setOpenTestBox] = useState(false);

  // changes made by abhyanshu

  const sendSmsHandler = async () => {
    if (!selectedTemplate || variableCount !== textVariableCount) {
      return;
    }
    try {
      if (selectedTemplate && variableCount === textVariableCount) {
        dispatch(
          sendCampaignSmsTemplateThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            message: selectedTemplate.message,
            variables: selectedVariables,
            campaignName: campaignDetails.name,
            senderId: senderId ? senderId : "KNCPTL",
          },
            (error) => {
              if (!error) {
                navigate("/campaigns/campaigndetails/reports")
              }
            }
            // setTimeout(() => {
            //   navigate("/campaigns/campaigndetails/reports")
            // }, 1500)
          )
        );

      }
    } catch (error) {
      // if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" })
      // } else {
      //   toastify({ msg: error.message, type: "error" })
      // }
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
  };


  const saveAndSendSmsHandler = () => {
    //  console.log({
    //     templateId: selectedTemplate.templateId,
    //     templateName: selectedTemplate.templateName,
    //     message: selectedTemplate.message,
    //     variables: selectedVariables,
    //     campaignName: campaignDetails.name,
    //     senderId: senderId ? senderId : "KNCPTL",
    //   });
    if (!selectedTemplate || variableCount !== textVariableCount) {
      return;
    }
    try {
      if (selectedTemplate && variableCount === textVariableCount) {
        if (selectVender === "airtel") {
          dispatch(
            saveAndSendCampaignSmsAirtelTemplateThunkMiddleware({
              templateId: selectedTemplate.templateId,
              templateName: selectedTemplate.templateName,
              message: selectedTemplate.message,
              variables: selectedVariables,
              campaignName: campaignDetails.name,
              senderId: senderId ? senderId : "KNCPTL",
            },
              (error) => {
                if (!error) {
                  navigate("/campaigns/campaigndetails/reports")
                }
              }
            )
          );
        } else {
          dispatch(
            saveAndSendCampaignSmsTemplateThunkMiddleware({
              templateId: selectedTemplate.templateId,
              templateName: selectedTemplate.templateName,
              message: selectedTemplate.message,
              variables: selectedVariables,
              campaignName: campaignDetails.name,
              senderId: senderId ? senderId : "KNCPTL",
            },
              (error) => {
                if (!error) {
                  navigate("/campaigns/campaigndetails/reports")
                }
              }
            )
          );
        }
        // dispatch(
        //   saveAndSendCampaignSmsTemplateThunkMiddleware({
        //     templateId: selectedTemplate.templateId,
        //     templateName: selectedTemplate.templateName,
        //     message: selectedTemplate.message,
        //     variables: selectedVariables,
        //     campaignName: campaignDetails.name,
        //     senderId: senderId ? senderId : "KNCPTL",
        //   },
        //     // setTimeout(() => {
        //     //   navigate("/campaigns/campaigndetails")
        //     // }, 1500)
        //     (error) => {
        //       if (!error) {
        //         navigate("/campaigns/campaigndetails/reports")
        //       }
        //     }
        //   )
        // );
      }
    } catch (error) {
      // if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" })
      // } else {
      //   toastify({ msg: error.message, type: "error" })
      // }
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
  };

  const smsLogsHandler = () => {
    dispatch(
      getCampaignLogsThunkMiddleware(
        {
          campaignName: campaignDetails.name,
          logsType: "Sms",
        },
        () => {
          navigate("logs");
        }
      )
    );
  };

  // changes made by abhyanshu
  const sendSmsDeleteHandler = (e) => {
    // if (selectedTemplate) {
    //   const response = dispatch(deleteCampaignSmsTemplateThunkMiddleware(selectedTemplate.templateId))
    //   toastify({ msg: response.data, type: "success" });
    //   navigate("/campaigns/campaigndetails/sms");
    // }
    if (!selectedTemplate) {
      return;
    }
    try {
      if (selectedTemplate) {
        dispatch(deleteCampaignSmsTemplateThunkMiddleware(selectedTemplate.templateId,
        )
        );
      }
    } catch (error) {
      // if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" })
      // } else {
      //   toastify({ msg: error.message, type: "error" })
      // }
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
  }

  const testMobile = (mobile) => {
    if (!selectedTemplate || variableCount !== textVariableCount) {
      return;
    }
    try {
      if (selectedTemplate && variableCount === textVariableCount) {
        // console.log("type", selectVender)
        dispatch(
          testCampaignSmsTemplateThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            // message: selectedTemplate.message,
            message: message,
            // variables: selectedVariables,
            type: selectVender,
            variables: userDisplayVariables,
            campaignName: campaignDetails.name,
            senderId: senderId ? senderId : "KNCPTL",
            mobile: mobile,
          }
          )
        );
      }
    } catch (error) {
      // if (error.response?.data) {
      //   toastify({ msg: error.response.data, type: "error" })
      // } else {
      //   toastify({ msg: error.message, type: "error" })
      // }
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
  }

  // changes made by abhyanshu
  useEffect(() => {
    if (selectedTemplate) {
      setMessageInTemplate(selectedTemplate.message)
    }
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

    if (!selectedTemplate) {
      setDropDownList(null)
      setMessageInTemplate("")
      setHeaderValue(null)
      setSelectedVariables({})
      setUserDisplayVariables({})
      setActiveInputMethods({})
      setMessage("")
    }


    handleDropdownApi();
  }, [selectedTemplate, messageInTemplate]);

  useEffect(() => {
    // Function to clear input method values in selectedVariables
    const clearInputMethodValues = () => {
      const updatedVariables = {};
      Object.keys(selectedVariables).forEach((key) => {
        if (activeInputMethods[key] === 'input') {
          updatedVariables[key] = ''; // Clear input method values
        } else {
          updatedVariables[key] = selectedVariables[key]; // Keep dropdown method values as is
        }
      });
      setSelectedVariables(updatedVariables);
    };

    // Call clearInputMethodValues when selectedTemplate changes
    clearInputMethodValues();

    const clearState = () => {
      setSelectedVariables({}); // Clear selected variables
      setUserDisplayVariables({})
      setHeaderValue(null); // Clear header value if applicable
      setActiveInputMethods({}); // Clear active input methods if needed
      setDropDownList(null); // Clear dropdown list if it's used
    };

    // Call clearState when selectedTemplateIndex changes
    clearState();
  }, [selectedTemplateIndex,])

  useEffect(() => {

    const getUpdatedString = (template, values) => {
      return template.replace(/{\$var(\d+)}/g, (match, variableIndex) => {
        const variableName = `$var${variableIndex}`;
        // console.log("variable value", values[variableName])
        return values[variableName] !== undefined ? values[variableName] : match;
      });
    };

    // for displaying values of first row under the header
    const updatedString = getUpdatedString(messageInTemplate, userDisplayVariables);
    // for displaying headers
    // const updatedString = getUpdatedString(messageInTemplate, selectedVariables);

    setMessage(updatedString);

    if (messageInTemplate.length !== 0) {
      let count = messageInTemplate.match(/{\$var(\d+)}/g);
      count = count ? count.length : 0;
      setTextVariableCount(count)
    }

    if (selectedVariables) {
      let count = selectedVariables;
      let noOfVariables = Object.keys(count);
      setVariableCount(noOfVariables.length)
    }

  }, [messageInTemplate, selectedVariables, variableCount, textVariableCount, userDisplayVariables])
  // changes made by abhyanshu  
  // console.log("selected variables count ", variableCount);
  // console.log("matched text in the message count ", textVariableCount);

  // console.log(selectedTemplate)
  // console.log(selectedVariables)
  // console.log("variables values need to be displayed to user", userDisplayVariables)
  // console.log(userDisplayVariables);

  return (
    <div className="overflow-y-auto h-full w-full px-2 py-2 md:gap-4 space-y-1">
      <PhoneTestModal isModalVisible={OpenTestBox} onSubmit={testMobile} setIsModalVisible={() => setOpenTestBox(false)} />

      {
        ShowDeleteConfirmMessage ? <>
          <ConfirmMessage yes="Yes, I am sure" className="flex-col" deleteBtn={true} no="No, I'm not sure!" value={(e) => {
            if (e) {
              sendSmsDeleteHandler()
            }
            setShowDeleteConfirmMessage(false);
          }}>
            <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Please confirm if you would like to delete this SMS campaign.</h2>
          </ConfirmMessage>
        </> : null
      }

      {
        ShowSaveConfirmMessage && selectedTemplate ? <>
          <ConfirmMessage yes="Yes, I am sure" className="flex-col" no="No, I'm not sure!" value={(e) => {
            if (e) {
              sendSmsHandler();
            }
            setShowSaveConfirmMessage(false);
          }}>
            <LiaSave size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Please confirm if you would like to save this SMS campaign.</h2>
          </ConfirmMessage>
        </> : null
      }
      {
        ShowSaveAndSendConfirmMessage && selectedTemplate ? <>
          <ConfirmMessage yes="Yes, I am sure" className="flex-col" no="No, I'm not sure!" value={(e) => {
            if (e) {
              saveAndSendSmsHandler();
            }
            setShowSaveAndSendConfirmMessage(false);
          }}>
            <TbFileUpload size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Please confirm if you would like to save and send this SMS campaign.</h2>
          </ConfirmMessage>
        </> : null
      }

      {/* Topbar  */}
      <div className="h-fit px-4 py-1 flex md:flex-row flex-col gap-y-2 md:my-0  w-full justify-between bg-white rounded-md">
        <div className=" flex items-center gap-4">
          {/* <button
            // onClick={() => navigate("/campaigns/campaigndetails")}
            // onClick={() => navigate("/campaigns/sms/categories")}
            onClick={() => path.back()}
            className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
          >
            <IoMdArrowRoundBack size={26} />
          </button>
          <h1 className=" text-xl font-semibold">Sms Campaign</h1> */}
          <h1 className=" text-xl font-semibold">Send SMS</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={smsLogsHandler}
            className=" flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded-md text-white font-semibold"
          >
            Logs
          </button>
          <button
            // onClick={(e) => {
            //   e.preventDefault();
            //   if (selectedTemplate) {
            //     setShowSaveConfirmMessage(true);
            //   }
            // }}
            // className=" flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white font-semibold"
            onClick={selectedTemplate && variableCount === textVariableCount ? (e) => {
              e.preventDefault();
              if (selectedTemplate) {
                setShowSaveConfirmMessage(true);
              }
            } : () => { }}
            className={`flex items-center gap-1  px-2 py-1 rounded-md text-white font-semibold ${selectedTemplate && variableCount === textVariableCount ? "bg-green-600" : "cursor-not-allowed bg-gray-500"}`}
          >
            Save
          </button>
          <button
            onClick={selectedTemplate && variableCount === textVariableCount ? (e) => {
              e.preventDefault();
              if (selectedTemplate) {
                setShowSaveAndSendConfirmMessage(true);
              }
            } : () => { }}
            // onClick={(e) => {
            //   e.preventDefault();
            //   if (selectedTemplate) {
            //     setShowSaveAndSendConfirmMessage(true);
            //   }
            // }}
            className={`flex items-center gap-1  px-2 py-1 rounded-md text-white font-semibold ${selectedTemplate && variableCount === textVariableCount ? "bg-gray-600" : "cursor-not-allowed bg-gray-500"}`}
          >
            Save & Send
          </button>
        </div>
      </div>

      <div className=" bg-white rounded-md h-full p-3">
        <form action="" className=" space-y-3">
          {
            userName === "TATA 1" && (
              <div className=" flex flex-col gap-2 rounded">
                <label htmlFor="" className="text-sm font-semibold">
                  Select Sender ID :
                </label>
                <div className="flex w-[100%] md:flex-row flex-col" >
                  <div className="md:w-[74%] w-[100%] md:my-0 my-2">
                    <Select
                      placeholder="Select an Option"
                      // defaultValue={{ label: "Select an Option", value: "select" }}
                      className="rounded h-[44px] outline-none w-full"
                      // options={selectOptions}
                      options={[
                        { label: "TATACI", value: "TATACI" },
                        { label: "KNCPTL", value: "KNCPTL" }
                      ]}
                      // onChange={(value) => setSelectedTemplateIndex(value)}
                      onChange={(value) => setSenderId(value)}
                    />
                  </div>
                </div>
              </div>
            )
          }

          {/* <div className=" flex flex-col gap-2 rounded">
            <label htmlFor="" className="text-sm font-semibold">
              Select Applications :
            </label>
            <div className="flex w-[100%] md:flex-row flex-col" >
              <div className="md:w-[74%] w-[100%] md:my-0 my-2">
                {
                  campaignTemplates && (
                    <Select
                      placeholder="Select an Option"
                      // defaultValue={{ label: "Select an Option", value: "select" }}
                      className="rounded flex-1 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                      // options={selectOptions}
                      options={[{ label: "Select A Template", value: "" }, ...(campaignTemplates?.map((option, index) => ({ label: option?.templateName, value: index })) || [])]}
                      onChange={(value) => setSelectedTemplateIndex(value)}
                    />
                  )
                }
              </div>
              <div className="flex justify-center">
                <Link
                  // onClick={sendSmsHandler}
                  to="/campaigns/campaigndetails/sms/createtemplate"
                  className=" flex items-center text-center justify-center bg-blue-600
                rounded-md text-white font-semibold text-[15px] font-poppins not-italic leading-normal h-fit mx-1 p-2"
                >
                  Create Template
                </Link>
                {
                  selectedTemplate ? (
                    <button
                      // onClick={sendSmsDeleteHandler}
                      onClick={(e) => {
                        e.preventDefault();
                        if (selectedTemplate) {
                          setShowDeleteConfirmMessage(true);
                        }
                      }}
                      className=" flex items-center justify-center bg-red-600  
                      rounded-md text-white font-semibold w-[150px] h-fit mx-1 p-2"
                    >
                      Delete Template
                    </button>
                  ) : ""
                }
              </div>
            </div>
          </div> */}

          <div className=" flex flex-col gap-2 rounded">
            <div className="flex justify-between items-center">
              <label htmlFor="" className="text-sm font-semibold">
                Select Template :
              </label>

              <div className="flex justify-center gap-x-2 items-center">
                <Link
                  // onClick={sendSmsHandler}
                  to="/campaigns/campaigndetails/sms/createtemplate"
                  className=" flex items-center text-center justify-center bg-blue-600
                rounded-sm text-white font-semibold text-[15px] font-poppins not-italic leading-normal px-2 py-1"
                >
                  Create Template
                </Link>
                {/* <UploadPdf onClick={setSelectLongLink} /> */}
                <Button
                  className={`flex justify-center items-center gap-x-1 font-poppins capitalize font-medium not-italic leading-normal text-white shadow-sm rounded-sm py-1 text-[15px] bg-slate-700 px-3 ${selectedTemplate && variableCount === textVariableCount ? "" : "cursor-not-allowed bg-gray-500"}`}
                  onClick={selectedTemplate && variableCount === textVariableCount ? () => setOpenTestBox(true) : () => { }}
                >
                  <RiMessage2Line size={"16px"} />
                  <span>Sample Message</span>
                </Button>
              </div>
              {/* {
                  selectedTemplate ? (
                    <button
                      // onClick={sendSmsDeleteHandler}
                      onClick={(e) => {
                        e.preventDefault();
                        if (selectedTemplate) {
                          setShowDeleteConfirmMessage(true);
                        }
                      }}
                      className=" flex items-center justify-center bg-red-600  
                      rounded-md text-white font-semibold w-[150px] h-fit mx-1 p-2"
                    >
                      Delete Template
                    </button>
                  ) : ""
                } */}
            </div>
            <div className="flex w-full justify-center gap-x-2 items-center">
              {
                campaignTemplates && (
                  <Select
                    placeholder="Select an Option"
                    // defaultValue={{ label: "Select an Option", value: "select" }}
                    className="rounded flex-1 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                    // options={selectOptions}
                    // options={templateOptions || []}
                    // options={[{ label: "Select A Template", value: "" }, ...templateOptions?.map((option, index) => ({ label: option.templateName, value: index }))]}
                    options={[{ label: "Select A Template", value: "" }, ...templateOptions?.map((option, index) => ({ label: <DropdownOption title={option?.templateName} value={option} />, value: index }))]}
                    // options={
                    //   [{ label: "Select A Template", value: "" }, ...templateOptions?.filter((item) => item?.accountId === singleUser?.accountId) // Filter matching accountId
                    //   .map((item) => ({
                    //     label: <DropdownOption title={item?.templateName} value={item} />,
                    //     value: item?.templateName,
                    //   }))]
                    // }
                    onChange={(value) => setSelectedTemplateIndex(value)}
                  />
                )
              }

              <Select
                placeholder="Select an Option"
                // defaultValue={{ label: "Select an Option", value: "select" }}
                className="rounded flex-1 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                // options={selectOptions}
                // defaultValue={"airtel"}
                defaultValue={"enableX"}
                options={[
                  {
                    label: <div className="flex justify-start font-medium font-poppins not-italic leading-normal gap-x-2 items-center">
                      <SiVexxhost size={14} />
                      Enable X
                    </div>, value: "enableX"
                  },
                  {
                    label: <div className="flex justify-start font-medium font-poppins not-italic leading-normal gap-x-2 items-center">
                      <SiAirtel size={14} />
                      Airtel
                    </div>, value: "airtel"
                  }
                ]}
                onChange={(value) => setSelectVender(value)}
              />
            </div>
          </div>

          <div className=" flex gap-4 sm:flex-row flex-col">
            <div className=" flex flex-col gap-1 rounded flex-1">
              <label htmlFor="" className="text-sm font-semibold">
                Message :
              </label>
              <textarea
                rows={6}
                className="border-2  flex flex-wrap rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                // change made by abhyanshu
                value={messageInTemplate}
                disabled
              />
            </div>

            {/* changes made by abhyanshu */}
            <div className=" sm:w-[25%] w-full mt-5 my-5">
              {selectedTemplate ? (
                <div>
                  <h1 className=" font-semibold">Sample Message:</h1>
                  <p className="flex flex-wrap flex-1" >{message}</p>
                </div>
              ) : ("")}
            </div>
            {/* changes made by abhyanshu */}
          </div>

          {/* changes made by abhyanshu */}
          <div>
            {selectedTemplate &&
              selectedTemplate?.variables.map((item, index) => (
                <DropDown
                  key={index}
                  itemIndex={index}
                  title={item.name}
                  options={dropDownList?.headers}
                  selectedVar={selectedVariables}
                  inputMethods={activeInputMethods}
                  setActiveMethod={setActiveInputMethods}
                  setSelectedVariable={setSelectedVariables}
                  setUserDisplayVariables={setUserDisplayVariables}
                  campaignDetail={campaignDetails}
                />
              ))
            }
          </div>
          {/* changes made by abhyanshu */}
        </form>
      </div>
    </div>
  );
};


// changes made by abhyanshu
export const DropDown = ({ title, inputMethods, setSelectedVariable, setActiveMethod,
  selectedVar, options = [], itemIndex, campaignDetail, setUserDisplayVariables }) => {

  const defaultOption = { label: "Select an Option", value: "select" };
  const navigate = useNavigate();


  const formatStringWithNewLines = (str, chunkSize = 22) => {
    let formattedString = '';
    for (let i = 0; i < str.length; i += chunkSize) {
      formattedString += str.substring(i, i + chunkSize) + '\n';
    }
    return formattedString.trim();
  };


  const handleDropDownListChange = async (variableIndex, option) => {
    setActiveMethod((prevMethods) => {
      const methodVal = {
        ...prevMethods,
        [variableIndex]: 'dropdown',
      };

      if (option === "select") {
        delete methodVal[variableIndex];
      }

      return methodVal;
    });

    try {
      // for setting values of user display as values under the first row of headers
      if (option !== "select") {
        let displayValue = "";
        const response = await axios.post("https://t.konceptlaw.in/campaign/getValueBySingleHeader", { campaignName: campaignDetail.name, header: option });
        displayValue = response.data.value;
        const variableName = `$var${variableIndex + 1}`;
        setUserDisplayVariables((prevValues) => {
          const updatedValues = {
            ...prevValues,
            [variableName]: displayValue,
          };
          if (option === "" || option === "select") {
            delete updatedValues[variableName];
          }
          return updatedValues;
        });
        // value = formatStringWithNewLines(value);
      }

      // for displaying setting values of headers
      let value = option;

      const variableName = `$var${variableIndex + 1}`;
      setSelectedVariable((prevValues) => {
        const updatedValues = {
          ...prevValues,
          [variableName]: value,
        };
        if (value === "" || option === "select") {
          delete updatedValues[variableName];
        }
        return updatedValues;
      });
    } catch (error) {
      // console.error(error);
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
  };

  const handleInputChange = (variableIndex, value) => {
    setActiveMethod((prevMethods) => {
      const methodVal = {
        ...prevMethods,
        [variableIndex]: 'input',
      }
      if (value === "") {
        delete methodVal[variableIndex];
      }
      return methodVal
    });

    try {
      if (value !== "") {
        let displayValue = value;
        const variableName = `$var${variableIndex + 1}`;
        setUserDisplayVariables((prevValues) => {
          const updatedValues = {
            ...prevValues,
            [variableName]: displayValue || "",
          };
          if (value === "") {
            delete updatedValues[variableName];
          }
          return updatedValues;
        });
        // value = formatStringWithNewLines(value);
      }
      // value = formatStringWithNewLines(value);
      const variableName = `$var${variableIndex + 1}`;
      setSelectedVariable((prevValues) => {
        const updatedValues = {
          ...prevValues,
          [variableName]: value || "",
        };
        if (value === "") {
          delete updatedValues[variableName];
        }
        return updatedValues;
      }
      );

    } catch (error) {
      // console.error(error)
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
  }

  const selectOptions = [defaultOption, ...(options?.map((option) => ({ label: option, value: option })) || [])];

  return (
    <div className="flex sm:flex-row flex-col w-[100%] my-6 sm:my-3">
      <label className={`sm:w-[20%] sm:max-w-20% sm:text-start text-center min-w-[25%] p-2 sm:rounded-l-lg sm:rounded-r-none rounded-lg rounded-b-none border-b-2 text-lg 
                    text-black bg-blue-100 shadow-md font-semibold  border-b-blue-300`}>{title}</label>
      <div className="flex sm:flex-row flex-col rounded-lg gap-y-2 sm:gap-y-0 w-[100%]">
        <Select
          showSearch
          placeholder="Select an Option"
          className={`sm:w-[50%] w-full h-[50px] rounded-none text-lg focus:ring-purple-600 border-blue-300 border-b-2
            ${inputMethods[itemIndex] == "input" ? "bg-gray-300 border-gray-500" : "bg-white shadow-md"}  
            `}
          options={selectOptions}
          // onSearch={handleSearch}
          onChange={(value) => handleDropDownListChange(itemIndex, value)}
          disabled={inputMethods[itemIndex] === 'input'}
        />
        <p className="text-lg hidden sm:block bg-gray-100 w-fit text-center text-black font-semibold p-3">
          <TiArrowRepeat size={"22px"} />
        </p>
        <input type="text"
          value={selectedVar[`var${itemIndex + 1}`]}
          autoComplete="true"
          className={`sm:w-[50%] w-[100%] p-2 text-lg
                      ${inputMethods[itemIndex] == "dropdown" ? "bg-gray-300 border-gray-500" : "bg-white shadow-md"}
                      border-b-2 border-blue-300`}
          placeholder={`Input${itemIndex + 1}`}
          onChange={(e) => { handleInputChange(itemIndex, e.target.value); }}
          disabled={inputMethods[itemIndex] === 'dropdown'}
        />
      </div>
    </div>
  )
}
// changes made by abhyanshu


export default SmsCampaign;
