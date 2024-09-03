import React, { useState } from "react";

// icons
import { CgSoftwareDownload } from "react-icons/cg";

const ReportCard = ({ color, title, number, total }) => {
    const [SelectLineColor, setSelectLineColor] = useState("");
    // number = (number ? (typeof number === "string" ? Number.parseInt(number): number): 0);
    // total = (total ? (typeof total === "string" ? Number.parseInt(total): total): 0);

    useState(() => {
        if (color === "blue") {
            setSelectLineColor("bg-blue-500");
        } else if (color === "lightgreen") {
            setSelectLineColor("bg-lime-400");
        } else if (color === "red") {
            setSelectLineColor("bg-red-600");
        } else if (color === "green") {
            setSelectLineColor("bg-green-600");
        } else if (color === "yellow") {
            setSelectLineColor("bg-yellow-500");
        } else if (color === "purple") {
            setSelectLineColor("bg-purple-500");
        } else {
            setSelectLineColor("bg-blue-500");
        }
    }, [color]);

    // console.log("total sms type in report card" , total );
    // console.log("every value type in report card" , typeof number )

    return <>
        <div className="bg-white h-fit min-h-[130px] rounded-md border w-full border-solid border-slate-200 shadow-md shadow-slate-100 p-3">
            <div className="w-full flex justify-start gap-x-4 flex-wrap items-center">
                <h2 className="uppercase text-slate-900 font-bold text-[15px]">{title}</h2>
                {
                    (total !== 0 || null || undefined) ?
                        <h2 className="uppercase text-slate-900 font-bold text-[14px]">{number}</h2>
                        : (<h2 className="uppercase text-slate-900 font-bold text-[14px]">0</h2>)
                }
            </div>
            <div className="flex justify-center items-center flex-col">
                {/* {
                    (total !== 0 || null || undefined) ?
                        <h2 className="uppercase text-slate-900 font-bold text-xl mb-2">{number}</h2>
                        : (<h2 className="uppercase text-slate-900 font-bold text-xl mb-2">0</h2>)
                } */}
                {
                    (total !== 0 || null || undefined) ?
                        (<div className="w-full overflow-hidden rounded-md h-4 bg-gray-200 border border-solid m-2 border-slate-100">
                            <div className={"border border-solid transition-all h-full rounded-full" + (color !== "" ? ` ${SelectLineColor}` : "bg-blue-500")} style={{ width: `${((number / total) * 100)}%` }}></div>
                        </div>)
                        : (<div className="w-full overflow-hidden rounded-md h-4 bg-gray-200 shadow-slate-100 border border-solid m-2 border-slate-100">
                            <div className={"border border-solid transition-all h-full rounded-full" + (color !== "" ? ` ${SelectLineColor}` : "bg-blue-500")} style={{ width: `0%` }}></div>
                        </div>)
                }
            </div>
            <div className="flex justify-between items-center">
                {
                    (total !== 0 || null || undefined) ?
                        (<h2 className="uppercase text-slate-900 font-bold text-[14px]">
                            {((number / total) * 100).toString().slice(0, 5)}%</h2>)
                        : ("")
                }
                {/* <button>
                    <CgSoftwareDownload size={"22px"} />
                </button> */}
            </div>
        </div>
    </>
}

export default ReportCard;