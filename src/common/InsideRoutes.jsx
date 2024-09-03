import React, { useState } from "react";

const InsideRoutes = ({ links = [], children, onChange=function(){} }) => {
    // selected
    const [selected, setSelected] = useState("reports");
    // components
    const TopScreenButton = ({ children, select = false, onClick = function () { } }) => {
        return <button className={`p-2 bg-white text-center flex w-fit border-2 border-solid rounded-t-md ${select ? "border-blue-600" : "border-transparent"}`} onClick={onClick}>{children}</button>
    }

    return <>
        <div className="h-full flex flex-col bg-white justify-start items-start w-full">
            <div className="flex justify-start items-end">
                {
                    links.map((item, index) => (
                        <TopScreenButton key={index} select={item.value === selected} onClick={() => {
                            setSelected(item.value);
                            onChange(item.value);
                        }}>
                            {item.label}
                        </TopScreenButton>
                    ))
                }
            </div>
            <div className="w-full overflow-y-scroll h-[74vh]">
                {
                    children?.length ? children?.map(({ props: { name, children } }, index)=> {
                        return name === selected ? <div key={index} className="w-full h-full bg-white">
                            {children}                    
                        </div>: null
                    }): children
                }
            </div >
        </div >
    </>
}

export default InsideRoutes;