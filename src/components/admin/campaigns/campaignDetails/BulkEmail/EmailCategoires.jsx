import React, { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SelectField from "../../../../../common/fields/SelectField";
import { Select } from "antd";
import { campaignCategoriesThunkMiddleware, emailCategoriesThunkMiddleware } from "../../../../../redux/features/campaigns";
import usePath from "../../../../../hooks/usePath";

const EmailCategories = () => {
    const navigate = useNavigate();
    const path = usePath();
    const { campaignDetails, smsCategories, campaignCategories } = useSelector(
        (state) => state.campaigns
    );
    const dispatch = useDispatch();
    // console.log("campaign Categories:", campaignCategories);

    const [filters, setFilters] = useState([]);
    const [filterValues, setFilterValues] = useState({});

    useEffect(() => {
        let payload = { campaignName: campaignDetails?.name };
        dispatch(campaignCategoriesThunkMiddleware(payload));
        if (smsCategories?.filter) {
            setFilterValues(smsCategories?.filter);
            setFilters(Object.keys(smsCategories?.filter).map((item) => ({ id: Number.parseInt(item) })));
        }
    }, []);

    const { control, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            // categories: smsCategories?.category?.categories,
        }
    });

    const NextEvent = (data) => {
        // console.log(e);
        // console.log(filterValues);
        // dispatch(emailCategoriesThunkMiddleware({ category: e, filter: filterValues }));
        data = {
            ...data,
            Category: [data?.Category],
            campaignName: campaignDetails?.name,
        }
        // console.log(data)
        dispatch(emailCategoriesThunkMiddleware(data));
        navigate("/campaigns/campaigndetails/email/bulkemail");
    }

    const BackEvent = () => {
        // navigate("/campaigns/campaigndetails");
        path.back();
    }

    const addFilter = () => {
        const newFilterId = Date.now();
        setFilters([...filters, { id: newFilterId }]);
        setFilterValues({ ...filterValues, [newFilterId]: null });
    };

    const removeFilter = (id) => {
        setFilters(filters.filter((filter) => filter.id !== id));
        const newFilterValues = { ...filterValues };
        delete newFilterValues[id];
        setFilterValues(newFilterValues);
    };

    const handleFilterChange = (value, id) => {
        setFilterValues({ ...filterValues, [id]: value });
    };

    // const options = [
    //     { label: "All Categories", value: "all" },
    //     { label: "arbitration", value: "arbitration" },
    //     { label: "cardcivil", value: "cardcivil" },
    // ];

    const options = campaignCategories?.category ? campaignCategories?.category?.map((category) => ({ label: category, value: category })) : [];
    // const options = [];
    // console.log("options", options);
    const filterOptions = campaignCategories?.category1 ? campaignCategories?.category1?.map((category) => ({ label: category, value: category })) : [];
    // const filterOptions = [
    //     { label: "Whatsapp+Sms", value: "whatsapp+sms" },
    //     { label: "RPAD+EmailSms+Whatsapp", value: "RPAD+EmailSms+Whatsapp" },
    // ];

    return (
        <div className="w-full">
            {/* Topbar */}
            <div className="h-fit px-4 py-2 shadow-md shadow-slate-200 flex md:flex-row flex-col gap-y-2 md:my-0 w-full justify-between bg-white rounded-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={BackEvent}
                        className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                    >
                        <IoMdArrowRoundBack size={26} />
                    </button>
                    <h1 className="text-xl font-poppins font-medium text-slate-700 leading-normal">
                        Email Categories
                    </h1>
                </div>
            </div>

            <div className="w-full flex flex-col">
                <div className="flex justify-between w-full items-end my-2">
                    <label className="text-lg font-poppins font-semibold">
                        Categories * :
                    </label>
                    <div className="flex justify-center items-center gap-x-4">
                        <Button
                            className="bg-gray-100 text-[#242424] transition-all duration-200 active:scale-90 gap-x-2 flex items-center capitalize font-poppins leading-normal py-2 px-4"
                            onClick={BackEvent}
                        >
                            <FaArrowLeft size={16} />
                            <span>Back</span>
                        </Button>

                        <Button
                            className="bg-slate-800 text-gray-50 gap-x-2 transition-all duration-200 active:scale-90 flex items-center capitalize font-poppins leading-normal py-2 px-4"
                            onClick={handleSubmit(NextEvent)}
                        >
                            <span>Next</span>
                            <FaArrowRight size={16} />
                        </Button>
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <SelectField
                        control={control}
                        errors={errors}
                        name="Category"
                        placeholder="Select a category"
                        options={options ? [{ label: "All Categories", value: "all" }, ...options] : []}
                    />
                </div>

                <h2 className="my-3 font-poppins not-italic leading-normal text-slate-800 text-lg font-semibold">Filter</h2>

                <Controller
                    name={"Category1"}
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
        </div>
    );
};

export default EmailCategories;
