import React, { useState } from "react";
import { Button } from "@material-tailwind/react";

import { MdDelete, MdOutlineDeleteSweep } from "react-icons/md";
import DeleteModal from "../modals/DeleteModal";
import createAxiosInstance from "../../config/axiosConfig";
import { toastifyError } from "../../constants/errors";
import { toastify } from "../../components/toast";
import usePath from "../../hooks/usePath";

const DropdownOption = ({
    title = "",
    value,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const axios = createAxiosInstance();
    const path = usePath();
    
    const handleDeleteEvent = async () => {
        // console.log(value);
        try {
            const response = await axios.post("/smsTemp/delete", { templateId: value?.templateId });
            if(response.status === 200){
                toastify({ msg: response.data?.message | response.data?.msg });
                setIsOpen(false);
                path.back();
            }
        }catch(err){
            toastifyError(err);
        }
    }

    return <>
        <DeleteModal
            open={isOpen}
            setOpen={setIsOpen}
            deleteEvent={handleDeleteEvent}
            title={title}
        />
        <div className="w-full flex justify-between items-center">
            <h2>{title}</h2>
            <Button className="bg-red-800 text-white py-1 px-1.5 rounded-sm" onClick={() => {
                // console.log(value);
                setIsOpen(true);
            }}>
                <MdDelete size={16} />
            </Button>
        </div>
    </>
}

export default DropdownOption;