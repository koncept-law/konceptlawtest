import React, { useMemo, useState } from "react";
import { Select } from 'antd';
import { IoRepeat } from "react-icons/io5";
import "./templateInputField.css";

const { Option } = Select;

const TemplateInputField = ({ name=null, onChange = function(){}, dropdown=[] }) => {
    const [selectedOption, setSelectedOption] = useState("");
    const [inputValue, setInputValue] = useState("");

    // const options = [
    //     { value: "", label: "Select an Option" },
    //     { value: '1', label: 'Option 1' },
    //     { value: '2', label: 'Option 2' },
    //     { value: '3', label: 'Option 3' },
    //     { value: '4', label: 'Option 4' },
    //     // Add more options as needed
    // ];

    const options = useMemo(()=> {
        if(dropdown){
            return Array.isArray(dropdown) && dropdown?.length > 0 ? [{ value: "", label: "Select an Option" }, ...dropdown?.map((item) => ({ label: item, value: item }))] : [{ value: "", label: "Select an Option" }]
        }
    }, [dropdown]);

    const handleSelectChange = (value) => {
        setSelectedOption(value);
        if (value === "") {
            setInputValue(""); // Clear input value when select option is reset
        }
        // console.log("on change", name?.value, value)
        onChange({name: name?.value, value: value, type: "select"});
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        if (e.target.value === "") {
            setSelectedOption(""); // Clear select value when input is reset
        }
        onChange({name: name?.value, value: e.target.value, type: "input" });
    };

    return (
        <div className="w-full flex justify-center border my-3 rounded-md overflow-auto bg-slate-200 border-solid border-slate-200">
            <div className="w-[15%]">
                <label htmlFor="" className="flex justify-start font-poppins not-italic leading-normal text-[14px] font-medium items-center h-full px-3">{name?.label || ''}</label>
            </div>
            <div className="w-[40%]">
                <Select
                    mode="single"
                    placeholder="Select options"
                    style={{ width: "100%", height: "100%", backgroundColor: "white" }}
                    // allowClear
                    showSearch
                    className="custom-select"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option?.children?.toLowerCase().includes(input.toLowerCase())
                    }
                    value={selectedOption}
                    onChange={handleSelectChange}
                    disabled={inputValue !== ""} // Disable select if input field is not empty
                >
                    {options.map(option => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <div className="w-[5%] flex justify-center items-center">
                <div className="w-full flex justify-center items-center h-full">
                    <IoRepeat size={19} />
                </div>
            </div>
            <div className="w-[40%]">
                <input
                    type="text"
                    placeholder="Type here"
                    className="w-full h-full py-2.5 bg-white px-3 disabled:bg-[#f5f5f5] font-poppins not-italic leading-normal outline-none"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={selectedOption !== ""} // Disable input if select field is not empty
                />
            </div>
        </div>
    );
};

export default TemplateInputField;
