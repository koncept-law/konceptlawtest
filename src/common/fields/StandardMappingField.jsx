import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";

const StandardMappingField = ({ dropDownList = [], title = "", control, name="" }) => {
    return (
        <div className="w-full flex justify-start gap-x-3 items-center">
            <h2 className="font-poppins not-italic text-[16px] w-1/3 leading-normal font-medium text-gray-700">{title}</h2>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}  // Spread the field props (value, onChange, onBlur)
                        showSearch
                        placeholder="Select an Option"
                        className="w-full"
                        options={[
                            { label: "Select an Option", value: "" },  // Adjust value for placeholder
                            ...(dropDownList?.map((option) => ({ label: option, value: option })) || [])
                        ]}
                    />
                )}
            />
        </div>
    );
};

export default StandardMappingField;
