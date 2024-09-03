import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  createCampaignWhatsappTemplateThunkMiddleware,
  getCampaignLogsThunkMiddleware,
  sendCampaignEmailThunkMiddleware,
} from "../../../../redux/features/campaigns/index.js";
import axios from "axios";
import { toastify } from "../../../toast.js";

const CreateWhatsappTemplatePage = () => {
  // const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  // const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);
  const [templateName, setTemplateName] = useState("");
  const [textVariableCount, setTextVariableCount] = useState(null);
  const [variableCount, setVariableCount] = useState(null);
  const [addedInputs, setAddedInputs] = useState([]);
  const [addedVariables, setAddedVariables] = useState({})

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const sendEmailHandler = () => {
  //   dispatch(
  //     sendCampaignEmailThunkMiddleware(
  //       {
  //         subject,
  //         text,
  //         templateName: selectedTemplate.name,
  //         campaignName: campaignDetails.name,
  //       },
  //       () => { }
  //     )
  //   );
  // };

  // const emailLogsHandler = () => {
  //   dispatch(
  //     getCampaignLogsThunkMiddleware(
  //       {
  //         campaignName: campaignDetails.name,
  //         logsType: "Email",
  //       },
  //       () => {
  //         navigate("logs");
  //       }
  //     )
  //   );
  // };

  const instructionsArray = [
    ` The variable name should be defined in double curly braces {{}} and indexing of positive
    numbers from 1 to your decided number in sequence - example : {{1}} {{2}} `,
    `The number of added variables should match the number of variables 
    created in the template, name should be given to the variables and the
    variables shouldn't contain any special character or different way other then 
    Text , underscore , dash `,
    `All the fields Should be filled and not be empty`,
    `Two Values of the variables should be unique`

  ];

  const handleCreateTemplate = async () => {
    // try {
    if (templateName.length !== null && text !== null
      && addedInputs.length === textVariableCount && textVariableCount === variableCount 
    ) {
      dispatch(createCampaignWhatsappTemplateThunkMiddleware({
        templateName: templateName,
        message: text,
        type: "whatsapp",
        variables: addedVariables,
        verified: true,
      },
        // setTimeout(() => {
        //   navigate("/campaigns/campaigndetails/whatsapp");
        // }, 1500)
        (error) => {
          if (!error) {
            navigate("/campaigns/campaigndetails/whatsapp");
          }
        }
      ));

    }
    // } catch (error) {
    //   if (error.response?.data) {
    //     toastify({ msg: error.response.data, type: "error" });
    //   }
    //   else {
    //     toastify({ msg: error.message, type: "error" })
    //   }

    // }
  }

  const handleAdd = () => {
    if (textVariableCount - 1 < addedInputs.length) {
      return;
    }
    const added = [...addedInputs, []]
    setAddedInputs(added)
  }

  const handleAddingInputs = (variableIndex, value) => {
    try {
      const variableName = `${variableIndex + 1}`;
      setAddedVariables((prevValues) => {
        const updatedValues = {
          ...prevValues,
          [variableName]: value,
        };
        return updatedValues;
      });
    } catch (error) {
      console.error(error)
    }
  }


  const handleRemove = (index) => {
    const removed = [...addedInputs];
    removed.splice(index, 1)
    setAddedInputs(removed)
  }


  useEffect(() => {
    if (text.length !== 0) {
      let count = text.match(/{\{(\d+)\}}/g);
      count = count ? count.length : 0;
      setTextVariableCount(count)
    }

    if (addedInputs) {
      let count = addedVariables;
      let noOfVariables = Object.keys(count);
      setVariableCount(noOfVariables.length)
    }
  }, [text, addedInputs, addedVariables])


  // console.log("text variables count ", textVariableCount)
  // console.log("variable in the selected object count ", variableCount)
  // console.log("added inputs count ", addedInputs.length)
  // console.log("variables added in the inputs count ", addedVariables)

  return (
    <div className="overflow-y-auto px-6 py-4 md:gap-4 space-y-3">
      {/* Topbar  */}
      <div className="h-fit px-4 py-2 flex md:flex-row flex-col md:gap-0 gap-y-2 w-full justify-between bg-white rounded-md">
        <div className=" flex items-center gap-4">
          <button
            onClick={() => navigate("/campaigns/campaigndetails/whatsapp")}
            className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
          >
            <IoMdArrowRoundBack size={26} />
          </button>
          <h1 className=" text-xl font-semibold">Create Template</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            // onClick={() => navigate("uploadtemplate")}
            onClick={() => handleCreateTemplate()}
            className=" flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white font-semibold"
          >
            Create Template
          </button>
        </div>
      </div>

      <div className=" bg-white rounded-md h-full p-3">
        <h1 className=" font-bold py-2">Create Whatsapp Template</h1>
        <form action="" className=" space-y-3">
          <div className=" flex flex-col gap-1 rounded flex-1">
            <label htmlFor="" className="text-sm font-semibold">
              Template Name :
            </label>
            <input
              type="text"
              className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={(e) => setTemplateName(e.target.value)}
              value={templateName}
            />
          </div>

          {/* <div className=" flex flex-col gap-1 rounded flex-1">
            <label htmlFor="" className="text-sm font-semibold">
              Subject :
            </label>
            <input
              type="text"
              className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            />
          </div> */}
          <div className="flex gap-4">
            <div className=" flex flex-col gap-1 rounded flex-1">
              <label htmlFor="" className="text-sm font-semibold">
                Text :
              </label>
              <textarea
                rows={6}
                className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
            </div>
            {/* <div className="w-[25%] mt-5">
              <h1 className=" font-semibold">Sample Template</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Beatae dolorem recusandae enim delectus incidunt minus fugiat,
                sint sunt, numquam nam nesciunt? Ullam similique qui quod eum dolorem.
                Earum ratione aut doloremque error eveniet maiores!</p>
            </div> */}
          </div>
        </form>
        <div>
          <div className="flex flex-col text-center my-6">
            <h1 className="text-2xl font-semibold"><span className="text-red-500">**</span> Instructions <span className="text-red-500">**</span></h1>
            <p className="text-lg my-4font-semibold bg-gray-600 rounded-md text-white mx-2 my-4 py-2">To create Template on this section there are some pre set / requirements methods needs to be checked</p>
            <ul className="flex md:flex-row flex-col w-[100%] md:gap-0 gap-y-2">
              {instructionsArray?.map((item, index) => (
                <div key={index} className="w-full md:w-1/3 text-start md:mx-2 border-2 border-gray-400 rounded-md bg-gray-100">
                  <li className="p-2" >{`${item}`}</li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full flex flex-col items-center my-4 bg-blue-200 rounded-md">
          <h1 className="text-2xl mb-4 p-5 rounded-t-md text-center text-white font-semibold bg-gray-600 w-full">Add Inputs for Creating Variable names</h1>
          <div className="flex flex-col items-center">
            <button className="flex items-center gap-1 bg-gray-600 px-2 py-1 w-[150px] justify-center rounded-md text-white font-semibold" onClick={() => handleAdd()}>
              Add Input Fields
            </button>
            <div className="h-fit my-4">
              {addedInputs?.map((data, i) => {
                return (
                  <div key={i} className="my-2">
                    <label className={`w-[200px] sm:text-start text-center p-2 sm:rounded-l-lg sm:rounded-r-none rounded-lg rounded-b-none border-b-2 text-lg 
                    text-black bg-blue-100 shadow-md font-semibold  border-b-blue-300`} htmlFor="input">{`Variable ${i}`}</label>
                    <input type="text" className="bg-white p-2 w-[20vw] min-w-[200px] rounded-r-md"
                      onChange={(e) => { handleAddingInputs(i, e.target.value) }}
                    />
                    <button className="p-2 px-4 rounded-md bg-red-500 m-2 " onClick={() => handleRemove(i)}>X</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateWhatsappTemplatePage;