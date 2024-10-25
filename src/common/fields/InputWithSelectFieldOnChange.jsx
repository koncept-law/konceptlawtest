import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { GoArrowSwitch } from "react-icons/go";

const InputWithSelectFieldOnChange = ({
    options = [],
    placeholder = "Write...",
    selectPlaceholder = "Select",
    className = "",
    onChange = () => {},
    defaultOption = ""
}) => {
    const [selectValue, setSelectValue] = useState("");
    const [inputValue, setInputValue] = useState("");

    // Set the initial default option
    useEffect(() => {
        if (options.some(option => option.value === defaultOption)) {
            setSelectValue(defaultOption);
        } else {
            setInputValue(defaultOption);
        }
    }, [defaultOption, options]);

    const handleSelectChange = (value) => {
        setSelectValue(value);
        setInputValue(""); // Clear input if select has a value
        onChange(value);
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setSelectValue(""); // Clear select if input has a value
        onChange(value);
    };

    return (
        <div className={`w-full ${className}`}>
            <div className={`flex justify-center w-full border border-solid overflow-hidden rounded-md ${className}`}>
                <Select
                    className="w-[45%] custom-ant-select"
                    options={[{ label: selectPlaceholder || "Select Headers", value: "" }, ...options]}
                    placeholder={selectPlaceholder}
                    showSearch
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    dropdownStyle={{ width: '300px' }}
                    value={selectValue || ""}
                    onChange={handleSelectChange}
                    disabled={!!inputValue} // Disable Select if input has a value
                />
                <div className="bg-gray-200 flex justify-center items-center w-[10%]">
                    <GoArrowSwitch size={16} />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className="outline-none px-2 w-[45%] font-poppins not-italic leading-normal disabled:cursor-not-allowed disabled:bg-gray-100"
                    value={inputValue || ""}
                    onChange={handleInputChange}
                    disabled={!!selectValue} // Disable input if Select has a value
                />
            </div>
        </div>
    );
};

export default InputWithSelectFieldOnChange;
