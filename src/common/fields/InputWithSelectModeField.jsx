import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";

// icons
import { GoArrowSwitch } from "react-icons/go";

const InputWithSelectModeField = ({
    name = "",
    control,
    type = "text",
    placeholder = "",
    options = [],
    selectPlaceholder = "",
    className = "",
}) => {
    return (
        <div className={`flex justify-center w-full border border-solid overflow-hidden rounded-md ${className}`}>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => {
                    const selectValues = Array.isArray(value?.selectValue) ? value.selectValue : []; // Ensure value is an array for Select component
                    const inputValue = typeof value?.inputValue === "string" ? value.inputValue : ""; // Ensure input value is a string

                    return (
                        <>
                            <Select
                                className="w-[45%] custom-ant-select"
                                options={[{ label: "Select an Option", value: "" }, ...options]}
                                placeholder={selectPlaceholder}
                                mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                dropdownStyle={{ width: '300px' }}
                                value={selectValues}
                                onChange={(selectedValues) => {
                                    onChange({
                                        selectValue: selectedValues,
                                        inputValue: selectedValues.length === 0 ? inputValue : "" // Clear input if Select has a value
                                    });
                                }}
                                disabled={!!inputValue} // Disable Select if input has a value
                            />
                            <div className="bg-gray-200 flex justify-center items-center w-[10%]">
                                <GoArrowSwitch size={16} />
                            </div>
                            <input
                                type={type}
                                placeholder={placeholder}
                                className="outline-none px-2 w-[45%] font-poppins not-italic leading-normal disabled:cursor-not-allowed disabled:bg-gray-100"
                                value={inputValue}
                                onChange={(e) => {
                                    onChange({
                                        selectValue: selectValues,
                                        inputValue: e.target.value
                                    });
                                }}
                                disabled={selectValues.length > 0} // Disable input if Select has any values
                            />
                        </>
                    );
                }}
            />
        </div>
    );
};

export default InputWithSelectModeField;
