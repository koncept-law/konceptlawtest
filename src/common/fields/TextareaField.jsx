import React from "react";
import { Controller } from "react-hook-form";

const TextareaField = ({ control, name, label, readOnly, errors, rows = 1, ...rest }) => (
  <div className="mb-4">
    {label && (
      <label
        htmlFor={name}
        className="block text-black text-left font-semibold text-[12px] md:text-sm mb-1 poppins-font"
      >
        {label}
      </label>
    )}
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <textarea
          id={name}
          {...field}
          {...rest}
          rows={rows} // Apply rows attribute
          readOnly={readOnly}
          className={`poppins-font bg-white peer w-full bg-transparent text-[#000] font-sans font-medium outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 transition-all placeholder-shown:border placeholder-shown:border-[#767676] border focus:border-2 text-[12px] md:text-sm px-3 py-2.5 rounded-[7px] border-[#767676] focus:border-[#767676] ${errors[name] ? "border-red-500" : ""}`}
        />
      )}
    />
    {errors[name] && (
      <p className="text-red-500 text-xs italic">{errors[name]?.message}</p>
    )}
  </div>
);

export default TextareaField;
