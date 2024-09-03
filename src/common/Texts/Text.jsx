import React from "react";

const Text = ({ children, className="" }) => {
    return <>
        <h2 className={`font-poppins not-italic leading-normal font-medium ${className}`}>{children}</h2>
    </>
}

export default Text;