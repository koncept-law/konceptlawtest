import React, { useState } from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import TextInput from "../fields/TextInput";
import { Button } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toastify } from "../../components/toast";
import { useDispatch } from "react-redux";

const EditAccount = ({
    isModalVisible = false,
    setIsModalVisible = function () { },
    accountDetails = null,
    onSubmit = function () { },
}) => {
    const dispatch = useDispatch();
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required("First Name is required"),
        lastName: Yup.string()
            .required("Last Name is required"),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleCancel = () => {
        setIsModalVisible(false);
        reset();
    };

    const onFormSubmit = async (data) => {
        // console.log(data, accountDetails?.accountId)
        if (data) {
            onSubmit({ ...data, accountId: accountDetails?.accountId });
            reset({
                firstName: "",
                lastName: "",
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
                        <h2 className="not-italic leading-normal font-medium font-poppins">Edit Account Name:- {accountDetails?.firstName} {accountDetails?.lastName}</h2>
                        <button className="cursor-pointer" onClick={handleCancel}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white p-3 w-full flex justify-center items-center">
                        <div className="flex justify-start flex-col w-full gap-y-2 my-1 gap-x-2 items-start">
                            <div className="w-full flex justify-start items-end gap-x-2">
                                <TextInput
                                    name="firstName"
                                    placeholder="Enter first Name"
                                    control={control}
                                    errors={errors}
                                    label="Enter First Name"
                                    mainClass="w-[65%]"
                                />

                                <TextInput
                                    name="lastName"
                                    placeholder="Enter Account Name"
                                    control={control}
                                    errors={errors}
                                    label="Enter Last Name"
                                    mainClass="w-[65%]"
                                />
                            </div>
                            <Button className="capitalize py-2 text-[14px] w-[35%] rounded-sm text-white bg-slate-700 font-poppins not-italic leading-normal font-medium" onClick={handleSubmit(onFormSubmit)}>
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EditAccount;
