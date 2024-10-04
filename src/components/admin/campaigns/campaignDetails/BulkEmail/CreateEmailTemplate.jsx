import React, { useRef } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import AddVariableField from "../../../../../common/fields/AddVariableField";
import { Button } from "@material-tailwind/react";
import { toastify } from "../../../../toast";
import { useDispatch, useSelector } from "react-redux";
import { createCampaignSmsTemplateThunkMiddleware } from "../../../../../redux/features/campaigns";
import { useNavigate } from "react-router-dom";
import usePath from "../../../../../hooks/usePath";

const htmlGenerator = (text = "") => {
    // Step 1: Identify placeholders and escape angle brackets within them
    const placeholderRegex = /\{\$var\d+\}/g;
    const placeholders = {};
    let tempText = text.replace(placeholderRegex, (match) => {
        const tempKey = `__PLACEHOLDER_${Object.keys(placeholders).length}__`;
        placeholders[tempKey] = match;
        return tempKey;
    });

    // Step 2: Replace `<` with `<p>` and `>` with `</p>`, but avoid placeholders
    tempText = tempText.replace(/\(/g, '<p>').replace(/\)/g, '</p>');

    // Step 3: Restore the placeholders
    const finalText = tempText.replace(/__PLACEHOLDER_\d+__/g, (match) => placeholders[match]);

    return `<p>${finalText}</p>`;
};

