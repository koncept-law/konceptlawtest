import React, { useState } from "react";
import { Select } from "antd";
import { Controller } from "react-hook-form";
import TextInput from "./TextInput";

const OptionalField = ({ control, errors, documentTemplateCategories, onChange=function(){} }) => {
    const [activeInputMethod, setActiveInputMethod] = useState("");

    const handleActiveInputMethod = (method, value) => {
        if (method === "input" && (value !== "")) {
            setActiveInputMethod("input");
            onChange(value);
        } else if (method === "dropdown" && (value !== "select")) {
            setActiveInputMethod("dropdown");
            onChange(value);
        } else {
            // console.log("selected value select");
            setActiveInputMethod("");
            onChange(null);
        }
    };

    return (
        <div className="flex gap-x-4 items-end w-full">
            <TextInput
                name="foldername"
                control={control}
                errors={errors}
                placeholder="Enter Folder Name"
                label="Folder Name"
                disabled={activeInputMethod === "dropdown"}
                onChangeValue={(e) => {
                    handleActiveInputMethod("input", e.target.value);
                }}
            />

            <span className="text-lg flex justify-center items-start h-full">OR</span>

            <Controller
                name="selectfoldername"
                control={control}
                rules={activeInputMethod === "dropdown" ? { required: true } : { required: false }}
                render={({ field }) => (
                    <Select
                        showSearch
                        placeholder="Select an Option"
                        className="w-full h-[40px] block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...field}
                        options={[
                            { label: "Select an Option", value: "select" },
                            ...(documentTemplateCategories?.map((option) => ({ label: option, value: option })) || [])
                        ]}
                        onChange={(value) => {
                            handleActiveInputMethod("dropdown", value);
                            field.onChange(value);
                        }}
                        disabled={activeInputMethod === "input"}
                    />
                )}
            />
            {errors.selectfoldername && <span className="text-red-500">This field is required</span>}
        </div>
    );
};

export default OptionalField;
