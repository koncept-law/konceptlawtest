import React, { useRef, useState } from "react";
import { Select } from "antd";
import { Button } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";

import "./FilterFieldStyle.css";

const FilterField = ({ onChange }) => {
    const [Type, setType] = useState("name");
    const searchRef = useRef(null);

    let option = [
        { label: "Campaign", value: "name" },
        { label: "Upload", value: "upload" },
        { label: "Date", value: "date" },
        { label: "Merge", value: "merge" },
        { label: "Pdf", value: "pdf" }
    ]

    const handleChange = (e) => {
        let text = e.target.value;
        onChange({ type: Type, text: text });
    }

    const handleCancel = () => {
        onChange({ type: Type, text: "" });
        searchRef.current.value = "";
    }

    return <>
        <div className="flex border border-solid border-gray-100 items-center overflow-hidden rounded-md">
            <Select
                defaultValue={"name"}
                className="text-sm input-filter-style w-[100px]"
                onChange={e => setType(e)}
                options={option || []}
            />
            <input ref={searchRef} type="text" placeholder="Filter" className="outline-none w-[120px] text-[14px] py-0.5 px-2" onChange={handleChange} />
            <Button className="bg-gray-800 text-white px-2 rounded-none py-0.5" onClick={handleCancel}>
                <RxCross2 size={"14px"} />
            </Button>
        </div>
    </>
}

export default FilterField;