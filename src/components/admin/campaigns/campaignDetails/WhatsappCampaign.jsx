import React, { useEffect, useMemo, useState } from "react";
import Topbar from "./Topbar";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import {
  deleteCampaignWhatsappTemplateThunkMiddleware,
  getCampaignLogsThunkMiddleware,
  getCampaignWhatsappTemplateThunkMiddleware,
  saveAndSendCampaignWhatsappTemplateThunkMiddleware,
  sendCampaignWhatsappTemplateThunkMiddleware,
  sendSampleWhatsappThunkMiddleware,
} from "../../../../redux/features/campaigns";
import { Dropdown, Select } from "antd";

import { IoMdArrowRoundBack } from "react-icons/io";
import { TiArrowRepeat } from "react-icons/ti";
import axios from "axios";
import { toastify } from "../../../toast";
import ConfirmMessage from "../../../common/ConfirmMessage";
import { MdDeleteOutline } from "react-icons/md";
import { IoSaveOutline } from "react-icons/io5";
import { LiaSave } from "react-icons/lia";
import { TbFileUpload } from "react-icons/tb";
import { Button } from "@material-tailwind/react";

import { FaFilePdf } from "react-icons/fa6"; // pdf
import UploadPdf from "../../../../common/Buttons/UploadPdf";

import { RiMessage2Line } from "react-icons/ri";
import PhoneTestModal from "../../../../common/modals/PhoneTestModal";
import { toastifyError } from "../../../../constants/errors";

import usePath from "../../../../hooks/usePath";
import DropdownOption from "../../../../common/fields/DropdownOption";
import ScheduleModal from "../../../../common/modals/ScheduleModal";


