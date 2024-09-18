import React from "react";
import { Controller } from 'react-hook-form';

const TextField = ({ control, errors, name, type="text", placeholder = "", className="", parentClass="", label = "", labelClass="", disabled=false }) => {
    return <>
        <div className={"flex flex-col w-full gap-2" + (parentClass !== "" ? ` ${parentClass}`: "")}>
            {label && <label htmlFor={name} className={" ml-0.5 text-[#000000]" + (labelClass !== "" ? ` ${labelClass}`: "")}>{label}</label>}
            <div className="flex items-center border w-full border-solid border-[#eceff1] overflow-hidden bg-transparent rounded-sm">
                <Controller
                    name={name}
                    control={control}
                    className={"bg-transparent w-full"}
                    render={({ field }) => (
                        <input
                            id={name}
                            type={type}
                            placeholder={placeholder}
                            {...field}
                            disabled={disabled}
                            className={"w-full text-[#000000] px-2.5 py-2 text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-light placeholder:text-[#eceff1] not-italic leading-normal bg-transparent font-light outline-none border-none disabled:bg-[#eceff1] disabled:cursor-not-allowed" + (className !== "" ? ` ${className}`: "")}
                        />
                    )}
                />
            </div>
            {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
        </div>
    </>
}

export default TextField;