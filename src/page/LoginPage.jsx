import { toastify } from "../components/toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, registerSchema } from "../common/constant/validation";
import { jwtDecode } from "jwt-decode";
import logo from "./../assets/konceptLogo.png";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/user";
import { setAuth } from "../redux/features/auth";
import { setLoader } from "../redux/features/loaders";
import Spinner from "../components/common/Spinner";
import { useState } from "react";
import { toastifyError } from "../constants/errors";

import InputField from "../common/fields/InputField";
import { Button } from "@material-tailwind/react";

const LoginPage = () => {

    const [loginPage, setLoginPage] = useState(true);
    const [registerPage, setRegisterPage] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm({
        resolver: yupResolver(registerPage === true ? registerSchema : loginSchema),
    });

    // changes made by abhyanshu

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loginLoader, registerLoader } = useSelector((state) => state.loaders);

    const submitHandler = async (data) => {
        try {
            const schema = loginPage ? loginSchema : registerSchema;
            const validData = schema.validateSync(data, { stripUnknown: true });

            if (loginPage === true) {
                dispatch(setLoader({ loginLoader: true }));
                const response = await axios.post(`https://t.kcptl.in/api/login`, validData);
                const { token } = response.data;
                localStorage.setItem("konceptLawToken", token);
                const user = await jwtDecode(localStorage.getItem("konceptLawToken"))
                    .foundUser;
                dispatch(setUser({ user }));
                localStorage.setItem("role", user.profile);
                localStorage.setItem("isAuthenticated", true);
                dispatch(
                    setAuth({ role: user.profile, isAuthenticated: true, token: token })
                );
                if (user.profile === "superAdmin") navigate("/dashboard");
                else navigate("/document");
                toastify({ msg: response.data.message, type: "success" });
            }
            else
                if (registerPage === true) {
                    dispatch(setLoader({ registerLoader: true }));
                    const response = await axios.post(`https://t.kcptl.in/account/post`, validData);
                    // console.log(response)
                    navigate("/login")
                    toastify({ msg: response.data.message, type: "success" });
                    reset();
                }
        } catch (error) {
            // if (error.response?.data) {
            //     toastify({ msg: error.response.data.message, type: "error" });
            // } else {
            //     toastify({ msg: error.message, type: "error" });
            // }
            toastifyError(error, (call) => {
                if (call) {
                    navigate("/login");
                }
            })
        } finally {
            dispatch(setLoader({ loginLoader: false }));
            dispatch(setLoader({ registerLoader: false }));
        }
    };

    return (
        <>
            {/* <div className="flex min-h-screen h-fit flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-lg all-side-box-shadow rounded-xl">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm p-10">
                        <div className="w-full flex flex-col items-center gap-2">
                            <div className=" w-[5rem] h-[3rem] flex">
                                <img src={logo} alt="logo" className=" w-full h-full" />
                            </div>
                            <div>
                                <p className=" text-2xl font-bold logo-color text-center ">
                                    Koncept Law Associates
                                </p>
                            </div>
                        </div>
                        <p className="mt-5 text-center text-xl font-semibold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </p>
                        <form
                            onSubmit={handleSubmit(submitHandler)}
                            className="space-y-6 mt-10"
                            action="#"
                            method="POST"
                        >
                            {registerPage === true ?
                                (<div>
                                    <label
                                        htmlFor="firstname"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        First Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="firstname"
                                            name="firstname"
                                            autoComplete="firstname"
                                            {...register("firstname")}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <p className="text-red-500">{errors.firstname?.message}</p>
                                    </div>
                                </div>)
                                :
                                ""
                            }

                            {registerPage === true ?
                                (<div>
                                    <label
                                        htmlFor="lastname"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="lastname"
                                            name="lastname"
                                            autoComplete="lastname"
                                            {...register("lastname")}
                                            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        <p className="text-red-500">{errors.lastname?.message}</p>
                                    </div>
                                </div>)
                                :
                                ""
                            }

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        {...register("email")}
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <p className="text-red-500">{errors.email?.message}</p>
                                </div>
                            </div>

                            {loginPage === true ? (<div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        {...register("password")}
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    <p className="text-red-500">{errors.password?.message}</p>
                                </div>
                            </div>) : ""}

                            {loginPage === true ? (<div>
                                <button
                                    type="submit"
                                    disabled={loginLoader}
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    {loginLoader ? <Spinner /> : "Log In"}
                                </button>
                            </div>) :
                                registerPage === true ?
                                    (<div>
                                        <button
                                            type="submit"
                                            disabled={registerLoader}
                                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            {registerLoader ? <Spinner /> : "Register"}
                                        </button>
                                    </div>) :
                                    ""
                            }
                        </form>
                        <div className="my-2">
                            {
                                loginPage === true ? (
                                    <div>
                                        <span>Don`t Have an Account ? </span>
                                        <button className="underline cursor-pointer text-blue-600 text-md mx-1" onClick={(e) => { e.preventDefault(); setLoginPage(false); setRegisterPage(true); navigate("/register") }}>Register</button>
                                    </div>
                                ) :
                                    registerPage === true ?
                                        (
                                            <div>
                                                <span>Already Have an Account ? </span>
                                                <button className="underline cursor-pointer text-blue-600 text-md mx-1" onClick={() => { setLoginPage(true); setRegisterPage(false); navigate("/login") }}>Login</button>
                                            </div>
                                        )
                                        : ""
                            }
                        </div>
                    </div>
                </div>

                <div className="bottom-0 w-full my-4">
                    <div className="p-6 rounded px-10 flex items-center justify-center">
                        <p>
                            Copyright ©{" "}
                            <Link to={"/"} className="text-gray-700 font-bold">
                                Koncept Law Associates
                            </Link>
                            . All rights reserved.
                        </p>
                    </div>
                </div>
            </div> */}

            <div className="flex justify-center koncept-background items-center w-full h-screen">
                <div className="flex flex-col justify-center w-3/4 h-[90vh] lg:w-[80%] items-center py-5 rounded-md border border-[#E2E2E2] bg-white/5 backdrop-blur-[30px] relative">
                    <div className="absolute font-poppins not-italic leading-normal flex flex-col justify-start text-white text-[15px] items-start top-2 left-2">
                        <h2 className="uppercase">kamal bahl</h2>
                        <h2 className="uppercase">ambika mehra</h2>
                        <h2 className="text-[13px]">(Advocates)</h2>
                    </div>

                    <div className="absolute font-poppins not-italic leading-normal flex flex-col justify-start text-white font-light text-[13px] items-start top-2 right-2 w-[250px]">
                        <h2>98, Priyadarshini Vihar Near Model Town Metro Station New Delhi - 110009</h2>
                        <h2 className="bg-[#FFFFFF] h-[1px] my-1 w-full"></h2>
                        <h2>Chamber No. 683, Western Wing Tis Hazari Court, Delhi - 110054 Mobile No. 9810201011, 9811193449</h2>
                        <h2>E-mail:konceptlegalllp@yahoo.in</h2>
                    </div>

                    <div className="w-full flex flex-col items-center my-2 gap-2">
                        <img src={logo} alt="logo" className="w-[80px]" />
                        <div>
                            <p className=" text-2xl font-bold logo-color font-poppins not-italic leading-normal text-center ">
                                Koncept Law Associates
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="space-y-3 w-[30%]"
                        action="#"
                        method="POST"
                    >
                        {registerPage === true ?
                            <InputField
                                control={control}
                                errors={errors}
                                type="text"
                                name="firstname"
                                label="First Name"
                                placeholder="Enter First Name"
                                labelClass="text-[#FFFFFF]"
                                className="text-[#FFFFFF] placeholder:text-[#FFFFFF] border-gray-300 font-light"
                            />
                            :
                            ""
                        }

                        {registerPage === true ?
                            <>
                                <InputField
                                    control={control}
                                    errors={errors}
                                    type="text"
                                    name="lastname"
                                    label="Last Name"
                                    placeholder="Enter Last Name"
                                    labelClass="text-[#FFFFFF]"
                                    className="text-[#FFFFFF] placeholder:text-[#FFFFFF] border-gray-300 font-light"
                                />
                            </>
                            :
                            ""
                        }

                        <InputField
                            control={control}
                            errors={errors}
                            type="text"
                            name="email"
                            label="Username"
                            placeholder="Enter Your User Name"
                            labelClass="text-[#FFFFFF]"
                            className="text-[#FFFFFF] placeholder:text-[#FFFFFF] border-gray-300 font-light"
                        />

                        {
                            loginPage === true ? <>
                                <InputField
                                    control={control}
                                    errors={errors}
                                    type="password"
                                    name="password"
                                    label="Password"
                                    placeholder="Enter Your Password"
                                    labelClass="text-[#FFFFFF]"
                                    className="text-[#FFFFFF] placeholder:text-[#FFFFFF] font-light"
                                />
                            </> : false
                        }

                        {loginPage === true ? (<div>
                            <Button type="submit" className="font-poppins bg-[#FFFFFF] text-[15px] py-2 flex justify-center items-center gap-x-1 rounded-sm w-full my-4 lg:my-6 capitalize">
                                {loginLoader ? <Spinner /> : <span className="koncept-text">Log In</span>}
                            </Button>
                        </div>) :
                            registerPage === true ?
                                (<div>
                                    <Button type="submit" className="font-poppins bg-[#FFFFFF] text-[15px] py-2 flex justify-center items-center gap-x-1 rounded-sm w-full my-4 lg:my-6 capitalize">
                                        {registerLoader ? <Spinner /> : <span className="koncept-text">Register</span>}
                                    </Button>
                                </div>) :
                                ""
                        }

                        <div className="my-2 w-full">
                            {
                                loginPage === true ? (
                                    <div>
                                        <div className="flex justify-center gap-x-1 text-[#FFFFFF] text-sm font-poppins font-light not-italic leading-normal items-center">
                                            <span>Don`t Have an Account ? </span>
                                            <button className="font-medium hover:underline" onClick={(e) => { e.preventDefault(); setLoginPage(false); setRegisterPage(true); navigate("/register") }}>Register</button>
                                        </div>
                                        <div className="flex justify-center gap-x-1 text-[#FFFFFF] text-sm font-poppins font-light not-italic leading-normal items-center">
                                            <span>Tracking Login ? </span>
                                            <button className="font-medium hover:underline" onClick={(e) => { e.preventDefault(); setLoginPage(false); setRegisterPage(true); navigate("/tracking-login") }}>Login</button>
                                        </div>
                                    </div>
                                ) :
                                    registerPage === true ?
                                        (
                                            <div>
                                                <div className="flex justify-center gap-x-1 text-[#FFFFFF] text-sm font-poppins font-light not-italic leading-normal items-center">
                                                    <span>Already Have an Account ? </span>
                                                    <button className="font-medium hover:underline" onClick={() => { setLoginPage(true); setRegisterPage(false); navigate("/login") }}>Login</button>
                                                </div>
                                            </div>
                                        )
                                        : ""
                            }
                        </div>

                        <h2 className="flex justify-center items-center w-full text-[#FFFFFF] text-[14px] not-italic leading-normal font-poppins font-light">
                            <p>
                                Copyright ©{" "}
                                <Link to={"/"} className="font-medium">
                                    Koncept Law Associates
                                </Link>
                                . All rights reserved.
                            </p>
                        </h2>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