const WhatsappCampaign = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = usePath();

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);
  const [selectLongLink, setSelectLongLink] = useState(false);

  const { campaignWhatsappTemplates, campaignDetails } = useSelector(
    (state) => state.campaigns
  );

  const selectedTemplate = useMemo(
    () => campaignWhatsappTemplates && campaignWhatsappTemplates?.length > 0 ? campaignWhatsappTemplates[selectedTemplateIndex] : null,
    [selectedTemplateIndex, campaignWhatsappTemplates]
  );

  console.log("campaignWhatsappTemplates", campaignWhatsappTemplates);

  // changes made by abhyanshu
  const [ShowDeleteConfirmMessage, setShowDeleteConfirmMessage] = useState(false);
  const [ShowSaveConfirmMessage, setShowSaveConfirmMessage] = useState(false);
  const [ShowSaveAndSendConfirmMessage, setShowSaveAndSendConfirmMessage] = useState(false);


  //changes made by abhyanshu
  const [selectedVariables, setSelectedVariables] = useState({});
  // const [selectedVariables, setSelectedVariables] = useState([]);
  const [optionList, setOptionList] = useState([])
  const [userDisplayVariables, setUserDisplayVariables] = useState({})
  const [messageInTemplate, setMessageInTemplate] = useState(``);
  const [dropDownList, setDropDownList] = useState(null);
  const [headerValue, setHeaderValue] = useState(null);
  const [activeInputMethods, setActiveInputMethods] = useState({});
  const [message, setMessage] = useState(``);
  const [textVariableCount, setTextVariableCount] = useState(null);
  const [variableCount, setVariableCount] = useState(null);
  const [WabaSelect, setWabaSelect] = useState("whatsappAirtel");
  const [OpenTestBox, setOpenTestBox] = useState(false);

  // schedule
  const [isSchedule, setIsSchedule] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getCampaignWhatsappTemplateThunkMiddleware(WabaSelect));
  }, [WabaSelect]);

  // changes made by abhyanshu
  const sendWhatsappHandler = () => {
    // if (!selectedTemplate || variableCount !== textVariableCount || selectLongLink) {
    //   return;
    // }
    // try {
    // // console.log("longlink:",selectLongLink)
    // if(selectLongLink && selectedTemplate && variableCount === textVariableCount){
    //   dispatch(
    //     sendCampaignWhatsappTemplateThunkMiddleware({
    //       templateId: selectedTemplate.templateId,
    //       templateName: selectedTemplate.templateName,
    //       message: selectedTemplate.message,
    //       variables: selectedVariables,
    //       campaignName: campaignDetails.name,
    //       longlink: selectLongLink,
    //     },
    //       // setTimeout(() => {
    //       //   navigate("/campaigns/campaigndetails/reports")
    //       // }, 1500)
    //       (error) => {
    //         if (!error) {
    //           navigate("/campaigns/campaigndetails/reports")
    //         }
    //       }
    //     )
    //   );
    // }
    //   else if (selectedTemplate && variableCount === textVariableCount) {
    //     dispatch(
    //       sendCampaignWhatsappTemplateThunkMiddleware({
    //         templateId: selectedTemplate.templateId,
    //         templateName: selectedTemplate.templateName,
    //         message: selectedTemplate.message,
    //         variables: selectedVariables,
    //         campaignName: campaignDetails.name,
    //       },
    //         // setTimeout(() => {
    //         //   navigate("/campaigns/campaigndetails/reports")
    //         // }, 1500)
    //         (error) => {
    //           if (!error) {
    //             navigate("/campaigns/campaigndetails/reports")
    //           }
    //         }
    //       )
    //     );
    //   }else if(selectLongLink){
    //     console.log("longlink send");
    //     dispatch(
    //       sendCampaignWhatsappTemplateThunkMiddleware({
    //         // templateId: selectedTemplate?.templateId,
    //         // templateName: selectedTemplate?.templateName,
    //         // message: selectedTemplate?.message,
    //         // variables: selectedVariables,
    //         campaignName: campaignDetails?.name,
    //         longlink: selectLongLink,
    //       },
    //         // setTimeout(() => {
    //         //   navigate("/campaigns/campaigndetails/reports")
    //         // }, 1500)
    //         (error) => {
    //           if (!error) {
    //             navigate("/campaigns/campaigndetails/reports")
    //           }
    //         }
    //       )
    //     );
    //   }
    // } catch (error) {
    //   if (error.response?.data) {
    //     toastify({ msg: error.response.data, type: "error" })
    //   } else {
    //     toastify({ msg: error.message, type: "error" })
    //   }
    // }
    try {
      // console.log("longlink:",selectLongLink)
      if (selectedTemplate && variableCount === textVariableCount) {
        dispatch(
          sendCampaignWhatsappTemplateThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            message: selectedTemplate.message,
            variables: selectedVariables,
            campaignName: campaignDetails.name,
            whatsappVendor: WabaSelect,
          },
            // setTimeout(() => {
            //   navigate("/campaigns/campaigndetails/reports")
            // }, 1500)
            (error) => {
              if (!error) {
                navigate("/campaigns/campaigndetails/reports")
              }
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
  };

  const { singleUser } = useSelector(state => state.user);

  const templateData = useMemo(() => {
    // Filter and map over campaignEmailTemplates to create options only for matching accountId
    return campaignWhatsappTemplates
      ? campaignWhatsappTemplates
        .filter((item) => item?.accountId === singleUser?.accountId) // Filter matching accountId
        .map((item) => ({
          label: <DropdownOption title={item?.templateName} value={item} />,
          value: item?.templateName,
        }))
      : [];
  }, [campaignWhatsappTemplates, singleUser?.accountId]);

  console.log("select template", selectedTemplate)

  const saveAndSendWhatsappHandler = (modalData) => {
    // console.log("save and send start")
    // if (!selectedTemplate || variableCount !== textVariableCount) {
    //   return;
    // }
    // try {
    //   if (selectedTemplate && variableCount === textVariableCount) {
    //     dispatch(
    //       saveAndSendCampaignWhatsappTemplateThunkMiddleware({
    //         templateId: selectedTemplate.templateId,
    //         templateName: selectedTemplate.templateName,
    //         message: selectedTemplate.message,
    //         variables: selectedVariables,
    //         campaignName: campaignDetails.name,
    //       },
    //         // setTimeout(() => {
    //         //   navigate("/campaigns/campaigndetails")
    //         // }, 1500)
    //         (error) => {
    //           if (!error) {
    //             navigate("/campaigns/campaigndetails/reports")
    //           }
    //         }
    //       )
    //     );
    //   }
    // } catch (error) {
    //   if (error.response?.data) {
    //     toastify({ msg: error.response.data, type: "error" })
    //   } else {
    //     toastify({ msg: error.message, type: "error" })
    //   }
    // }
    try {
      // console.log(modalData);
      console.log("longlink:",selectLongLink)
      if (selectLongLink && selectedTemplate && variableCount === textVariableCount) {
        // console.log("select template with long link")
        setIsLoading(true);
        dispatch(
          saveAndSendCampaignWhatsappTemplateThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            message: selectedTemplate.message,
            variables: selectedVariables,
            campaignName: campaignDetails.name,
            longlink: selectLongLink,
            whatsappVendor: WabaSelect,
            ...modalData,
          },
            // setTimeout(() => {
            //   navigate("/campaigns/campaigndetails/reports")
            // }, 1500)
            (error) => {
              if (!error) {
                setIsLoading(false);
                setIsSchedule(false);
                navigate("/campaigns/campaigndetails/reports")
              } else {
                setIsLoading(false);
              }
            }
          )
        );
      }
      else if (selectedTemplate && variableCount === textVariableCount) {
        // console.log("only select template")
        setIsLoading(true);
        dispatch(
          saveAndSendCampaignWhatsappTemplateThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            message: selectedTemplate.message,
            variables: selectedVariables,
            campaignName: campaignDetails.name,
            whatsappVendor: WabaSelect,
            ...modalData,
          },
            // setTimeout(() => {
            //   navigate("/campaigns/campaigndetails/reports")
            // }, 1500)
            (error) => {
              if (!error) {
                setIsLoading(false);
                setIsSchedule(false);
                navigate("/campaigns/campaigndetails/reports")
              } else {
                setIsLoading(false);
              }
            }
          )
        );
      } else if (selectLongLink) {
        setIsLoading(true);
        dispatch(
          saveAndSendCampaignWhatsappTemplateThunkMiddleware({
            // templateId: selectedTemplate?.templateId,
            // templateName: selectedTemplate?.templateName,
            // message: selectedTemplate?.message,
            // variables: selectedVariables,
            campaignName: campaignDetails?.name,
            longlink: selectLongLink,
            whatsappVendor: WabaSelect,
            ...modalData,
          },
            // setTimeout(() => {
            //   navigate("/campaigns/campaigndetails/reports")
            // }, 1500)
            (error) => {
              if (!error) {
                setIsLoading(false);
                setIsSchedule(false);
                navigate("/campaigns/campaigndetails/reports")
              } else {
                setIsLoading(false);
              }
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
  };
  // changes  made by abhyanshu


  const smsLogsHandler = () => {
    dispatch(
      getCampaignLogsThunkMiddleware(
        {
          campaignName: campaignDetails.name,
          logsType: "Whatsapp",
        },
        () => {
          navigate("logs");
        }
      )
    );
  };


  // changes made by abhyanshu
  const sendWhatsappDeleteHandler = (e) => {
    // if (selectedTemplate) {
    //   const response = dispatch(deleteCampaignWhatsappTemplateThunkMiddleware(selectedTemplate.templateId));
    //   toastify({ msg: response.data, type: "success" });
    //   navigate("/campaigns/campaigndetails/whatsapp");
    // }
    if (!selectedTemplate) {
      return;
    }
    try {
      if (selectedTemplate) {
        dispatch(deleteCampaignWhatsappTemplateThunkMiddleware(selectedTemplate.templateId,
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


  //changes made by abhyanshu
  useEffect(() => {
    if (selectedTemplate) {
      setMessageInTemplate(selectedTemplate.message)
    }
    // if (!selectedTemplate) {
    //   return
    // }
    // console.log(selectedTemplateIndex)
    const handleDropdownApi = async () => {
      try {
        const response = await axios.post("https://t.kcptl.in/campaign/readExcelHeaders", { campaignName: campaignDetails.name });
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
      // setSelectedVariables([])
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
  }, [selectedTemplateIndex])

  useEffect(() => {

    const getUpdatedString = (template, values) => {
      return template.replace(/{\{(\d+)\}}/g, (match, variableName) => {
        return values[variableName] || match;
      });
    };

    // for displaying values of first row under the header
    const updatedString = getUpdatedString(messageInTemplate, userDisplayVariables);
    // for displaying headers
    // const updatedString = getUpdatedString(messageInTemplate, selectedVariables);

    setMessage(updatedString);

    if (messageInTemplate.length !== 0) {
      let count = messageInTemplate.match(/{\{(\d+)\}}/g);
      count = count ? count.length : 0;
      setTextVariableCount(count)
    }

    if (selectedVariables) {
      let count = selectedVariables;
      let noOfVariables = Object.keys(count);
      setVariableCount(noOfVariables.length)
    }
  }, [messageInTemplate, variableCount, textVariableCount, selectedVariables, userDisplayVariables])

  const wabaOption = [
    // { label: "Waba from enablex", value: "Waba from enablex" },
    // { label: "Waba from Vendor1", value: "Waba from Vendor1" },
    { label: "Waba from Airtel", value: "whatsappAirtel" },
    { label: "Waba from Waba", value: "whatsapp" },
  ]

  // conditions
  const completed = useMemo(() => {
    if(selectLongLink && selectedTemplate && variableCount === textVariableCount){
      return true;
    } else if (selectedTemplate && variableCount === textVariableCount) {
      return true;
    } else if (selectLongLink) {
      return true;
    } else {
      return false;
    }
  }, [selectLongLink, selectedTemplate, variableCount, textVariableCount]);

  const sendSampleMessage = () => {
    // console.log("send sample message!")
    try {
      // console.log("longlink:",selectLongLink)
      if (selectLongLink && selectedTemplate && variableCount === textVariableCount) {
        // console.log("select template with long link")
        dispatch(
          sendSampleWhatsappThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            message: selectedTemplate.message,
            variables: selectedVariables,
            campaignName: campaignDetails.name,
            longlink: selectLongLink,
            whatsappVendor: WabaSelect,
            ...modalData,
          },
            (error) => {
              if (!error) {
                setOpenTestBox(false);
              } else {
                setOpenTestBox(false);
              }
            }
          )
        );
      }
      else if (selectedTemplate && variableCount === textVariableCount) {
        // console.log("only select template")
        dispatch(
          sendSampleWhatsappThunkMiddleware({
            templateId: selectedTemplate.templateId,
            templateName: selectedTemplate.templateName,
            message: selectedTemplate.message,
            variables: selectedVariables,
            campaignName: campaignDetails.name,
            whatsappVendor: WabaSelect,
            ...modalData,
          },
            (error) => {
              if (!error) {
                setOpenTestBox(false);
              } else {
                setOpenTestBox(false);
              }
            }
          )
        );
      } else if (selectLongLink) {
        dispatch(
          sendSampleWhatsappThunkMiddleware({
            // templateId: selectedTemplate?.templateId,
            // templateName: selectedTemplate?.templateName,
            // message: selectedTemplate?.message,
            // variables: selectedVariables,
            campaignName: campaignDetails?.name,
            longlink: selectLongLink,
            whatsappVendor: WabaSelect,
            ...modalData,
          },
            (error) => {
              if (!error) {
                setOpenTestBox(false);
              } else {
                setOpenTestBox(false);
              }
            }
          )
        );
      }
    } catch (error) {
      toastifyError(error, (call) => {
        if (call === "logout") {
          navigate("/login");
        }
      })
    }
    // dispatch(sendSampleWhatsappThunkMiddleware());
  }

  return (
    <div className="overflow-y-auto h-full w-full px-2 py-2 md:gap-4 space-y-1">
      <PhoneTestModal
        isModalVisible={OpenTestBox}
        setIsModalVisible={() => setOpenTestBox(false)}
        onSubmit={sendSampleMessage}
      />
      {
        ShowDeleteConfirmMessage ? <>
          <ConfirmMessage yes="Yes, I am sure" className="flex-col" deleteBtn={true} no="No, I'm not sure!" value={(e) => {
            if (e) {
              sendWhatsappDeleteHandler()
            }
            setShowDeleteConfirmMessage(false);
          }}>
            <MdDeleteOutline size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Please confirm if you would like to delete this Whatsapp campaign.</h2>
          </ConfirmMessage>
        </> : null
      }

      {
        ShowSaveConfirmMessage ? <>
          <ConfirmMessage yes="Yes, I am sure" className="flex-col" no="No, I'm not sure!" value={(e) => {
            if (e) {
              sendWhatsappHandler()
            }
            setShowSaveConfirmMessage(false);
          }}>
            <LiaSave size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Please confirm if you would like to save this Whatsapp campaign.</h2>
          </ConfirmMessage>
        </> : null
      }
      {
        ShowSaveAndSendConfirmMessage ? <>
          <ConfirmMessage yes="Yes, I am sure" className="flex-col" no="No, I'm not sure!" value={(e) => {
            if (e) {
              saveAndSendWhatsappHandler();
            }
            setShowSaveAndSendConfirmMessage(false);
          }}>
            <TbFileUpload size={"50px"} className="mb-3 text-slate-700" />
            <h2 className="text-lg w-full text-center text-slate-700 font-normal">Please confirm if you would like to save and send this Whatsapp campaign.</h2>
          </ConfirmMessage>
        </> : null
      }

      <ScheduleModal
        isOpen={isSchedule}
        setIsOpen={setIsSchedule}
        withOutSchedule={saveAndSendWhatsappHandler}
        isLoading={isLoading}
      />

      {/* Topbar  */}
      <div className="h-fit px-4 py-1 flex md:flex-row flex-col gap-y-2 md:my-0  w-full justify-between bg-white rounded-md">
        <div className=" flex items-center gap-4">
          {/* <button
            // onClick={() => navigate("/campaigns/campaigndetails")}
            onClick={() => path.back()}
            className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
          >
            <IoMdArrowRoundBack size={26} />
          </button>
          <h1 className=" text-xl font-semibold">Whatsapp Campaign</h1> */}
          <h1 className=" text-xl font-semibold">Send Whatsapp</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={smsLogsHandler}
            className=" flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded-md text-white font-semibold"
          >
            Logs
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              if(selectedTemplate && variableCount === textVariableCount) setShowSaveConfirmMessage(true);
              // if(selectedTemplate){
              //   setShowSaveConfirmMessage(true);
              // }else if(selectLongLink){
              //   setShowSaveConfirmMessage(true);
              // }else if (selectedTemplate && selectLongLink) {
              //   setShowSaveConfirmMessage(true);
              // }
            }}
            className={`flex items-center gap-1 ${(selectedTemplate && variableCount === textVariableCount) ? "bg-green-600": "bg-gray-500 cursor-not-allowed"} px-2 py-1 rounded-md text-white font-semibold`}
          >
            Save
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              // setShowSaveAndSendConfirmMessage(true);
              if(completed) setIsSchedule(true)
            }}
            className={`flex items-center gap-1 ${completed ? "bg-gray-950": "bg-gray-500 cursor-not-allowed"} px-2 py-1 rounded-md text-white font-semibold`}
          >
            Save & Send
          </button>
        </div>
      </div>

      <div className=" bg-white rounded-md h-full p-3">
        <form action="" className=" space-y-3">
          <div className=" flex flex-col gap-2 rounded">
            <div className="flex justify-between items-center">
              <label htmlFor="" className="text-sm font-semibold">
                {/* Select Applications : */}
                Select Templates :
              </label>

              <div className="flex justify-center gap-x-2 items-center">
                <Link
                  // onClick={sendSmsHandler}
                  to="/campaigns/campaigndetails/whatsapp/createtemplate"
                  className=" flex items-center text-center justify-center bg-blue-600
                rounded-sm text-white font-semibold text-[15px] font-poppins not-italic leading-normal px-2 py-1"
                >
                  Create Template
                </Link>
                <UploadPdf onClick={setSelectLongLink} />
                <Button 
                  className={`flex justify-center items-center gap-x-1 font-poppins capitalize font-medium not-italic leading-normal text-white shadow-sm rounded-sm py-1 text-[15px] ${completed ? "bg-gray-950": "bg-gray-500 cursor-not-allowed"} px-3`} onClick={completed ? () => setOpenTestBox(true): () => {}}
                >
                  <RiMessage2Line size={"16px"} />
                  <span>Sample Message</span>
                </Button>
              </div>
            </div>
            <div className="flex w-[100%] md:flex-row flex-col" >
              {/* <div className="md:my-0 my-2 w-full"> */}
              <div className="md:my-0 my-2 grid grid-cols-2 gap-x-2 w-full">
                {
                  campaignWhatsappTemplates && (
                    <Select
                      placeholder="Select an Option"
                      // defaultValue={{ label: "Select an Option", value: "select" }}
                      className="rounded flex-1 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                      // options={selectOptions}
                      // options={[{ label: "Select A Template", value: "" }, ...(campaignWhatsappTemplates?.map((option, index) => ({ label: option?.templateName, value: index })) || [])]}
                      options={[{ label: "Select A Template", value: "" }, ...(campaignWhatsappTemplates?.map((option, index) => ({ label: <DropdownOption title={option?.templateName} value={option} />, value: index })) || [])]}
                      // options={[{ label: "Select A Template", value: "" }, ...(templateData || [])]}
                      onChange={(value) => setSelectedTemplateIndex(value)}
                    />
                  )
                }

                {
                  campaignWhatsappTemplates && (
                    <Select
                      placeholder="Select an Option"
                      // defaultValue={{ label: "Select an Option", value: "select" }}
                      defaultValue={"whatsappAirtel"}
                      className="rounded flex-1 focus:ring-2 h-[44px] focus:ring-purple-800 outline-none w-full"
                      options={wabaOption}
                      onChange={(value) => setWabaSelect(value)}
                    />
                  )
                }
              </div>
            </div>
          </div>

          <div className=" flex gap-4 sm:flex-row w-full flex-col">
            <div className=" flex flex-col w-1/2 gap-1 rounded flex-1">
              <label htmlFor="" className="text-sm font-semibold">
                Message :
              </label>
              <textarea
                rows={6}
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                // change made by abhyanshu
                value={messageInTemplate}
                disabled
              />
            </div>

            {/* changes made by abhyanshu */}
            <div className=" w-1/2 mt-5 my-5">
              {selectedTemplate ? (
                <div>
                  <h1 className=" font-semibold">Sample Message:</h1>
                  <p>{message}</p>
                </div>
              ) : ("")}

              {/* <div className="flex justify-center my-1 gap-x-2 items-end">
                <TextField
                  type="number"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  label="Phone Number"
                  className="rounded-sm"
                  labelClass="text-sm mb-1"
                  mainClass="w-[65%]"
                />

                <Button className="capitalize py-2 px-3 text-[14px] w-[35%] rounded-md text-white bg-slate-700 font-poppins not-italic leading-normal font-medium">Send Test Message</Button>
              </div> */}
            </div>
            {/* changes made by abhyanshu */}
          </div>


          <div>
            {selectedTemplate &&
              selectedTemplate?.variables.map((item, index) => (
                <DropDown
                  key={index}
                  itemIndex={index}
                  title={item?.name}
                  options={dropDownList?.headers}
                  selectedVar={selectedVariables}
                  inputMethods={activeInputMethods}
                  setActiveMethod={setActiveInputMethods}
                  setSelectedVariable={setSelectedVariables}
                  setUserDisplayVariables={setUserDisplayVariables}
                  campaignDetail={campaignDetails}
                // optionList={optionList}
                // setOptionList={setOptionList}
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

//changes by abhyanshu
export const DropDown = ({ title, inputMethods, setSelectedVariable, setActiveMethod,
  selectedVar, options = [], itemIndex, campaignDetail, setUserDisplayVariables,
  // optionList, setOptionList
}) => {

  const defaultOption = { label: "Select an Option", value: "select" };
  const navigate = useNavigate();

  /* */
  // const formatStringWithNewLines = (str, chunkSize = 22) => {
  //   let formattedString = '';
  //   for (let i = 0; i < str.length; i += chunkSize) {
  //     formattedString += str.substring(i, i + chunkSize) + '\n';
  //   }
  //   return formattedString.trim();
  // };
  /* */

  /* */
  const handleDropDownListChange = async (variableIndex, option) => {
    // console.log(option)
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
      if (option !== "select") {
        let displayValue = "";
        const response = await axios.post("https://t.kcptl.in/campaign/getValueBySingleHeader", { campaignName: campaignDetail.name, header: option });
        displayValue = response.data.value;
        const variableName = `${variableIndex + 1}`;
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

      let value = option;
      // let value = "";
      // if (option !== "select") {
      //   const response = await axios.post("https://t.kcptl.in/campaign/getValueBySingleHeader", { campaignName: campaignDetail.name, header: option });
      //   value = response.data.value;
      //   // value = formatStringWithNewLines(value);

      // }

      // console.log(value)

      const variableName = `${variableIndex + 1}`;
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
  /* */

  /* */
  const handleInputChange = (variableIndex, value) => {
    // console.log(value)
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
        const variableName = `${variableIndex + 1}`;
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
      const variableName = `${variableIndex + 1}`;
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
  /* */

  // Ensure options is an array and map it correctly
  const selectOptions = [defaultOption, ...(options?.map((option) => ({ label: option, value: option })) || [])];

  // const [properties, setProperties] = useState([]);
  // const [optionList, setOptionList] = useState([])

  // console.log("displaying option list of the changed varialbe method from object to array of objects", optionList)
  /* */
  // const handleVariableChange = async (variableIndex, value, method) => {
  //   console.log(value);

  //   setActiveMethod((prevMethods) => {
  //     const methodVal = {
  //       ...prevMethods,
  //       [variableIndex]: method,
  //     };
  //     if (value === "" || (method === 'dropdown' && value === "select")) {
  //       delete methodVal[variableIndex];
  //     }
  //     return methodVal;
  //   });

  //   try {
  //     // let displayValue = value;

  //     // if (method === 'dropdown' && value !== "select") {
  //     //   const response = await axios.post("https://t.kcptl.in/campaign/getValueBySingleHeader", { campaignName: campaignDetail.name, header: value });
  //     //   displayValue = response.data.value;
  //     // }

  //     // const updatedProperties = [...properties];
  //     // const propertyName = `var${variableIndex + 1}`;
  //     // const existingIndex = updatedProperties.findIndex(prop => prop.propertyName === propertyName);

  //     //   const newProperty = {
  //     //     propertyName,
  //     //     propertyValue: displayValue,
  //     //     input: method === 'input',
  //     //   };

  //     //   if (existingIndex > -1) {
  //     //     updatedProperties[existingIndex] = newProperty;
  //     //   } else {
  //     //     updatedProperties.push(newProperty);
  //     //   }

  //     //   setProperties(updatedProperties);
  //     // } catch (error) {
  //     //   console.log(error);
  //     // }

  //     // try {

  //     const propertyName = `var${variableIndex + 1}`;

  //     setOptionList((prevValues) => {
  //       // Check if the variable already exists in the array

  //       const existingVariableIndex = prevValues.findIndex(
  //         (exData) => exData.propertyName === propertyName
  //       );

  //       console.log(existingVariableIndex)

  //       // Create a new array to avoid mutating the previous state directly
  //       const updatedValues = [...prevValues];

  //       if ((method === "dropdown" && (value === "" || value === "select")) || (method === "input" && value === "")) {
  //         // If the value is empty or "select", remove the variable from the array
  //         if (existingVariableIndex !== -1) {
  //           updatedValues.splice(existingVariableIndex, 1);
  //         }
  //       } else {
  //         // If the variable exists, update its value
  //         if (existingVariableIndex !== -1) {
  //           updatedValues[existingVariableIndex].propertyValue = value;
  //           updatedValues[existingVariableIndex].input = method === "input" ? true : false
  //         } else {
  //           // If the variable does not exist, add a new object to the array
  //           updatedValues.push({
  //             propertyName: propertyName,
  //             propertyValue: value,
  //             input: method === "input" ? true : false,
  //             // variableExcelValue: `row[${value}]`,
  //           });
  //         }
  //       }
  //       console.log('Updated Values:', updatedValues);

  //       return updatedValues;
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  /* */

  // console.log("displaying option list of the changed varialbe method from object to array of objects", optionList)


  return <>
    <div className="flex sm:flex-row  flex-col my-4 border border-solid rounded-md w-[100%]">
      <label className={`sm:w-1/4 sm:text-start text-center sm:min-w-[25%] flex justify-start items-center p-2 text-lg 
                    text-black bg-blue-100 font-semibold `}>{title}</label>
      <div className="flex sm:flex-row flex-col rounded-lg gap-y-2 sm:gap-y-0 w-full sm:w-3/4">
        <Select
          showSearch
          placeholder="Select an Option"
          // defaultValue={{ label: "Select an Option", value: "select" }}
          className={`sm:w-[50%] w-full h-[50px] text-lg rounded-none
            ${inputMethods[itemIndex] == "input" ? "bg-gray-300 border-gray-500" : "bg-white"}  
            `}
          options={selectOptions}
          onChange={(value) => handleDropDownListChange(itemIndex, value)}
          // onChange={(value) => handleVariableChange(itemIndex, value, "dropdown")}
          disabled={inputMethods[itemIndex] === 'input'}
        />
        <p className="text-lg hidden sm:block bg-gray-100 w-fit text-center text-black font-semibold p-3">
          <TiArrowRepeat size={"22px"} />
        </p>
        {/* <p className="text-lg block sm:hidden bg-gray-100 w-fit text-center text-black font-semibold p-2">
          <HiOutlineArrowsUpDown size={"16px"} />
        </p> */}
        <input type="text"
          // value={selectedVar[`var${itemIndex + 1}`]}
          // value={inputValue}
          className={`sm:w-[50%] w-[100%] outline-none p-2 text-lg 
                      ${inputMethods[itemIndex] == "dropdown" ? "bg-gray-300 border-gray-500" : "bg-white"}
                      `}
          placeholder={`Input${itemIndex + 1}`}
          onChange={(e) => { handleInputChange(itemIndex, e.target.value); }}
          // onChange={(e) => { handleVariableChange(itemIndex, e.target.value, "input"); }}
          disabled={inputMethods[itemIndex] === 'dropdown'}
        />
      </div>
    </div>
  </>
}
// changes made by abhyanshu

export default WhatsappCampaign;
