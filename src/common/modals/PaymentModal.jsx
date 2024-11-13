import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

// barcode
// import barcode from "../../assets/images/barcode.png";
// import barcode2 from "../../assets/images/barcode2.png";
import { Modal, Progress } from "antd";
import { useForm } from "react-hook-form";
import RequiredText from "../Texts/RequiredText";
import { yupResolver } from "@hookform/resolvers/yup";
// import { paymentSchema } from "../../config/validations";
import useTimer from "../../hooks/useTimer";
import { toastify } from "../../components/toast";
import MyButton from "../../components/common/Buttons/MyButton";
import InputField from "../fields/InputField";

import konceptBarCode from "../../assets/konceptBarCode.jpg";

const PaymentModal = ({
    isOpen = false,
    setIsOpen = () => { },
}) => {
    // state
    const [open, setOpen] = useState(false);

    const {
        control,
        formState: {
            errors
        },
        handleSubmit,
        reset,
    } = useForm({
        // resolver: yupResolver(paymentSchema),
        defaultValues: {
            transactionId: '',
            amount: '',
        }
    });


    // functions
    const handleClose = () => setIsOpen(false);
    const handleCancel = () => {
        setOpen(false);
        handleClose();
        reset();
    }

    // hooks
    const timer = useTimer();

    // console.log(timer.time);

    useEffect(() => {
        // console.log(timer);
        if (isOpen) {
            timer.start("7:00");
        } else {
            timer.resetAndStop();
        }
    }, [isOpen]);

    useEffect(() => {
        if ((timer.time === "00:00" || timer.time === "0:00" || timer.time === "00:0") && timer.isActive) {
            handleCancel();
            toastify({ msg: "Transaction Close because timeout!", type: "error" });
        }
    }, [timer.time]);

    const onSubmit = (data) => {
        console.log(data);
    }

    return <>
        <Modal
            open={open}
            onCancel={() => setOpen(false)}
            closable={false}
            footer={[]}
            centered
            styles={{
                content: {
                    padding: 0,
                }
            }}
        >
            <div className="px-4 py-3">
                <div className={`text-xl text-black py-0 poppins-font`}>
                    <div className="flex w-full justify-end font-poppins not-italic leading-normal text-[16px] items-center">
                        {/* <span>{title}</span> */}
                        <button onClick={() => setOpen(false)} className="active:text-red-600 shadow-none hover:shadow-none transition-all outline-none select-none">
                            <RxCross2 size={"20px"} />
                        </button>
                    </div>
                </div>
                <div className="w-full py-3 flex font-poppins leading-normal not-italic justify-center items-center">
                    <h2 className="text-[16px]">Are You Sure? Cancel for Transaction?</h2>
                </div>
                <div className="w-full flex justify-end items-center gap-x-2 mt-2">
                    <MyButton className="bg-slate-200 py-2 px-4 text-black" onClick={() => setOpen(false)}>Cancel</MyButton>
                    <MyButton className="normal-case bg-blue-600 py-2 px-4" onClick={handleCancel}>Ok</MyButton>
                </div>
            </div>
        </Modal>
        <Modal
            open={isOpen}
            onClose={handleCancel}
            width={600}
            footer={[]}
            closable={false}
            centered
            styles={{
                content: {
                    padding: "10px 14px"
                }
            }}
        >
            <div className={`text-xl text-black py-0 poppins-font`}>
                <div className="flex w-full justify-end font-poppins not-italic leading-normal text-[16px] items-center">
                    {/* <span>{title}</span> */}
                    <button onClick={() => setOpen(true)} className="active:text-red-600 shadow-none hover:shadow-none transition-all outline-none select-none">
                        <RxCross2 size={"20px"} />
                    </button>
                </div>
            </div>
            <div className={`bg-transparent lg:px-3 py-0 gap-y-2 flex flex-col font-poppins leading-normal not-italic font-medium text-slate-800 justify-center items-center w-full uploads-field`}>
                <h2>Complete the transaction within the time limit:</h2>
                <img src={konceptBarCode} className="w-24 my-1" />

                <div className="w-full flex flex-col justify-center items-center gap-y-3">
                    <h2>Time Left: {timer.time}</h2>

                    <Progress percent={timer.percentage} strokeColor={"red"} showInfo={false} />
                </div>

                <div className="w-full grid grid-cols-1 gap-y-3">
                    <InputField
                        name="transactionId"
                        label={<RequiredText className="text-[13px] -mb-2">Transaction ID</RequiredText>}
                        control={control}
                        errors={errors}
                    />

                    <InputField
                        name="amount"
                        label={<RequiredText className="text-[13px] -mb-2">Amount</RequiredText>}
                        control={control}
                        errors={errors}
                    />
                </div>

                <h2 className="text-red-600 text-[13px] text-center">Please complete the payment within the remaining time and mark it as paid.</h2>

                <div className="w-full flex justify-end items-center gap-x-2 mt-2">
                    <MyButton className="bg-slate-200 text-black" onClick={() => setOpen(true)}>Cancel</MyButton>
                    <MyButton className="normal-case" onClick={handleSubmit(onSubmit)}>Mark as Paid</MyButton>
                </div>
            </div>
        </Modal>
    </>
}

export default PaymentModal;