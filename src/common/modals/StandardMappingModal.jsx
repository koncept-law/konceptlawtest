import React, { useEffect, useState } from "react";
import { Modal, Select } from "antd";
import { RxCross2 } from "react-icons/rx";
import StandardMappingField from "../fields/StandardMappingField";
import { useForm } from "react-hook-form";
import { Button } from "@material-tailwind/react";
import createAxiosInstance from "../../config/axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../redux/features/loaders";
import { toastify } from "../../components/toast";
import { getCampaignByNameThunkMiddleware, getOldPdfsLinkCampaignThunkMiddleware } from "../../redux/features/campaigns";
import { toastifyError } from "../../constants/errors";
import { useNavigate } from "react-router-dom";

const StandardMappingModal = ({ open = false, setOpen = () => { } }) => {
    const axios = createAxiosInstance();
    const {
        campaignDetails,
    } = useSelector((state) => state.campaigns);
    // console.log("campaign details in standard", campaignDetails);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            loanAccountNo: campaignDetails?.loanAccountNo || "",
            emailAddress: campaignDetails?.emailAddress || "",
            customerMobileNumber: campaignDetails?.customerMobileNumber || "",
            customerName: campaignDetails?.customerName || "",
            category1: campaignDetails?.category1 || "",
            category: campaignDetails?.category || "",
            serialNo: campaignDetails?.serialNo || "",
            shortLink: campaignDetails?.shortLink || "",
            longLink: campaignDetails?.longLink || "",
            oldLink: campaignDetails?.oldLink || "",
        }
    });
    const handleCancel = () => setOpen(!open);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (campaignDetails) {
            reset({
                loanAccountNo: campaignDetails?.loanAccountNo || "",
                emailAddress: campaignDetails?.emailAddress || "",
                customerMobileNumber: campaignDetails?.customerMobileNumber || "",
                customerName: campaignDetails?.customerName || "",
                category1: campaignDetails?.category1 || "",
                category: campaignDetails?.category || "",
                serialNo: campaignDetails?.serialNo || "",
                shortLink: campaignDetails?.shortLink || "",
                longLink: campaignDetails?.longLink || "",
                oldLink: campaignDetails?.oldLink || "",
            });
        }
    }, [campaignDetails, reset]);

    // const dropDownList = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];
    const [dropDownList, setDropDownList] = useState([]);
    // const [documentVariables, setDocumentVariables] = useState(null);
    // const [selectedOptionList, setSelectedOptionList] = useState([]);

    const getDocumentVariables = async () => {
        try {
            dispatch(setLoader({ loader: true }))
            const response = await axios.post("/campaign/readExcelHeaders", { campaignName: campaignDetails.name },
            );

            if (response.status === 200) {
                // setDocumentVariables(response?.data.uniqueArray)
                setDropDownList(response?.data.headers);
                dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails.name }));
            }
        } catch (error) {
            // if (error.response?.data) {
            //     console.error({ msg: error.response.data, type: "error" })
            // } else {
            //     console.error({ msg: error.message, type: "error" })
            // }
            toastifyError(error, (call) => {
                if (call === "logout") {
                    navigate("/login");
                }
            })
        } finally {
            dispatch(setLoader({ loader: false }))
        }
    }

    useEffect(() => {
        if (open) {
            getDocumentVariables();
        }
    }, [open]);

    const onSubmit = async (data) => {
        // console.log(data);
        let postData = {
            ...data,
            campaignName: campaignDetails?.name,
            type: campaignDetails?.type,
        }

        try {
            // console.log("standard mapping submit");
            // console.log("Post Data", postData)
            const response = await axios.post("/campaign/standardMapping", postData);
            // console.log("response of mapping data", response);
            if (response.status === 200) {
                toastify({ msg: response.data?.message })
                reset();
                handleCancel();
                dispatch(getCampaignByNameThunkMiddleware({ campaignName: campaignDetails.name }));
            }
        } catch (error) {
            // toastifyError(error);
            toastifyError(error, (call) => {
                if (call === "logout") {
                    navigate("/login");
                }
            })
        }
    }

    return (
        <>
            <Modal
                open={open}
                // onCancel={handleCancel}
                closable={false}
                centered
                footer={null}
                width={800}
            // bodyStyle={{ height: "80vh", padding: 0 }}  // Set height and remove padding
            >
                <div className="overflow-hidden rounded-md h-full">
                    <div className="modelHeadingBackground flex justify-between items-center text-white w-full py-3 px-4">
                        <h2 className="font-poppins not-italic text-[16px] leading-normal">Standard Mapping</h2>
                        <button className="cursor-pointer transition-all active:text-red-700" onClick={handleCancel}>
                            <RxCross2 size={20} />
                        </button>
                    </div>

                    <div className="bg-gray-50 gap-y-5 flex flex-col justify-start items-start w-full py-2 px-8"
                    //  style={{ height: "calc(100% - 48px)" }}
                    >
                        <div className="">

                        </div>
                        <StandardMappingField
                            title="Serial No:"
                            dropDownList={dropDownList}
                            control={control}
                            name="serialNo"
                        />

                        <StandardMappingField
                            title="LoanAccountNo:"
                            dropDownList={dropDownList}
                            control={control}
                            name="loanAccountNo"
                        />

                        <StandardMappingField
                            title="EmailAddress:"
                            dropDownList={dropDownList}
                            control={control}
                            name="emailAddress"
                        />

                        <StandardMappingField
                            title="CustomerMobileNumber:"
                            dropDownList={dropDownList}
                            control={control}
                            name="customerMobileNumber"
                        />

                        <StandardMappingField
                            title="CustomerName:"
                            dropDownList={dropDownList}
                            control={control}
                            name="customerName"
                        />

                        <StandardMappingField
                            title="Category1:"
                            dropDownList={dropDownList}
                            control={control}
                            name="category1"
                        />

                        <StandardMappingField
                            title="Category:"
                            dropDownList={dropDownList}
                            control={control}
                            name="category"
                        />

                        {/* <StandardMappingField
                            title="Short Link:"
                            dropDownList={dropDownList}
                            control={control}
                            name="shortLink"
                        /> */}

                        <StandardMappingField
                            title="Long Link:"
                            dropDownList={dropDownList}
                            control={control}
                            name="longLink"
                        />

                        {
                            campaignDetails?.type === "linkType" ? <>
                        <StandardMappingField
                            title="Old Link:"
                            dropDownList={dropDownList}
                            control={control}
                            name="oldLink"
                        />    
                            </>: null
                        }

                        <div className="flex w-full my-3 justify-end gap-x-2 items-center">
                            <Button className="font-poppins capitalize font-medium py-2 px-4 rounded-md bg-gray-800 text-white leading-normal not-italic" onClick={handleSubmit(onSubmit)}>
                                Send
                            </Button>

                            <Button className="font-poppins capitalize font-medium py-2 px-4 rounded-md border border-solid border-gray-200 shadow-md shadow-gray-300 bg-gray-200 transition-all duration-300 active:scale-90 text-[#000] leading-normal not-italic" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default StandardMappingModal;
