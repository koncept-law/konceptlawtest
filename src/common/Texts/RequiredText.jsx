import React from "react";

const RequiredText = ({ children, className = "" }) => {
    return <h2 className={`gap-x-1 flex items-center ${className}`}>
        <span className="text-red-600 text-[20px]">*</span>
        {children}
    </h2>
}

export default RequiredText;