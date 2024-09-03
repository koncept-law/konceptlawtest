import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { createCampaignSmsTemplateThunkMiddleware, uploadCampaignEmailTemplateThunkMiddleware } from "../../../../../redux/features/campaigns";
import JoditEditor from 'jodit-react';
import { toastify } from "../../../../toast";
import EmailBox from "./EmailBox";

const UploadTemplate = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // changes made by abhyanshu
  // const [templateName, setTemplateName] = useState("");
  const [textVariableCount, setTextVariableCount] = useState(null);
  const [variableCount, setVariableCount] = useState(null);
  const [addedInputs, setAddedInputs] = useState([]);
  const [addedVariables, setAddedVariables] = useState({})

  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const emailTextRef = useRef(null)
  // changes made by abhyanshu


  // const { campaignWhatsappTemplates, campaignDetails } = useSelector(
  //   (state) => state.campaigns
  // );


  const uploadTemplateHandler = () => {
    dispatch(
      uploadCampaignEmailTemplateThunkMiddleware({ name, html }, () => {
        navigate("/campaigns/campaigndetails/bulkemail");
      })
    );
  };


  // changes made by abhyanshu
  const config = {
    height: "400px",
  }

  const instructionsArray = [
    ` The Variable Name should be defined in curly braces {}
        with variable defined with $var and indexing of positive
        numbers from 1 to your decided number in sequence - example : {$var1} `,
    `The Number of added variables numbers should match the number of variables
        created in the template and name should be given to the variables - and the
        variables shouldn't contain any special character or different way other then
        Text , underscore , dash `,
    `All the fields Should be filled and not be empty`,
    `Two Values of the variables should be unique`
  ];


  const handleAdd = () => {
    if (textVariableCount - 1 < addedInputs.length) {
      return;
    }
    const added = [...addedInputs, []]
    setAddedInputs(added)
  }

  const handleAddingInputs = (variableIndex, value) => {
    try {
      const variableName = `$var${variableIndex + 1}`;
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
    if (html.length !== 0) {
      let count = html.match(/{(\d+)}/g);
      count = count ? count.length : 0;
      setTextVariableCount(count)
    }

    if (addedInputs) {
      let count = addedVariables;
      let noOfVariables = Object.keys(count);
      setVariableCount(noOfVariables.length)
    }
  }, [html, addedInputs, addedVariables , variableCount])
  // changes made by abhyanshu

  // console.log(html)

  return (
    <div className="overflow-y-auto px-6 py-4 md:gap-4 space-y-3">
      {/* Topbar  */}
      <div className="h-fit px-4 py-2 flex  w-full justify-between bg-white rounded-md">
        <div className=" flex items-center gap-4">
          <button
            onClick={() => navigate("/campaigns/campaigndetails/bulkemail")}
            className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
          >
            <IoMdArrowRoundBack size={26} />
          </button>
          <h1 className=" text-xl font-semibold">Create Bulk Email Template</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={uploadTemplateHandler}
            className=" flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white font-semibold"
          >
            Create
          </button>
        </div>
      </div>

    {/* changes made by abhyanshu */}
      <div className=" bg-white rounded-md h-full p-3">
        <h1 className=" font-bold py-2">Create Templates</h1>
        <form action="" className=" space-y-3">
          <div className=" flex flex-col gap-1 rounded flex-1">
            <label htmlFor="" className="text-sm font-semibold">
              Template Name :
            </label>
            <input
              type="text"
              className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div className=" flex flex-col gap-1 rounded flex-1">
            <label htmlFor="" className="text-sm font-semibold">
              Template :
            </label>
            {/* <textarea
              rows={6}
              className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onChange={(e) => setHtml(e.target.value)}
              value={html}
            /> */}
            {/* <JoditEditor
              rows={6}
              ref={emailTextRef}
              config={config}
              className="border-2 rounded p-1 flex-1 focus:ring-2 focus:ring-purple-800 outline-none"
              onBlur={newContent => setHtml(newContent)}
              onChange={newcontent => { }}
              value={html}
            /> */}
            <EmailBox html={html} setHtml={setHtml}/>
          </div>
        </form>


        <div>
          <div className="flex flex-col text-center my-6">
            <h1 className="text-2xl font-semibold"><span className="text-red-500">**</span> Instructions <span className="text-red-500">**</span></h1>
            <p className="text-lg my-4font-semibold bg-gray-600 rounded-md text-white mx-2 my-4 py-2">To create Template on this section there are some pre-set / requirements that needs to be checked</p>
            <ul className="flex w-[100%]">
              {instructionsArray?.map((item, index) => (
                <div key={index} className="w-1/3 text-start mx-2 border-2 border-gray-400 rounded-md bg-gray-100">
                  <li className="p-2" >{`${item}`}</li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div>
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
    </div>
  );
};

export default UploadTemplate;