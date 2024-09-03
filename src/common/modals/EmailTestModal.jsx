import React, { useState } from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import TextInput from "../fields/TextInput";
import { Button } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastify } from "../../components/toast";

const EmailTestModal = ({ isModalVisible = false, title = "", buttonText = "", setIsModalVisible = function () { }, onSubmit = function () { } }) => {
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invail Email")
            .required("Email is required"),
        // subject: Yup.string()
        //     .required("Subject is required"),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleCancel = () => {
        setIsModalVisible(false);
        reset(); // Clear the input field when the modal is closed
    };

    const onFormSubmit = async (data) => {
        if (data) {
            // toastify({ msg: "Whatsapp Campaign Testing Successfully." });
            onSubmit(data);
            reset({
                email: "",
                // subject: '',
            }); // Reset the form fields
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
                        <h2 className="not-italic leading-normal font-medium font-poppins">{title !== "" ? title : "Sample Message Testing"}</h2>
                        <button className="cursor-pointer" onClick={handleCancel}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white p-3 w-full flex justify-center items-center">
                        <div className="flex justify-start flex-col w-full gap-y-2 my-1 gap-x-2 items-start">
                            <div className="w-full flex justify-start items-end gap-x-2">
                                <TextInput
                                    type="email"
                                    name="email"
                                    placeholder="Enter Your Email"
                                    control={control}
                                    errors={errors}
                                    label="Email"
                                    className={`rounded-sm ${errors["email"] ? 'border-red-500' : ''}`}
                                    labelClass={`text-sm mb-1 ${errors["email"] ? 'text-red-500' : ''}`}
                                    mainClass="w-[65%]"
                                />

                                {/* <TextInput
                                    type="text"
                                    name="subject"
                                    placeholder="Subject..."
                                    control={control}
                                    errors={errors}
                                    label="Subject"
                                    className={`rounded-sm ${errors["subject"] ? 'border-red-500' : ''}`}
                                    labelClass={`text-sm mb-1 ${errors["subject"] ? 'text-red-500' : ''}`}
                                    mainClass="w-[65%]"
                                /> */}
                            </div>
                            <Button className="capitalize py-2 text-[14px] w-[35%] rounded-sm text-white bg-slate-700 font-poppins not-italic leading-normal font-medium" onClick={handleSubmit(onFormSubmit)}>
                                {buttonText !== "" ? buttonText : "Send Test Message"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EmailTestModal;
