import { Button } from "@material-tailwind/react";
import React from "react";
import { MdDelete } from "react-icons/md";
import { Controller } from "react-hook-form";

const AddVariableField = ({
    control, // Pass the control object from react-hook-form
    name = "",
    index = 0,
    removeField, // Function to remove the field
}) => {
    return (
        <>
            <div className="flex justify-center rounded-md border my-2 border-solid border-gray-300 overflow-hidden">
                <label
                    htmlFor={name}
                    className="font-poppins cursor-pointer active:bg-gray-900 transition-all not-italic leading-normal px-3 bg-gray-800 py-2 text-white"
                >
                    Variable {index}
                </label>
                <Controller
                    name={name}
                    control={control}
                    defaultValue="" // Initialize with default value
                    render={({ field }) => (
                        <input
                            {...field}
                            id={name}
                            className="px-2 outline-none"
                            autoComplete="off"
                        />
                    )}
                />
                <Button
                    onClick={removeField} // Use removeField prop correctly
                    className="py-2 px-3 bg-red-700 text-white flex justify-center items-center rounded-none"
                >
                    <MdDelete size={18} />
                </Button>
            </div>
        </>
    );
};

export default AddVariableField;
