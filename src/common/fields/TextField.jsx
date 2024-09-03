import React from "react";

const TextField = ({
    name = "",
    label = "",
    placeholder="",
    className = "",
    labelClass = "",
    type= "text",
    onChange=function(){},
    mainClass="",
}) => {
    return <>
        <div className={`flex justify-start items-start w-full flex-col ${mainClass}`}>
            <label htmlFor={name} className={`font-poppins ml-1 not-italic leading-normal font-medium ${labelClass}`}>{label}</label>
            <input type={type} placeholder={placeholder} className={`font-poppins not-italic font-light placeholder:font-poppins leading-normal text-[#000] py-1 px-2 outline-[#000] border border-solid border-gray-300 w-full ${className}`} onChange={onChange} />
        </div>
    </>
}

export default TextField;