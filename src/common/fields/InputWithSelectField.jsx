import { Select } from "antd";
import React from "react";
import { Controller } from "react-hook-form";

// icons
import { GoArrowSwitch } from "react-icons/go";

const InputWithSelectField = ({
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
                render={({ field: { onChange, value } }) => (
                    <>
                        <Select
                            className="w-[45%] custom-ant-select"
                            options={[{ label: (selectPlaceholder && selectPlaceholder !== "" ? selectPlaceholder : "Select Headers"), value: "" }, ...options]}
                            placeholder={selectPlaceholder}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            dropdownStyle={{ width: '300px' }}
                            value={options.some(option => option.value === value) ? value : ""}
                            onChange={(selectedValue) => {
                                onChange(selectedValue);
                            }}
                            disabled={!!value && !options.some(option => option.value === value)} // Disable Select if input has a value
                        />
                        <div className="bg-gray-200 flex justify-center items-center w-[10%]">
                            <GoArrowSwitch size={16} />
                        </div>
                        <input
                            type={type}
                            placeholder={placeholder}
                            className="outline-none px-2 w-[45%] font-poppins not-italic leading-normal disabled:cursor-not-allowed disabled:bg-gray-100"
                            value={!options.some(option => option.value === value) ? value : ""}
                            onChange={(e) => {
                                onChange(e.target.value);
                            }}
                            disabled={options.some(option => option.value === value)} // Disable input if Select has a value
                        />
                    </>
                )}
            />
        </div>
    );
};

export default InputWithSelectField;
