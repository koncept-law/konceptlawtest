import React, { useState } from "react";
import { Calendar, Modal, Spin, TimePicker } from "antd";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import "./schedulemodal.css";
import { toastify } from "../../components/toast";

const ScheduleModal = ({
    isOpen = false,
    setIsOpen = function () { },
    withOutSchedule = function(){},
    isLoading = false,
}) => {
    const [scheduleShow, setScheduleShow] = useState(false);

    // Function to handle modal close
    const handleClose = () => {
        setIsOpen(false);
    };

    // React Hook Form setup
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm();

    const onSubmit = (data) => {
        if (scheduleShow) {
            let date = moment(data?.date).format("DD-MM-YYYY");
            if (!date || date === "Invalid date") {
                toastify({ msg: "Please select a valid date before proceeding.", type: "error" });
                return 0;
            }

            let time = data?.time;
            if (!time) {
                toastify({ msg: "Please select a valid time before proceeding.", type: "error" });
                return 0;
            }

            let dateTime = { date, time };
            setIsLoading(true);
            console.log(dateTime);
        } else {
            // console.log("Submission without schedule.");
            withOutSchedule(true);
        }
    }

    return (
        <Modal
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            closable={false}
            className="rounded-md overflow-hidden relative"
            width={800}
            centered
        >
            {
                isLoading ? <>
                    <div className="bg-white/60 z-50 absolute top-0 flex justify-center flex-col gap-3 items-center left-0 w-full h-full">
                        <Spin />
                        <h2 className="font-poppins not-italic leading-normal text-[#000000] font-semibold text-[18px]">Processing...</h2>
                    </div>
                </> : null
            }

            <div className="flex justify-between py-2 px-4 items-center text-white koncept-background">
                <h2 className="font-poppins not-italic leading-normal text-[16px]">Send Whatsapp</h2>
                <Button className="bg-transparent shadow-none hover:shadow-none p-1 hover:bg-white/25 rounded-sm" onClick={handleClose}>
                    <RxCross2 size={18} />
                </Button>
            </div>

            <div className="bg-white p-2 rounded-b-md">
                {!scheduleShow ? (
                    <div className="flex justify-center items-center py-4 flex-col">
                        <div className="flex justify-center items-center gap-x-3 py-4">
                            <h2 className="font-poppins not-italic leading-normal font-semibold text-[18px]">
                                If you want to schedule:
                            </h2>
                            <Button
                                className="font-poppins not-italic leading-normal text-white capitalize rounded-md py-2 px-4 bg-slate-900 font-light"
                                onClick={() => setScheduleShow(true)}
                            >
                                Schedule
                            </Button>
                        </div>
                        <h2 className="font-poppins not-italic leading-normal font-semibold text-[25px]">OR</h2>
                        <div className="flex justify-center items-center gap-x-3 py-4">
                            <h2 className="font-poppins not-italic leading-normal font-semibold text-[18px]">
                                If you want to send:
                            </h2>
                            <Button className="font-poppins not-italic leading-normal text-white capitalize rounded-md py-2 px-4 bg-slate-900 font-light" onClick={onSubmit}>
                                Save & Send
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* TimePicker field */}
                        <Controller
                            name="time"
                            control={control}
                            defaultValue={null}
                            render={({ field: { onChange, value } }) => (
                                <TimePicker
                                    className="absolute custom-time-picker top-2 right-[36%] w-[150px] h-[30px]"
                                    format="HH:mm:ss"
                                    value={value ? moment(value, "HH:mm:ss") : null}
                                    onChange={(time, timeString) => onChange(timeString)}
                                    placeholder="Select time"
                                />
                            )}
                        />

                        {/* Calendar field */}
                        <Controller
                            name="date"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                                <Calendar
                                    {...field}
                                    fullscreen={false}
                                    onSelect={(date) => field.onChange(date)}
                                    // value={field.value ? moment(field.value) : null}
                                    className="w-full"
                                />
                            )}
                        />
                    </div>
                )}
            </div>

            {scheduleShow && (
                <div className="w-full py-2 px-4 flex justify-end items-center gap-x-2">
                    <Button
                        className="font-poppins not-italic leading-normal text-[#000000] capitalize rounded-md py-2 px-4 bg-gray-400 font-medium"
                        onClick={() => {
                            reset();
                            setScheduleShow(false);
                        }}
                    >
                        Back
                    </Button>
                    <Button className="font-poppins not-italic leading-normal text-white capitalize rounded-md py-2 px-4 bg-slate-900 font-light" onClick={handleSubmit(onSubmit)}>
                        Schedule
                    </Button>
                </div>
            )}
        </Modal>
    );
};

export default ScheduleModal;