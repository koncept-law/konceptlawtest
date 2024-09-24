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
import { campaignCategoriesThunkMiddleware, smsCategoriesThunkMiddleware } from "../../../../../redux/features/campaigns";
import usePath from "../../../../../hooks/usePath";

const SmsCategories = () => {
    const navigate = useNavigate();
    const { campaignDetails, smsCategories, campaignCategories } = useSelector(
        (state) => state.campaigns
    );
    const dispatch = useDispatch();
    const path = usePath();
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

    const NextEvent = (e) => {
        // console.log(e);
        // console.log(filterValues);
        dispatch(smsCategoriesThunkMiddleware({ category: e, filter: filterValues }));
        navigate("/campaigns/sms/application");
    }

    const BackEvent = () => {
        path.back();
        // navigate("/campaigns/campaigndetails");
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
    console.log("options", options);
    const filterOptions = campaignCategories?.category1 ? campaignCategories?.category1?.map((category) => ({ label: category, value: category })) : [];
    // const filterOptions = [
    //     { label: "Whatsapp+Sms", value: "whatsapp+sms" },
    //     { label: "RPAD+EmailSms+Whatsapp", value: "RPAD+EmailSms+Whatsapp" },
    // ];

    return (
        <div className="w-full">
            {/* Topbar */}
            {/* <div className="h-fit px-4 py-2 shadow-md shadow-slate-200 flex md:flex-row flex-col gap-y-2 md:my-0 w-full justify-between bg-white rounded-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={BackEvent}
                        className="w-fit flex items-center gap-1 buttonBackground px-2 py-1 rounded-md text-white font-semibold"
                    >
                        <IoMdArrowRoundBack size={26} />
                    </button>
                    <h1 className="text-xl font-poppins font-medium text-slate-700 leading-normal">
                        Sms Categories
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 bg-yellow-600 px-2 py-1 rounded-md text-white font-semibold">
                        Logs
                    </button>
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white font-semibold"
                    >
                        Save
                    </button>
                    <button
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-1 bg-gray-600 px-2 py-1 rounded-md text-white font-semibold"
                    >
                        Save & Send
                    </button>
                </div>
            </div> */}

            <div className="w-full flex flex-col">
                <div className="flex justify-between w-full items-end my-2">
                    <label className="text-lg font-poppins font-semibold">
                        Categories * :
                    </label>
                    <div className="flex justify-center items-center gap-x-4">
                        <Button
                            className="bg-gray-100 text-[#242424] gap-x-2 flex items-center capitalize font-poppins leading-normal py-2 px-4"
                            onClick={BackEvent}
                        >
                            <FaArrowLeft size={16} />
                            <span>Back</span>
                        </Button>

                        <Button
                            className="bg-slate-800 text-gray-50 gap-x-2 flex items-center capitalize font-poppins leading-normal py-2 px-4"
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
                        name="categories"
                        placeholder="Select a category"
                        options={options ? [{ label: "All Categories", value: "all" }, ...options] : []}
                    />
                </div>

                <h2 className="my-3 font-poppins not-italic leading-normal text-slate-800 text-lg font-semibold">Filter</h2>

                <Controller
                    name={"category1"}
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

                {/* {
                    watch("categories") && watch("categories") !== "all" ? <>
                        <div className="w-full flex p-4 my-2 flex-col items-end">
                            <Button
                                className="bg-slate-800 text-gray-50 gap-x-2 flex items-center capitalize font-poppins leading-normal text-[15px] py-2 px-4"
                                onClick={addFilter}
                            >
                                <FaPlus size={16} />
                                <span>Filter</span>
                            </Button>

                            <div className="overflow-y-scroll h-[55vh] w-full flex flex-col justify-start px-3 my-2 items-center">
                                {filters.map((filter, index) => (
                                    <div key={index} className="flex justify-center my-1 gap-x-3 items-center w-full">
                                        <div className="p-3 w-[20%]">
                                            Category 1
                                        </div>
                                        <div className="w-full">
                                            <Select
                                                placeholder="Select Filter"
                                                options={filterOptions}
                                                className="w-full"
                                                value={filterValues[filter.id]}
                                                onChange={(value) => handleFilterChange(value, filter.id)}
                                            />
                                        </div>
                                        <Button
                                            className="bg-red-700 text-white py-2 px-2 rounded-md w-[50px] flex justify-center items-center"
                                            onClick={() => removeFilter(filter.id)}
                                        >
                                            <MdDeleteOutline size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </> : null
                } */}
            </div>
        </div>
    );
};

export default SmsCategories;
