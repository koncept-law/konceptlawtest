import React from "react";
import { Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../../redux/features/loaders";
import axios from "axios";
import { toastify } from "../../toast";
import Spinner from "../../common/Spinner";
import logo from "../../../assets/konceptLogo.png";
import { registerSchema } from "../../../common/constant/validation";
import { Button } from "@material-tailwind/react";
import PasswordField from "../../../common/fields/PasswordField";
import EmailField from "../../../common/fields/EmailField";
import { logoutThunkMiddleware } from "../../../redux/features/user";
import TextInput from "../../../common/fields/TextInput";
import { toastifyError } from "../../../constants/errors";

const AddUser = ({ open, setOpen }) => {
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm({
        resolver: yupResolver(registerSchema),
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { registerLoader } = useSelector((state) => state.loaders);

    const submitHandler = async (data) => {
        // console.log("add new account", data);
        try {
            dispatch(setLoader({ registerLoader: true }));
            const response = await axios.post(`https://t.kcptl.in/account/post`, data);
            dispatch(logoutThunkMiddleware());
            navigate("/login");
            toastify({ msg: response.data.message, type: "success" });
            reset();
        } catch (error) {
            // if (error.response?.data) {
            //     toastify({ msg: error.response.data.message, type: "error" });
            // } else {
            //     toastify({ msg: error.message, type: "error" });
            // }
            toastifyError(error, (call) => {
                if(call){
                  navigate("/login");
                }
              })
        } finally {
            dispatch(setLoader({ registerLoader: false }));
        }
    };

    return (
        <Modal
            centered
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={600}
            closable={true}
        >
            <div className="flex flex-col justify-center">
                <div className="w-full flex justify-center items-center">
                    <div className="w-full md:w-[80%] py-4 px-2">
                        <div className="w-full flex flex-col items-center gap-2">
                            <div className="w-[5rem] h-[3rem] flex">
                                <img src={logo} alt="logo" className="w-full h-full" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold logo-color font-poppins not-italic leading-normal text-center">
                                    {/* Koncept Law Associates */}
                                    New Koncept Law Account
                                </p>
                            </div>
                        </div>
                        {/* <p className="my-2 text-center text-xl font-semibold not-italic leading-normal font-poppins text-gray-700">
                            New Account
                        </p> */}
                        <div className="space-y-2 mt-4 w-full">
                            <div className="grid grid-cols-1 w-full sm:grid-cols-2 gap-4">
                                <div>
                                    <TextInput
                                        name="firstname"
                                        errors={errors}
                                        control={control}
                                        placeholder="First Name"
                                        label="First Name"
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        name="lastname"
                                        errors={errors}
                                        control={control}
                                        placeholder="Last Name"
                                        label="Last Name"
                                    />
                                </div>
                            </div>
                            <div>
                                <EmailField
                                    name={"email"}
                                    control={control}
                                    errors={errors}
                                    placeholder="Enter Your Email"
                                    label="Email"
                                />
                            </div>
                            <div>
                                <PasswordField
                                    name={"password"}
                                    label="Password"
                                    placeholder="Enter Your Password"
                                    control={control}
                                    errors={errors}
                                />
                            </div>
                        </div>
                        <div className="w-full flex justify-center my-4 items-center">
                            <Button
                                onClick={handleSubmit(submitHandler)}
                                disabled={registerLoader}
                                className="flex w-full capitalize font-poppins not-italic leading-normal justify-center rounded-sm bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {registerLoader ? <Spinner /> : "Create Account"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddUser;
