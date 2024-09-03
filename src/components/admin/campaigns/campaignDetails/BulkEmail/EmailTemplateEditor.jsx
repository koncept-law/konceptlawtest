import React, { useEffect, useMemo, useRef, useState } from "react";
import TemplateInputField from "./TemplateInputField";
import useTemplate from "../../../../../hooks/useTemplate";
import { useForm } from "react-hook-form";
import createAxiosInstance from "../../../../../config/axiosConfig";
import { useSelector } from "react-redux";

const EmailTemplateEditor = ({ messageRef=null, sampleMessageRef=null, template = null, dropdown=[], onEdit=function(){} }) => {
    // console.log("selected template", template);
    const axios = createAxiosInstance();
    const { campaignDetails } = useSelector(state => state.campaigns)
    const [variable, setVariable] = useState([]);
    // console.log("dropdown", template)

    const templateChanger = useTemplate();
    const { setValue, handleSubmit } = useForm();

    useEffect(() => {
        // console.log("template data", template)
        if (template && template?.message) {
            // messageRef.current.innerHTML = template?.html;
            // sampleMessageRef.current.innerHTML = template?.html;
            messageRef.current.innerHTML = template?.message;
            sampleMessageRef.current.innerHTML = template?.message;
            templateChanger.set(template?.message);
            // const variables = templateChanger.format(template?.html);
            const variables = template?.variables?.map((item)=>(
                {
                    label: item?.name,
                    value: item?.name?.split("(")[1]?.split(")")[0],
                }
                // item?.name
            ));

            // console.log("variables", variables);
            setVariable(variables);
        }
    }, [template]);

    const handleInput = async (e) => {
        let obj = { [e.name]: e.value }
        if(e.type === "select"){
            const response = await axios.post("/campaign/getValueBySingleHeader", { campaignName: campaignDetails.name, header: e.value });
            let getValue = response.data;
            // console.log("get value", getValue);
    
            let obj2 = { [e.name]: getValue?.value };
    
            sampleMessageRef.current.innerHTML = templateChanger.get(obj2);
        }else {
            sampleMessageRef.current.innerHTML = templateChanger.get(obj);
        }
        // console.log(obj);
        let key = Object.keys(obj).map((item)=> (item))[0];
        setValue(key, obj[key]);
        handleSubmit(onEdit)();
    }

    return <>
        <div className="w-full flex flex-col justify-center py-5 items-center">
            <div className="flex w-full justify-center items-center">
                <div className="w-1/2 flex h-48 flex-col gap-y-2 items-start justify-start">
                    <h2 className="font-poppins not-italic leading-normal font-semibold">Email:</h2>
                    <div ref={messageRef} className="border h-full w-[95%] border-solid border-slate-200 rounded-sm p-3"></div>
                </div>

                <div className="w-1/2 flex h-48 flex-col gap-y-2 items-start justify-start">
                    <h2 className="font-poppins not-italic leading-normal font-semibold">Sample Email:</h2>
                    <div ref={sampleMessageRef} className=" h-full w-full py-3"></div>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
                {/* <TemplateInputField name={"toName"} onChange={handleInput} />
                <TemplateInputField name={"bankName"} onChange={handleInput} /> */}
                {
                    variable.map((item, index)=> (
                        <TemplateInputField key={index} name={item} dropdown={dropdown} onChange={handleInput} />
                    ))
                }
            </div>
        </div>
    </>
}

export default EmailTemplateEditor;