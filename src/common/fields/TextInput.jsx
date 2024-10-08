import React from "react";
import { Controller } from "react-hook-form";

const TextInput = ({ 
    control, 
    errors, 
    name, 
    placeholder = "", 
    className = "", 
    parentClass = "", 
    label = "", 
    labelClass = "", 
    disabled = false, 
    onChangeValue=function(){},
    type="text",
}) => {
    return (
        <div className={"flex flex-col w-full gap-2" + (parentClass !== "" ? ` ${parentClass}` : "")}>
            {label && <label htmlFor={name} className={"font-medium ml-0.5 text-[#000000]" + (labelClass !== "" ? ` ${labelClass}` : "")}>{label}</label>}
            <div className={`flex items-center border w-full border-solid  ${disabled ? "bg-[#6e6e6e34]" : "bg-transparent"} border-[#6E6E6E] overflow-hidden  rounded-sm`}>
                <Controller
                    name={name}
                    control={control}
                    className="bg-transparent w-full"
                    render={({ field: { value, onChange } }) => (
                        <input
                            id={name}
                            value={value}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            onChange={(e)=> {
                                onChange(e);
                                onChangeValue(e);
                            }}
                            // {...field}
                            className={"w-full px-2.5 py-2 text-[#000000] text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-medium placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent font-medium outline-none border-none" + (className !== "" ? ` ${className}` : "")}
                        />
                    )}
                />
            </div>
            {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
        </div>
    );
};

export default TextInput;