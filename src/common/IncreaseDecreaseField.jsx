import React from "react";
import { Button } from "@material-tailwind/react";

// icons
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Controller } from "react-hook-form";

const IncreaseDecreaseField = ({ control, name }) => {
    return (
        <div className="flex overflow-hidden w-full rounded-sm shadow-sm">
            <Controller
                name={name} // Controller name to link the form field
                control={control} // react-hook-form control prop
                defaultValue={"0"} // Default value of the field
                render={({ field }) => {
                    const handleIncrease = () => {
                        const newValue = Math.max(0, (parseInt(field.value) || 0) + 1); // Increase by 1
                        field.onChange(newValue);
                    };

                    const handleDecrease = () => {
                        const newValue = Math.max(0, (parseInt(field.value) || 0) - 1); // Decrease by 1, but not below 0
                        field.onChange(newValue);
                    };

                    const handleInputChange = (e) => {
                        const inputValue = e.target.value;
                        const numericValue = parseInt(inputValue) || 0;
                        field.onChange(Math.max(0, numericValue)); // Ensure no negative value is set
                    };

                    return (
                        <>
                            <Button
                                className="py-2 px-3 rounded-none shadow-none hover:shadow-none active:scale-100"
                                onClick={handleDecrease}
                                disabled={parseInt(field.value) <= 0}
                                style={{ minWidth: "40px" }} // Ensure consistent button width
                            >
                                <FaMinus size={16} />
                            </Button>

                            <input
                                type="number"
                                min={0}
                                value={field.value} // Bind value from Controller
                                onChange={handleInputChange} // Handle manual input
                                className="outline-none border-t w-full number-field-inc-dec-remove border-b px-2"
                                style={{ appearance: 'textfield', MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                            />

                            <Button
                                className="py-2 px-3 rounded-none shadow-none hover:shadow-none active:scale-100"
                                onClick={handleIncrease}
                                style={{ minWidth: "40px" }} // Ensure consistent button width
                            >
                                <FaPlus size={16} />
                            </Button>
                        </>
                    );
                }}
            />
        </div>
    );
};

export default IncreaseDecreaseField;
