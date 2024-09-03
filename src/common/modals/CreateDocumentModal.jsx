import React, { useEffect } from "react";
import { Modal, Select } from "antd";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import { getAvailableServersReportThunkMiddleware } from "../../redux/features/campaigns";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const CreateDocumentModal = ({ open = false, setOpen = function () { }, data=[], submit = function(){} }) => {
    const onClose = () => setOpen(!open);
    const dispatch = useDispatch();
    const { serverNames } = useSelector((state) => state.campaigns);

    const { control, handleSubmit } = useForm();

    useEffect(()=> {
        if(open){
            dispatch(getAvailableServersReportThunkMiddleware());
        }
    }, [open]);

    // const filterOptions = [
    //     { label: "card", value: "card" },
    //     { label: "document", value: "document" },
    // ];
    const filterOptions = serverNames ? serverNames?.map((item)=> ( { value: JSON.stringify(item), label: item?.serverNo } )): [];

    return (
        <Modal
            open={open}
            onCancel={onClose}
            centered
            closable={false}
            footer={[]}
        >
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex w-full justify-between items-center px-3 py-2">
                    <h2 className="text-[15px] font-medium font-poppins not-italic leading-normal text-[#000]">Create Document</h2>
                    <button className="cursor-pointer active:text-red-700 transition-all text-[#000] p-2" onClick={onClose}>
                        <RxCross2 size={"18px"} />
                    </button>
                </div>
                <div className="flex justify-center px-4 gap-x-2 items-center w-full">
                    <div className="w-full">
                        <Controller
                            name={"serverNames"}
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    allowClear={true}
                                    mode="multiple"
                                    placeholder={"Select"}
                                    onChange={(value) => field.onChange(value)}
                                    onBlur={field.onBlur}
                                    value={field.value}
                                    style={{ width: '100%' }}
                                >
                                    {filterOptions.map((option) => (
                                        <Option key={option.value} value={option.value}>
                                            {option.label}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        />
                    </div>

                    <div className="my-3 flex justify-end items-center">
                        <Button className="py-1.5 px-4 rounded-md text-white bg-slate-800 capitalize leading-normal not-italic font-poppins font-medium" onClick={handleSubmit(submit)}>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreateDocumentModal;
