import React from "react";
import { Controller } from "react-hook-form";
import { Select } from "antd";

const { Option } = Select;

const SelectField = ({
    placeholder = "",
    name = "",
    control,
    errors,
    disabled = false,
    options = [],
}) => {
    return <>
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(value) => field.onChange(value)}
                    onBlur={field.onBlur}
                    value={field.value}
                    style={{ width: '100%' }}
                >
                    {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            )}
        />
        {errors[name] && (
            <span className="text-red-500">{errors[name].message}</span>
        )}
    </>
};

export default SelectField;
