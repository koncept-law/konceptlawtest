import React from 'react';
import { Controller } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';

const EmailField = ({ 
  control, 
  errors, 
  name, 
  placeholder = "", 
  className="", 
  parentClass="", 
  label = "", 
  labelClass="", 
  disabled=false 
}) => {
  return (
    <div className={"flex flex-col w-full gap-2" + (parentClass !== "" ? ` ${parentClass}`: "")}>
      {label && <label htmlFor={name} className={" ml-0.5 text-[#000000]" + (labelClass !== "" ? ` ${labelClass}`: "")}>{label}</label>}
      <div className={`flex items-center border w-full border-solid  ${disabled ? "bg-[#eceff1] cursor-not-allowed": "bg-transparent"} border-[#eceff1] overflow-hidden  rounded-sm`}>
        <MdOutlineMailOutline size={"18px"} className={`text-[#eceff1] bg-transparent ml-2`} />
        <Controller
          name={name}
          control={control}
          className="bg-transparent w-full"
          render={({ field }) => (
            <input
              id={name}
              type="text"
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              className={"w-full px-2.5 py-2 text-[#000000] text-sm font-poppins placeholder:font-poppins placeholder:not-italic placeholder:text-sm placeholder:leading-normal placeholder:font-light placeholder:text-[#6E6E6E] not-italic leading-normal bg-transparent disabled:cursor-not-allowed font-light outline-none border-none" + (className !== "" ? ` ${className}`: "")}
            />
          )}
        />
      </div>
      {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
    </div>
  );
};

export default EmailField;
