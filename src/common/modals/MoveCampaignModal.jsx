import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { getAllCampaignThunkMiddleware, getAllUsersThunkMiddleware, moveCampaignThunkMiddleware, setCampaigns } from "../../redux/features/campaigns";
import SelectField from "../fields/SelectField";

const MoveCampaignModal = ({
    isModalVisible = false,
    setIsModalVisible = function () { },
}) => {
    const dispatch = useDispatch();
    const { campaignDetails, allUsers, singleUser } = useSelector(state => state.campaigns);

    const options = useMemo(()=> {
        return allUsers?.map(({ accountId, firstName, lastName })=>({
            label: `${firstName} ${lastName}`,
            // value: _id,
            value: accountId
        })) || []
    }, [allUsers]);

    // console.log("options", options)

    useEffect(() => {
        if(isModalVisible){
            dispatch(getAllUsersThunkMiddleware());
        }
    }, [isModalVisible]);

    const validationSchema = Yup.object().shape({
        accountId: Yup.string()
            .required("Select a Account, Account is required"),
    });

    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const handleCancel = () => {
        setIsModalVisible(false);
        reset();
    };

    const onFormSubmit = async (data) => {
        data = {
            ...data,
            campaignName: campaignDetails?.name,
        }
        if (data) {
            // accountId, campaignName
            dispatch(moveCampaignThunkMiddleware(data, (call)=> {
                if(call){
                    dispatch(setCampaigns({ campaignDetails: null, allCampaigns: null }));
                    dispatch(getAllCampaignThunkMiddleware({ accountId: singleUser?.accountId }));
                }
            }));
            reset({
                accountId: "",
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
                        <h2 className="not-italic leading-normal text-gray-200 font-medium font-poppins">Move Campaign: <span className="text-white">{campaignDetails?.name}</span></h2>
                        <button className="cursor-pointer" onClick={handleCancel}>
                            <RxCross2 size={18} />
                        </button>
                    </div>

                    <div className="bg-white p-3 w-full flex justify-center items-center">
                        <div className="flex justify-start flex-col w-full gap-y-2 my-1 gap-x-2 items-start">
                            <h2 className="font-poppins not-italic leading-normal font-medium">Select a Account</h2>
                            <div className="w-full flex flex-col justify-start items-start gap-y-2 gap-x-2">
                                <SelectField
                                    name="accountId"
                                    placeholder="Select Account"
                                    control={control}
                                    errors={errors}
                                    label="Accounts"
                                    mainClass="w-[65%]"
                                    options={options}
                                />
                            </div>
                            <Button className="capitalize py-2 text-[14px] w-[35%] rounded-sm text-white bg-slate-700 font-poppins not-italic leading-normal font-medium" onClick={handleSubmit(onFormSubmit)}>
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MoveCampaignModal;