const CreateEmailTemplate = () => {
    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues
    } = useForm();

    const dispatch = useDispatch();
    const path = usePath();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variables", // Name for the field array
    });

    const { singleUser } = useSelector(state => state.campaigns);
    // console.log(singleUser);
    const navigate = useNavigate();

    const convertRef = useRef(null);

    const [templateText, setTemplateText] = React.useState(""); // State for template text

    const instructionsArray = [
        `The Variable Name should be defined in curly braces {}
        with variable defined with $var and indexing of positive
        numbers from 1 to your decided number in sequence - example : {$var1}`,
        `The Number of added variables numbers should match the number of variables 
        created in the template and name should be given to the variables - and the
        variables shouldn't contain any special character or different way other than 
        text, underscore, dash.`,
        `All the fields should be filled and not be empty.`,
        `Two values of the variables should be unique.`
    ];

    const onSubmit = (data) => {
        let variables = data.variables;

        // Flag to check if there are any errors
        let hasError = false;

        // Process the variables, validate, and show error if any variable is empty
        variables = variables?.map((variable, index) => {
            if (variable?.value !== "") {
                return { [`$var${index + 1}`]: variable?.value };
                // return { name: `${variable?.value}($var${index + 1})` }
            } else {
                toastify({ msg: `Variable ${index + 1} cannot be empty`, type: "error" });
                hasError = true; // Set error flag
                return null; // Ensure null is returned for empty values
            }
        }).filter(variable => variable !== null); // Filter out the null values

        // If there's an error, do not proceed with the form submission
        if (hasError) {
            return;
        }

        let vari = {};
        variables.forEach((item)=> {
            Object.keys(item).map((key)=> {
                vari[key] = item[key];
            })
        })

        let html = htmlGenerator(data?.templateText);
        convertRef.current.innerHTML = html;

        data = {
            templateName: data?.templateName,
            html: html,
            variables: vari,
            message : convertRef.current.innerText,
            accountId: singleUser?.accountId,
            verified: true,
            type: "email"
        };

        // console.log(variables); // Display the valid variables

        dispatch(createCampaignSmsTemplateThunkMiddleware(data,
          (error)=>{
            if(!error){
                navigate("/campaigns/campaigndetails/email/bulkemail")
            }
          }
        ));
    };

    // Function to handle adding input field
    const handleAddInputField = () => {
        const values = getValues();
        const templateTextValue = values.templateText || "";
        let index = fields.length + 1; // Increment index for the new variable

        // Regex to match the variable pattern with the current index
        const regex = new RegExp(`\\{\\$var${index}\\}`, `g`);
        let existing = templateTextValue.match(regex);

        if (existing) {
            // Add a new input field if the variable exists in the template text
            append({ value: "" });
        } else {
            // Show an error if the variable is not found in the template text
            toastify({ msg: `Variable {$var${index}} not found in the template text`, type: "error" });
        }
    };

    return (
        <>
            <h2 ref={convertRef} className="hidden"></h2>
            <div className="w-full h-full overflow-y-scroll px-1 py-2">
                <div className="h-fit px-4 py-1 flex md:flex-row flex-col md:gap-0 gap-y-2 w-full justify-between bg-white rounded-md">
                    <div className="flex items-center gap-4">
                        {/* <button
                            className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                            onClick={() => path.back()}
                        >
                            <IoMdArrowRoundBack size={26} />
                        </button> */}
                        <h1 className="text-lg font-poppins not-italic leading-normal font-medium">Create Email Template</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            className="flex items-center gap-1 font-poppins not-italic leading-normal capitalize bg-green-600 px-3 text-[15px] py-1.5 rounded-sm text-white font-medium"
                        >
                            Create Template
                        </Button>
                    </div>
                </div>

                <div className="h-fit px-4 py-2 mt-1 flex flex-col md:gap-0 w-full justify-between bg-white shadow-md shadow-gray-200 rounded-md">
                    <div className="w-full flex justify-start flex-col gap-y-2 items-start font-medium">
                        <div className="flex justify-center items-center gap-x-2">
                            <h2 className={"font-poppins not-italic leading-normal font-medium text-[15px]"}>Template Name :</h2>
                            {errors.templateName && (
                                <p className="text-red-500 text-sm -mt-0.5">{errors.templateName?.message}</p>
                            )}
                        </div>
                        <Controller
                            name="templateName"
                            control={control}
                            rules={{ required: "* Required" }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="text"
                                    className={`outline-none border-2 border-solid placeholder:font-light ${errors.templateName ? "border-red-500" : "border-gray-200"
                                        } rounded-md w-full p-1 px-2`}
                                    placeholder="Template Name..."
                                />
                            )}
                        />
                    </div>

                    <div className="w-full flex flex-col my-3 justify-start items-start">
                        <div className="flex justify-center items-center gap-x-2">
                            <h2 className={"font-poppins not-italic leading-normal font-medium text-[15px]"}>Text :</h2>
                            {errors.templateText && (
                                <p className="text-red-500 text-sm -mt-0.5">{errors.templateText?.message}</p>
                            )}
                        </div>
                        <Controller
                            name="templateText"
                            control={control}
                            rules={{ required: "* Required" }}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setTemplateText(e.target.value); // Update state with the current template text
                                    }}
                                    autoComplete="off"
                                    className={`outline-none h-44 border-2 border-solid placeholder:font-light ${errors.templateText ? "border-red-500" : "border-gray-200"
                                        } rounded-md w-full p-1 px-2`}
                                    placeholder="Template Message..."
                                />
                            )}
                        />
                    </div>

                    <div>
                        <div className="flex flex-col text-center my-6">
                            <h1 className="text-2xl font-semibold"><span className="text-red-500">**</span> Instructions <span className="text-red-500">**</span></h1>
                            <p className="text-lg font-semibold bg-gray-600 rounded-md text-white mx-2 my-4 py-2">To create a Template in this section, there are some pre-set requirements that need to be checked.</p>
                            <ul className="flex md:flex-row flex-col w-[100%] md:gap-0 gap-y-2">
                                {instructionsArray?.map((item, index) => (
                                    <div key={index} className="w-full md:w-1/3 text-start md:mx-2 border-2 border-gray-400 rounded-md bg-gray-100">
                                        <li className="p-2">{item}</li>
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="w-full rounded-md flex flex-col justify-center overflow-hidden items-center">
                        <div className="bg-gray-800 text-white text-center w-full py-4">
                            <h2 className="font-poppins italic leading-normal text-lg">Add Inputs for Creating Variable names</h2>
                        </div>

                        <div className="flex justify-center py-2 px-1 items-center flex-col w-full bg-gray-100">
                            <Button
                                className="bg-gray-800 rounded-md px-3 py-2 text-white capitalize font-poppins not-italic leading-normal font-medium my-2 text-[14px]"
                                onClick={handleAddInputField}
                            >
                                Add Input Field
                            </Button>
                            {fields.map((field, index) => (
                                <AddVariableField
                                    key={field.id}
                                    control={control}
                                    name={`variables.${index}.value`} // Unique name for each input
                                    index={index + 1}
                                    removeField={() => remove(index)} // Correctly bind the remove function
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateEmailTemplate;
