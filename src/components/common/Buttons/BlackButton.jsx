import React from "react";

const BlackButton = ({children, className="", onClick = function(){}}) => {
    return <>
        <button className={"bg-slate-900 active:bg-slate-950 transition-all text-white p-3 cursor-pointer rounded-md shadow-md shadow-slate-800" + (className !== "" ? ` ${className}`: "")} onClick={onClick}>{children}</button>
    </>
}

export default BlackButton;