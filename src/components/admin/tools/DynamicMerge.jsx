import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Spinner } from "@material-tailwind/react";
import { RxCross2 } from "react-icons/rx";
import createAxiosInstance from "../../../config/axiosConfig";
import { Modal, Select } from "antd";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { toastify } from "../../toast";
import InputWithSelectField from "../../../common/fields/InputWithSelectField";
import InputWithSelectModeField from "../../../common/fields/InputWithSelectModeField";

const DynamicMerge = ({ open = false, setOpen = () => { } }) => {
    const handleOpen = () => setOpen(!open);
    const [showSpinner, setShowSpinner] = useState(false);
    const [dropdownlist, setDropDownList] = useState([]);

    const book1Ref = useRef(null);
    const book2Ref = useRef(null);

    const { campaignDetails } = useSelector((state) => state.campaigns);
    const axios = createAxiosInstance();

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            book1: null,
            book2: null,
            emailHeader: "",
            fieldsToMap: []
        }
    });

    const getDrops = async () => {
        const response = await axios.post("/campaign/readExcelHeaders", { campaignName: campaignDetails.name });
        if (response.status === 200) {
            setDropDownList(response?.data.headers);
        }
    };

    useEffect(() => {
        getDrops();
    }, []);

    const dropdown = useMemo(() => {
        return dropdownlist ? dropdownlist.map((item) => ({ label: item, value: item })) : [];
    }, [dropdownlist]);

    const startMerge = async (data) => {
        let { book1, book2, emailHeader, fieldsToMap } = data;
        if (fieldsToMap?.inputValue && fieldsToMap?.inputValue !== "") {
            fieldsToMap = fieldsToMap?.inputValue;
        } else {
            fieldsToMap = fieldsToMap?.selectValue;
        }
        // console.log({ book1, book2 })
        // console.log({ book1, book2, emailHeader, fieldsToMap });

        if (book1 && book2) {
            const formData = new FormData();
            formData.append("book1", book1);
            formData.append("book2", book2);
            formData.append("emailHeader", emailHeader);
            formData.append("fieldsToMap", fieldsToMap);

            // setShowSpinner(true);
            const response = await axios.postForm("/tools/mergeBook1V2", formData, {
                responseType: 'blob'
            });

            if (response.status === 200) {
                setShowSpinner(false);
                const blob = response.data;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'mergedBookV2.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                toastify({ msg: "File merged and downloaded successfully!", type: "success" });
                reset();
                book1Ref.current.value = "";
                book2Ref.current.value = "";
                handleOpen();
            }
        } else {
            toastify({ msg: "No Book File Selected", type: "error" });
        }
    };

    return (
        <Modal
            open={open}
            onCancel={handleOpen}
            footer={[]}
            centered
            closable={false}
            width={700}
        >
            <div className="flex flex-col w-full">
                <div className="flex p-3 justify-between bg-slate-800 text-white w-full items-center">
                    <h2 className="font-poppins not-italic leading-normal font-medium">Dynamic Merge</h2>
                    <button className="cursor-pointer active:text-red-700 transition-all" onClick={() => setOpen(false)}>
                        <RxCross2 size={18} />
                    </button>
                </div>

                <div className="bg-white flex flex-col py-5 px-2 gap-y-2 w-full">
                    <h2 className="text-start font-poppins not-italic leading-normal">Book1:</h2>
                    <div className="flex justify-start w-full gap-x-2 items-center">
                        <Controller
                            name="book1"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input ref={book1Ref} type="file" onChange={(e) => onChange(e.target.files[0])} />
                            )}
                        />
                        <div className="w-full flex justify-end items-center">
                            {/* <Controller
                                name="emailHeader"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className="w-[150px] custom-ant-select"
                                        options={dropdown}
                                        placeholder="Select Headers"
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                )}
                            /> */}
                            <InputWithSelectField
                                options={dropdown}
                                placeholder="Write Header"
                                selectPlaceholder="Select Headers"
                                control={control}
                                name="emailHeader"
                            />
                        </div>
                    </div>

                    <h2 className="text-start font-poppins not-italic leading-normal">Book2:</h2>
                    <div className="flex justify-start w-full gap-x-2 items-center">
                        <Controller
                            name="book2"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input ref={book2Ref} type="file" onChange={(e) => onChange(e.target.files[0])} />
                            )}
                        />
                        <div className="w-full flex justify-end items-center">
                            {/* <Controller
                                name="fieldsToMap"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className="w-[150px] custom-ant-select"
                                        mode="multiple"
                                        showSearch
                                        placeholder="Select Headers"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={dropdown}
                                    />
                                )}
                            /> */}
                            <InputWithSelectModeField
                                options={dropdown}
                                placeholder="Write Header"
                                selectPlaceholder="Select Headers"
                                control={control}
                                name="fieldsToMap"
                                mode="multiple"
                            />
                        </div>
                    </div>

                    <Button className="bg-purple-700 py-2 mt-3 text-[16px] rounded-sm flex justify-center items-center w-full capitalize font-poppins not-italic leading-normal gap-x-2 font-medium" onClick={handleSubmit(startMerge)}>
                        {showSpinner ? <Spinner width={16} /> : "Merge"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DynamicMerge;
