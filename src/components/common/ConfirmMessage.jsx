import React from "react";

// icons
import { RxCross2 } from "react-icons/rx";

/**
 * 
 * @params yes = "", no = "", children, className = "", value=function(){ return boolean } 
 * @returns boolean value like `true | false`
 * @example 
 * <ConfirmMessage yes="Yes, Are you sure?" no="No, I am not sure!" className="text-red-500" value={(e)=>{
 * console.log(e); // return boolean value like `true | false`
 * }}>
 * Confirm Message!
 * </ConfirmMessage>
 */
const ConfirmMessage = ({yes="", no="", children, className="", value=function(){} , deleteBtn  }) => {
    // functions
    const CloseDisplay = (e) => {
        let id = e.target.id;
        if(id === "confirm-message"){
            value(false);
        }
    }

    return <>
        <div className="fixed top-0 left-0 w-full h-full z-30">
            <div className="flex justify-center items-center w-full h-full backdrop-brightness-75" id="confirm-message" onClick={CloseDisplay}>
                <div className="w-3/4 md:w-1/2 bg-white rounded-md p-3 border border-solid border-slate-200 shadow-md shadow-slate-600 flex flex-col justify-center items-center">
                    <div className="w-full flex justify-end mb-2 items-center">
                        <button onClick={()=> { value(false) }}>
                            <RxCross2 size={"22px"} className="text-slate-700 cursor-pointer" />
                        </button>
                    </div>

                    <div className={"flex justify-center items-center" + (className !== "" ? ` ${className}`: "")}>
                        {children}
                    </div>

                    <div className="w-full flex justify-center mt-3 items-center">
                        <button type="button" className="text-white bg-gray-400 border border-gray-300 focus:outline-none hover:bg-gray-600 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={()=>{
                            value(false);
                        }}>{no}</button>

                        <button type="button" className={`"focus:outline-none text-white ${ deleteBtn ? "bg-red-600 hover:bg-red-800" : "bg-green-600 hover:bg-green-800" } font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-500"`} onClick={()=>{
                            value(true);
                        }}>{yes}</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ConfirmMessage;