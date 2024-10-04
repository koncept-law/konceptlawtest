import React, { useState } from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import TextInput from "../fields/TextInput";
import { Button } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastify } from "../../components/toast";

const PhoneTestModal = ({ isModalVisible = false, setIsModalVisible = function () { }, onSubmit = function () { } }) => {
    const validationSchema = Yup.object().shape({
        mobile: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required"),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleCancel = () => {
        setIsModalVisible(false);
        reset(); // Clear the input field when the modal is closed
    };

    const onFormSubmit = (data) => {
        if (data.mobile) {
            // toastify({ msg: "Whatsapp Campaign Testing Successfully." });
            onSubmit(data.mobile);
            reset({mobile: ""}); // Reset the form fields
            handleCancel();
        }
    };

    return (
        <>
            <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                closable={false}
                width={800}
            >
                <div className="w-full flex flex-col justify-center items-center">
                    <div className="py-3 px-4 bg-slate-800 w-full flex justify-between items-center text-white">
                        <h2 className="not-italic leading-normal font-medium font-poppins">Sample Message Testing</h2>
                        <button className="cursor-pointer" onClick={handleCancel}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white p-3 w-full flex justify-center items-center">
                        <div className="flex justify-center w-full my-1 gap-x-2 items-end">
                            <form onSubmit={handleSubmit(onFormSubmit)} className="w-full flex items-end gap-x-2">
                                <TextInput
                                    type="number"
                                    name="mobile"
                                    placeholder="Enter Mobile Number"
                                    control={control}
                                    errors={errors}
                                    label="Phone Number"
                                    className={`rounded-sm ${errors["mobile"] ? 'border-red-500' : ''}`}
                                    labelClass={`text-sm mb-1 ${errors["mobile"] ? 'text-red-500' : ''}`}
                                    mainClass="w-[65%]"
                                />

                                <Button type="submit" className="capitalize py-2 text-[14px] w-[35%] rounded-sm text-white bg-slate-700 font-poppins not-italic leading-normal font-medium">
                                    Send Test Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default PhoneTestModal;
