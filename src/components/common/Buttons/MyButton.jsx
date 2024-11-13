import { Button } from "@material-tailwind/react";
import React from "react";

/**
 * 
 * @param {Object} props
 * @param {'button' | 'reset' | 'submit'} props.type default button
 * @param {Function} props.onClick
 * @param {Object} props.children
 * @param {boolean} props.disabled
 */
const MyButton = ({
    children,
    className = "",
    type="button",
    onClick = () => { },
    disabled = false,
}) => {
    return <>
        <Button
            className={`font-poppins not-italic leading-normal shadow-none hover:shadow-none font-medium rounded-md normal-case ${className} ${disabled && "cursor-not-allowed relative"}`}
            onClick={!disabled && onClick}
            type={type}
            disabled={disabled}
        >
            {children}
            {disabled && <div className="top-0 left-0 bg-white/30 w-full h-full absolute"></div>}
        </Button>
    </>
}

export default MyButton;